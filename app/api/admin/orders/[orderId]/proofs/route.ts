import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { getPrismaClient } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/send";
import { proofReady } from "@/lib/email/templates/lifecycle";
import { canUploadProofForOrderStatus } from "@/lib/orders/status";
import { validateProofFile } from "@/lib/file-validation/artwork";
import { uploadProofFile } from "@/lib/storage/artwork";

export const runtime = "nodejs";

function redirectWithMessage(request: Request, redirectTo: string, params: Record<string, string>) {
  const destination = new URL(redirectTo || request.url, request.url);

  for (const [key, value] of Object.entries(params)) {
    destination.searchParams.set(key, value);
  }

  return NextResponse.redirect(destination, 303);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return NextResponse.json(
      { error: "Proof-Upload ist derzeit nicht verfügbar." },
      { status: 503 },
    );
  }

  const { orderId } = await context.params;
  const formData = await request.formData();
  const file = formData.get("file");
  const redirectToValue = formData.get("redirectTo");
  const noteValue = formData.get("note");
  const redirectTo =
    typeof redirectToValue === "string" && redirectToValue ? redirectToValue : `/admin/orders/${orderId}`;
  const note = typeof noteValue === "string" && noteValue.trim() ? noteValue.trim() : null;

  if (!(file instanceof File)) {
    return redirectWithMessage(request, redirectTo, {
      error: "Bitte laden Sie einen Proof hoch.",
    });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      artworkFiles: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!order) {
    return redirectWithMessage(request, redirectTo, {
      error: "Bestellung wurde nicht gefunden.",
    });
  }

  if (!canUploadProofForOrderStatus(order.status)) {
    return redirectWithMessage(request, redirectTo, {
      error: "Dieser Statuswechsel ist nicht erlaubt.",
    });
  }

  const validation = validateProofFile(file);

  if (!validation.ok) {
    return redirectWithMessage(request, redirectTo, {
      error: validation.message,
    });
  }

  try {
    const storagePath = await uploadProofFile(order.id, file, validation.sanitizedFileName);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

      if (order.artworkFiles[0]) {
        await tx.artworkFile.update({
          where: { id: order.artworkFiles[0].id },
          data: {
            status: "APPROVED",
          },
        });
      }

      await tx.proofFile.create({
        data: {
          orderId: order.id,
          storagePath,
          fileName: validation.sanitizedFileName,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          status: "WAITING_CUSTOMER_APPROVAL",
          adminNote: note,
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          artworkStatus: "ARTWORK_APPROVED",
          status: "WAITING_CUSTOMER_APPROVAL",
        },
      });

      await tx.orderStatusEvent.create({
        data: {
          orderId: order.id,
          status: "WAITING_CUSTOMER_APPROVAL",
          note: note || "Proof hochgeladen und zur Freigabe bereitgestellt.",
        },
      });
    });
  } catch (error) {
    console.error("Proof-Upload fehlgeschlagen:", error);
    return redirectWithMessage(request, redirectTo, {
      error: "Proof konnte nicht hochgeladen werden.",
    });
  }

  if (order.customerEmail) {
    const template = proofReady({
      orderId: order.id,
      orderNumber: order.orderNumber,
      uploadToken: order.uploadToken,
    });

    await sendEmail({
      to: order.customerEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  } else {
    console.debug(`Proof-Mail übersprungen: keine E-Mail für ${order.id}.`);
  }

  return redirectWithMessage(request, redirectTo, {
    message: "Proof hochgeladen.",
  });
}
