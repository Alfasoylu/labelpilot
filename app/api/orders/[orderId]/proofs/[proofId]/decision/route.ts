import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { getPrismaClient } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/send";
import { proofApproved } from "@/lib/email/templates/lifecycle";
import {
  getOrderStatusLabel,
  getProofFileStatusLabel,
} from "@/lib/orders/artwork";

export const runtime = "nodejs";

type ProofDecisionPayload = {
  token?: string;
  decision?: "approve" | "request_changes";
  note?: string;
};

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
    console.error("Proof-Freigabe nicht verfuegbar: DATABASE_URL fehlt.");
    return NextResponse.json(
      { error: "Proof-Freigabe ist derzeit nicht verfuegbar." },
      { status: 503 },
    );
  }

  const payload = (await request.json()) as ProofDecisionPayload;
  const { orderId, proofId } = await context.params;

  if (!payload.token) {
    return NextResponse.json(
      { error: "Sie haben keinen Zugriff auf diese Bestellung." },
      { status: 403 },
    );
  }

  if (payload.decision !== "approve" && payload.decision !== "request_changes") {
    return NextResponse.json({ error: "Ungueltige Rueckmeldung." }, { status: 400 });
  }

  if (payload.decision === "request_changes" && !payload.note?.trim()) {
    return NextResponse.json(
      { error: "Bitte beschreiben Sie den Aenderungswunsch." },
      { status: 400 },
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      proofFiles: {
        where: { id: proofId },
        take: 1,
      },
    },
  });

  if (!order || order.uploadToken !== payload.token || order.proofFiles.length === 0) {
    return NextResponse.json(
      { error: "Sie haben keinen Zugriff auf diese Bestellung." },
      { status: 403 },
    );
  }

  const proofFile = order.proofFiles[0];

  if (proofFile.status !== "WAITING_CUSTOMER_APPROVAL") {
    return NextResponse.json(
      { error: "Fuer diesen Proof ist derzeit keine Rueckmeldung moeglich." },
      { status: 409 },
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

      return {
        message: "Proof freigegeben. Die Bestellung ist fuer die Produktion vorbereitet.",
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
        note: payload.note?.trim() ?? "Aenderungswunsch zum Proof eingegangen.",
      },
    });

    return {
      message: "Aenderungswunsch gesendet. Wir pruefen die Anpassung und melden uns mit dem naechsten Proof.",
      proofStatusLabel: getProofFileStatusLabel(updatedProof.status),
      orderStatusLabel: getOrderStatusLabel("FILE_REVIEW"),
    };
  });

  if (payload.decision === "approve") {
    if (order.customerEmail) {
      const template = proofApproved({
        orderNumber: order.orderNumber,
      });

      await sendEmail({
        to: order.customerEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
    } else {
      console.debug(`Proof-Freigabemail uebersprungen: keine E-Mail fuer ${order.id}.`);
    }
  }

  return NextResponse.json(result);
}
