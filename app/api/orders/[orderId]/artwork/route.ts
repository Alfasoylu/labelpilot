import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { getPrismaClient } from "@/lib/db/prisma";
import { getServerEnv } from "@/lib/env";
import { sendEmail } from "@/lib/email/send";
import { artworkUploadedOpsNotification } from "@/lib/email/templates/lifecycle";
import { validateArtworkFile } from "@/lib/file-validation/artwork";
import { getArtworkFileStatusLabel } from "@/lib/orders/artwork";
import { canCustomerUploadArtwork } from "@/lib/orders/status";
import {
  getStoredObjectSize,
  removeStoredObject,
  uploadArtwork,
} from "@/lib/storage/artwork";

export const runtime = "nodejs";

// Legacy multipart fallback only — Vercel rejects bodies over ~4.5 MB before the
// handler runs, so larger files must go through the signed-upload flow
// (POST /artwork/upload-url, browser PUT to storage, then JSON registration here).
const MAX_PROXY_UPLOAD_BYTES = 4 * 1024 * 1024;

const registrationSchema = z.object({
  token: z.string().min(1),
  storagePath: z.string().min(1).max(500),
  fileName: z.string().min(1).max(300),
  mimeType: z.string().max(200),
});

function formatDateLabel(value: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

type OrderForUpload = {
  id: string;
  orderNumber: string;
  status: string;
  customerEmail: string;
  uploadToken: string;
  uploadTokenExpiresAt: Date | null;
  artworkStatus: string;
};

async function loadOrderForUpload(orderId: string, token: string) {
  const prisma = getPrismaClient();
  if (!prisma) {
    return { error: NextResponse.json({ error: "Upload ist derzeit nicht verfügbar." }, { status: 503 }) };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      customerEmail: true,
      uploadToken: true,
      uploadTokenExpiresAt: true,
      artworkStatus: true,
    },
  });

  if (!order || order.uploadToken !== token) {
    return { error: NextResponse.json({ error: "Sie haben keinen Zugriff auf diese Bestellung." }, { status: 403 }) };
  }

  if (order.uploadTokenExpiresAt && Date.now() > order.uploadTokenExpiresAt.getTime()) {
    return { error: NextResponse.json({ error: "Ihr Upload-Link ist abgelaufen. Bitte fordern Sie einen neuen Link an." }, { status: 403 }) };
  }

  if (!canCustomerUploadArtwork(order.status)) {
    return { error: NextResponse.json({ error: "Für diese Bestellung können derzeit keine Druckdaten hochgeladen werden." }, { status: 409 }) };
  }

  return { order: order as OrderForUpload };
}

/**
 * Records the uploaded file on the order, supersedes stale proofs, rotates the
 * upload token and notifies ops. Shared by the legacy proxy path and the
 * signed-upload registration path.
 */
