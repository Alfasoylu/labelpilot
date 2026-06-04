import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { getPrismaClient } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/send";
import { syncStoredDesignFromApprovedOrder } from "@/lib/artwork/stored-designs";
import { proofApproved } from "@/lib/email/templates/lifecycle";
import {
  type ProofDecisionPayload,
  validateProofDecisionRequest,
} from "@/lib/orders/proof-decision";
import {
  getOrderStatusLabel,
  getProofFileStatusLabel,
} from "@/lib/orders/artwork";

export const runtime = "nodejs";

function getApprovalIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (!forwarded) {
    return null;
  }

  return forwarded.split(",")[0]?.trim() || null;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ orderId: string; proofId: string }> },
) {
  const prisma = getPrismaClient();

  if (!prisma) {
    console.error("Proof-Freigabe nicht verfügbar: DATABASE_URL fehlt.");
    return NextResponse.json(
      { error: "Proof-Freigabe ist derzeit nicht verfügbar." },
      { status: 503 },
    );
  }

  const payload = (await request.json()) as ProofDecisionPayload;
  const { orderId, proofId } = await context.params;

  const payloadValidation = validateProofDecisionRequest(payload);
  if (!payloadValidation.ok) {
    return NextResponse.json(
      { error: payloadValidation.error },
      { status: payloadValidation.status },
    );
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
      proofFiles: {
        where: { id: proofId },
        take: 1,
      },
    },
  });

  const proofFile = order?.proofFiles[0];
  const snapshotValidation = validateProofDecisionRequest(payload, {
    orderExists: Boolean(order),
    uploadToken: order?.uploadToken ?? null,
    proofMatchesOrder: Boolean(proofFile),
    proofStatus: proofFile?.status ?? null,
    orderStatus: order?.status ?? "QUOTE_REQUESTED",
  });

  if (!snapshotValidation.ok) {
    return NextResponse.json(
      { error: snapshotValidation.error },
      { status: snapshotValidation.status },
    );
  }

  if (!order || !proofFile) {
    return NextResponse.json(
      { error: "Bestellung oder Proof wurde nicht gefunden." },
      { status: 404 },
    );
  }

  const ipAddress = getApprovalIp(request);

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (payload.decision === "approve") {
      const updatedProof = await tx.proofFile.update({
        where: { id: proofFile.id },
        data: {
          status: "APPROVED",
          customerApprovedAt: new Date(),
          customerApprovalIp: ipAddress,
          customerChangeRequestNote: null,
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          artworkStatus: "ARTWORK_APPROVED",
          status: "APPROVED_FOR_PRODUCTION",
        },
      });

      await tx.orderStatusEvent.create({
        data: {
          orderId: order.id,
          status: "APPROVED_FOR_PRODUCTION",
          note: "Proof durch Kunden freigegeben.",
        },
      });

      await syncStoredDesignFromApprovedOrder({
        tx,
        order,
        sourceType: "CUSTOMER_UPLOAD",
        originalArtworkFileId: order.artworkFiles[0]?.id ?? null,
        proofFileId: updatedProof.id,
        changeSummary: "Proof durch Kunden freigegeben.",
      });

      return {
        message: "Proof freigegeben. Die Bestellung ist für die Produktion vorbereitet.",
        proofStatusLabel: getProofFileStatusLabel(updatedProof.status),
        orderStatusLabel: getOrderStatusLabel("APPROVED_FOR_PRODUCTION"),
      };
    }

    const updatedProof = await tx.proofFile.update({
      where: { id: proofFile.id },
      data: {
        status: "CHANGES_REQUESTED",
        customerChangeRequestNote: payload.note?.trim() ?? null,
      },
    });

    if (order.artworkFiles[0]?.id) {
      await tx.artworkFile.update({
        where: { id: order.artworkFiles[0].id },
        data: {
          status: "UNDER_REVIEW",
        },
      });
    }

    await tx.order.update({
      where: { id: order.id },
      data: {
        artworkStatus: "ARTWORK_UPLOADED",
        status: "FILE_REVIEW",
      },
    });

    await tx.orderStatusEvent.create({
      data: {
        orderId: order.id,
        status: "FILE_REVIEW",
        note: payload.note?.trim() ?? "Änderungswunsch zum Proof eingegangen.",
      },
    });

    return {
      message: "Änderungswunsch gesendet. Wir prüfen die Anpassung und melden uns mit dem nächsten Proof.",
      proofStatusLabel: getProofFileStatusLabel(updatedProof.status),
      orderStatusLabel: getOrderStatusLabel("FILE_REVIEW"),
    };
  });

  if (payload.decision === "approve") {
    if (order.customerEmail) {
      const template = proofApproved({
        orderNumber: order.orderNumber,
      });

      try {
        await sendEmail({
          to: order.customerEmail,
          subject: template.subject,
          html: template.html,
          text: template.text,
        });
      } catch (error) {
        console.error("Proof-Freigabemail fehlgeschlagen:", error);
      }
    } else {
      console.debug(`Proof-Freigabemail übersprungen: keine E-Mail für ${order.id}.`);
    }
  }

  return NextResponse.json(result);
}
