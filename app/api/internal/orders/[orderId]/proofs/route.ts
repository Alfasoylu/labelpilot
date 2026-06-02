import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { getPrismaClient } from "@/lib/db/prisma";
import { validateProofFile } from "@/lib/file-validation/artwork";
import { isOperatorRequestAuthorized } from "@/lib/security/operator";
import { uploadProofFile } from "@/lib/storage/artwork";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  const prisma = getPrismaClient();

  if (!prisma) {
    console.error("Proof-Upload nicht verfuegbar: DATABASE_URL fehlt.");
    return NextResponse.json(
      { error: "Proof-Upload ist derzeit nicht verfuegbar." },
      { status: 503 },
    );
  }

  try {
    if (!isOperatorRequestAuthorized(request)) {
      return NextResponse.json({ error: "Zugriff verweigert." }, { status: 401 });
    }
  } catch (error) {
    console.error("Proof-Upload nicht verfuegbar:", error);
    return NextResponse.json(
      { error: "Proof-Upload ist derzeit nicht verfuegbar." },
      { status: 503 },
    );
  }

  const { orderId } = await context.params;
  const formData = await request.formData();
  const file = formData.get("file");
  const noteValue = formData.get("note");
  const note = typeof noteValue === "string" && noteValue.trim() ? noteValue.trim() : null;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Bitte laden Sie einen Proof hoch." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Bestellung nicht gefunden." }, { status: 404 });
  }

  const validation = validateProofFile(file);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  try {
    const storagePath = await uploadProofFile(order.id, file, validation.sanitizedFileName);

    const proofFile = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.proofFile.updateMany({
        where: {
          orderId: order.id,
          status: {
            in: ["PENDING_ADMIN_UPLOAD", "WAITING_CUSTOMER_APPROVAL", "CHANGES_REQUESTED"],
          },
        },
        data: {
          status: "SUPERSEDED",
        },
      });

      const createdProof = await tx.proofFile.create({
        data: {
          orderId: order.id,
          storagePath,
          fileName: validation.sanitizedFileName,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          status: "WAITING_CUSTOMER_APPROVAL",
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "WAITING_CUSTOMER_APPROVAL",
        },
      });

      await tx.orderStatusEvent.create({
        data: {
          orderId: order.id,
          status: "WAITING_CUSTOMER_APPROVAL",
          note: note ?? "Proof hochgeladen und zur Freigabe bereitgestellt.",
        },
      });

      return createdProof;
    });

    return NextResponse.json({
      ok: true,
      proofFileId: proofFile.id,
    });
  } catch (error) {
    console.error("Proof-Upload fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Proof-Upload fehlgeschlagen." },
      { status: 500 },
    );
  }
}
