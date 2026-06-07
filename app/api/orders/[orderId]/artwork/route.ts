import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { getPrismaClient } from "@/lib/db/prisma";
import { getServerEnv } from "@/lib/env";
import { sendEmail } from "@/lib/email/send";
import { artworkUploadedOpsNotification } from "@/lib/email/templates/lifecycle";
import { validateArtworkFile } from "@/lib/file-validation/artwork";
import { getArtworkFileStatusLabel } from "@/lib/orders/artwork";
import { canCustomerUploadArtwork } from "@/lib/orders/status";
import { uploadArtwork } from "@/lib/storage/artwork";

export const runtime = "nodejs";

// Disable the default body parser so Next.js does not buffer the full request
// before we can check the Content-Length header.
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

// Maximum allowed upload size in bytes (150 MB — matches the largest artwork rule).
const MAX_UPLOAD_BYTES = 150 * 1024 * 1024;

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
    console.error("Upload nicht verfügbar: DATABASE_URL fehlt.");
    return NextResponse.json(
      { error: "Upload ist derzeit nicht verfügbar." },
      { status: 503 },
    );
  }

  const { orderId } = await context.params;

  // Early size guard — reject oversized requests before buffering the body.
  const contentLength = request.headers.get("content-length");
  if (contentLength !== null && parseInt(contentLength, 10) > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "Die Datei ist zu gross. Bitte laden Sie eine kleinere Datei hoch oder kontaktieren Sie uns." },
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
    return NextResponse.json({ error: "Sie haben keinen Zugriff auf diese Bestellung." }, { status: 403 });
  }

  if (order.uploadTokenExpiresAt && Date.now() > order.uploadTokenExpiresAt.getTime()) {
    return NextResponse.json({ error: "Ihr Upload-Link ist abgelaufen. Bitte fordern Sie einen neuen Link an." }, { status: 403 });
  }

  if (!canCustomerUploadArtwork(order.status)) {
    return NextResponse.json(
      { error: "Für diese Bestellung können derzeit keine Druckdaten hochgeladen werden." },
      { status: 409 },
    );
  }

  const validation = validateArtworkFile(file);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  try {
    const storagePath = await uploadArtwork(order.id, file, validation.sanitizedFileName);
    // PENDING_PAYMENT / PAYMENT_FAILED / CANCELLED are already rejected with 409
    // above, so any reachable upload moves the order into technical file review.
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

    const adminNotifyEmail = getServerEnv().ADMIN_NOTIFY_EMAIL;

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
      file: {
        id: createdFile.id,
        fileName: createdFile.fileName,
        sizeBytes: createdFile.sizeBytes,
        statusLabel: getArtworkFileStatusLabel(createdFile.status),
        downloadHref: `/api/orders/${order.id}/artwork/${createdFile.id}?token=${encodeURIComponent(newUploadToken)}`,
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
