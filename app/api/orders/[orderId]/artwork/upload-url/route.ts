import { NextResponse } from "next/server";
import { z } from "zod";

import { getPrismaClient } from "@/lib/db/prisma";
import { validateArtworkFile } from "@/lib/file-validation/artwork";
import { canCustomerUploadArtwork } from "@/lib/orders/status";
import {
  buildArtworkStoragePath,
  createSignedArtworkUploadUrl,
} from "@/lib/storage/artwork";

export const runtime = "nodejs";

const bodySchema = z.object({
  token: z.string().min(1),
  fileName: z.string().min(1).max(300),
  fileType: z.string().max(200),
  fileSize: z.number().int().positive(),
});

/**
 * Step 1 of the direct-to-storage upload flow: validate the declared file
 * metadata and hand the browser a signed Supabase Storage upload URL. The
 * actual bytes never pass through a Vercel function (4.5 MB body limit).
 * The file only becomes part of the order after the registration POST to
 * /api/orders/[orderId]/artwork verifies the stored object.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  const prisma = getPrismaClient();

  if (!prisma) {
    console.error("Upload nicht verfügbar: DATABASE_URL fehlt.");
    return NextResponse.json(
      { error: "Upload ist derzeit nicht verfügbar." },
      { status: 503 },
    );
  }

  const { orderId } = await context.params;
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      uploadToken: true,
      uploadTokenExpiresAt: true,
    },
  });

  if (!order || order.uploadToken !== parsed.data.token) {
    return NextResponse.json(
      { error: "Sie haben keinen Zugriff auf diese Bestellung." },
      { status: 403 },
    );
  }

  if (order.uploadTokenExpiresAt && Date.now() > order.uploadTokenExpiresAt.getTime()) {
    return NextResponse.json(
      { error: "Ihr Upload-Link ist abgelaufen. Bitte fordern Sie einen neuen Link an." },
      { status: 403 },
    );
  }

  if (!canCustomerUploadArtwork(order.status)) {
    return NextResponse.json(
      { error: "Für diese Bestellung können derzeit keine Druckdaten hochgeladen werden." },
      { status: 409 },
    );
  }

  const validation = validateArtworkFile({
    name: parsed.data.fileName,
    size: parsed.data.fileSize,
    type: parsed.data.fileType,
  });

  if (!validation.ok) {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  try {
    const storagePath = buildArtworkStoragePath(order.id, validation.sanitizedFileName);
    const uploadUrl = await createSignedArtworkUploadUrl(storagePath);

    return NextResponse.json({
      uploadUrl,
      storagePath,
      sanitizedFileName: validation.sanitizedFileName,
    });
  } catch (error) {
    console.error("Signierte Upload-URL fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Upload ist derzeit nicht verfügbar. Bitte versuchen Sie es erneut." },
      { status: 500 },
    );
  }
}