async function finalizeArtworkUpload(input: {
  order: OrderForUpload;
  storagePath: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}) {
  const prisma = getPrismaClient();
  if (!prisma) {
    throw new Error("DATABASE_URL fehlt.");
  }

  const { order } = input;
  const nextOrderStatus = "FILE_REVIEW" as const;
  const newUploadToken = randomUUID();
  const newUploadTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const createdFile = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.proofFile.updateMany({
      where: {
        orderId: order.id,
        status: {
          in: [
            "PENDING_ADMIN_UPLOAD",
            "WAITING_CUSTOMER_APPROVAL",
            "APPROVED",
            "CHANGES_REQUESTED",
          ],
        },
      },
      data: {
        status: "SUPERSEDED",
      },
    });

    const artworkFile = await tx.artworkFile.create({
      data: {
        orderId: order.id,
        storagePath: input.storagePath,
        fileName: input.fileName,
        mimeType: input.mimeType || "application/octet-stream",
        sizeBytes: input.sizeBytes,
        status: "UPLOADED",
      },
    });

    await tx.order.update({
      where: { id: order.id },
      data: {
        artworkStatus: "ARTWORK_UPLOADED",
        status: nextOrderStatus,
        uploadToken: newUploadToken,
        uploadTokenExpiresAt: newUploadTokenExpiresAt,
      },
    });

    await tx.orderStatusEvent.create({
      data: {
        orderId: order.id,
        status: nextOrderStatus,
        note: "Druckdaten hochgeladen.",
      },
    });

    return artworkFile;
  });

  const adminNotifyEmail =
    getServerEnv().ADMIN_NOTIFY_EMAIL || getServerEnv().EMAIL_REPLY_TO;

  if (adminNotifyEmail && order.customerEmail) {
    const template = artworkUploadedOpsNotification({
      orderNumber: order.orderNumber,
      customerEmail: order.customerEmail,
      orderId: order.id,
    });

    try {
      await sendEmail({
        to: adminNotifyEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
    } catch (error) {
      console.error("Ops-Benachrichtigung nach Artwork-Upload fehlgeschlagen:", error);
    }
  }

  return NextResponse.json({
    message: "Datei erfolgreich hochgeladen. Die Datei wird geprüft.",
    newToken: newUploadToken,
    file: {
      id: createdFile.id,
      fileName: createdFile.fileName,
      sizeBytes: createdFile.sizeBytes,
      statusLabel: getArtworkFileStatusLabel(createdFile.status),
      downloadHref: `/api/orders/${order.id}/artwork/${createdFile.id}?token=${encodeURIComponent(newUploadToken)}`,
      createdAtLabel: formatDateLabel(createdFile.createdAt),
    },
  });
}

/**
 * Step 2 of the signed-upload flow: the browser already PUT the file directly
 * to Supabase Storage; this verifies the stored object (real size, allowed
 * path) and registers it on the order.
 */
async function handleRegistration(orderId: string, request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = registrationSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const lookup = await loadOrderForUpload(orderId, parsed.data.token);
  if (lookup.error) return lookup.error;
  const order = lookup.order;

  // The path was issued by /artwork/upload-url for exactly this order.
  if (!parsed.data.storagePath.startsWith(`orders/${order.id}/artwork/`)) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const realSize = await getStoredObjectSize(parsed.data.storagePath);
  if (realSize === null) {
    return NextResponse.json(
      { error: "Upload fehlgeschlagen. Bitte versuchen Sie es erneut." },
      { status: 400 },
    );
  }

  // Authoritative validation against the REAL stored size, not the declared one.
  const validation = validateArtworkFile({
    name: parsed.data.fileName,
    size: realSize,
    type: parsed.data.mimeType,
  });

  if (!validation.ok) {
    await removeStoredObject(parsed.data.storagePath).catch(() => undefined);
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  try {
    return await finalizeArtworkUpload({
      order,
      storagePath: parsed.data.storagePath,
      fileName: validation.sanitizedFileName,
      mimeType: parsed.data.mimeType,
      sizeBytes: realSize,
    });
  } catch (error) {
    console.error("Artwork-Registrierung fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Upload fehlgeschlagen. Bitte versuchen Sie es erneut." },
      { status: 500 },
    );
  }
}

/** Legacy proxy upload — only viable for files under the Vercel body limit. */
async function handleMultipartUpload(orderId: string, request: Request) {
  const contentLength = request.headers.get("content-length");
  if (contentLength !== null && parseInt(contentLength, 10) > MAX_PROXY_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "Die Datei ist zu gross für den direkten Upload. Bitte laden Sie die Seite neu und versuchen Sie es erneut." },
      { status: 413 },
    );
  }

  const formData = await request.formData();
  const token = formData.get("token") ?? new URL(request.url).searchParams.get("token");
  const file = formData.get("file");

  if (typeof token !== "string" || !token) {
    return NextResponse.json({ error: "Sie haben keinen Zugriff auf diese Bestellung." }, { status: 403 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Bitte laden Sie eine Druckdatei hoch oder senden Sie diese später." },
      { status: 400 },
    );
  }

  const lookup = await loadOrderForUpload(orderId, token);
  if (lookup.error) return lookup.error;
  const order = lookup.order;

  const validation = validateArtworkFile(file);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  try {
    const storagePath = await uploadArtwork(order.id, file, validation.sanitizedFileName);
    return await finalizeArtworkUpload({
      order,
      storagePath,
      fileName: validation.sanitizedFileName,
      mimeType: file.type,
      sizeBytes: file.size,
    });
  } catch (error) {
    console.error("Artwork-Upload fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Upload fehlgeschlagen. Bitte versuchen Sie es erneut." },
      { status: 500 },
    );
  }
}

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
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return handleRegistration(orderId, request);
  }

  return handleMultipartUpload(orderId, request);
}
