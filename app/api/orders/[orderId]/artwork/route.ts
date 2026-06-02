import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { getPrismaClient } from "@/lib/db/prisma";
import { validateArtworkFile } from "@/lib/file-validation/artwork";
import { getArtworkFileStatusLabel } from "@/lib/orders/artwork";
import { uploadArtwork } from "@/lib/storage/artwork";

export const runtime = "nodejs";

function formatDateLabel(value: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  const prisma = getPrismaClient();

  if (!prisma) {
    console.error("Upload nicht verfuegbar: DATABASE_URL fehlt.");
    return NextResponse.json(
      { error: "Upload ist derzeit nicht verfuegbar." },
      { status: 503 },
    );
  }

  const { orderId } = await context.params;
  const formData = await request.formData();
  const token = formData.get("token") ?? new URL(request.url).searchParams.get("token");
  const file = formData.get("file");

  if (typeof token !== "string" || !token) {
    return NextResponse.json({ error: "Sie haben keinen Zugriff auf diese Bestellung." }, { status: 403 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Bitte laden Sie eine Druckdatei hoch oder senden Sie diese spaeter." },
      { status: 400 },
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      uploadToken: true,
      artworkStatus: true,
    },
  });

  if (!order || order.uploadToken !== token) {
    return NextResponse.json({ error: "Sie haben keinen Zugriff auf diese Bestellung." }, { status: 403 });
  }

  if (order.status === "PENDING_PAYMENT" || order.status === "PAYMENT_FAILED" || order.status === "CANCELLED") {
    return NextResponse.json(
      { error: "Fuer diese Bestellung koennen derzeit keine Druckdaten hochgeladen werden." },
      { status: 409 },
    );
  }

  const validation = validateArtworkFile(file);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  try {
    const storagePath = await uploadArtwork(order.id, file, validation.sanitizedFileName);
    const nextOrderStatus =
      order.status === "PENDING_PAYMENT" ||
      order.status === "PAYMENT_FAILED" ||
      order.status === "CANCELLED"
        ? order.status
        : "FILE_REVIEW";
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
          storagePath,
          fileName: validation.sanitizedFileName,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          status: "UPLOADED",
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          artworkStatus: "ARTWORK_UPLOADED",
          status: nextOrderStatus,
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

    return NextResponse.json({
      message: "Datei erfolgreich hochgeladen. Die Datei wird geprueft.",
      file: {
        id: createdFile.id,
        fileName: createdFile.fileName,
        sizeBytes: createdFile.sizeBytes,
        statusLabel: getArtworkFileStatusLabel(createdFile.status),
        downloadHref: `/api/orders/${order.id}/artwork/${createdFile.id}?token=${encodeURIComponent(token)}`,
        createdAtLabel: formatDateLabel(createdFile.createdAt),
      },
    });
  } catch (error) {
    console.error("Artwork-Upload fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Upload fehlgeschlagen. Bitte versuchen Sie es erneut." },
      { status: 500 },
    );
  }
}
