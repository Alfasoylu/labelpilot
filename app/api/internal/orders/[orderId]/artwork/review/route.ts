import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { getPrismaClient } from "@/lib/db/prisma";
import { isOperatorRequestAuthorized } from "@/lib/security/operator";

export const runtime = "nodejs";

type ReviewAction =
  | "approve_for_production"
  | "request_correction"
  | "require_proof";

type ReviewPayload = {
  artworkFileId?: string;
  action?: ReviewAction;
  note?: string;
  customerMessage?: string;
};

const allowedActions = new Set<ReviewAction>([
  "approve_for_production",
  "request_correction",
  "require_proof",
]);

export async function POST(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  const prisma = getPrismaClient();

  if (!prisma) {
    console.error("Artwork-Review nicht verfuegbar: DATABASE_URL fehlt.");
    return NextResponse.json(
      { error: "Review ist derzeit nicht verfuegbar." },
      { status: 503 },
    );
  }

  try {
    if (!isOperatorRequestAuthorized(request)) {
      return NextResponse.json({ error: "Zugriff verweigert." }, { status: 401 });
    }
  } catch (error) {
    console.error("Artwork-Review nicht verfuegbar:", error);
    return NextResponse.json(
      { error: "Review ist derzeit nicht verfuegbar." },
      { status: 503 },
    );
  }

  const payload = (await request.json()) as ReviewPayload;
  const { orderId } = await context.params;

  if (!payload.artworkFileId || !payload.action || !allowedActions.has(payload.action)) {
    return NextResponse.json({ error: "Ungueltige Review-Anfrage." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      artworkFiles: {
        where: { id: payload.artworkFileId },
      },
    },
  });

  if (!order || order.artworkFiles.length === 0) {
    return NextResponse.json({ error: "Bestellung oder Datei nicht gefunden." }, { status: 404 });
  }

  const artworkFile = order.artworkFiles[0];
  const noteParts = [payload.note?.trim(), payload.customerMessage?.trim()].filter(Boolean);
  const note = noteParts.length > 0 ? noteParts.join(" | ") : null;

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (payload.action === "approve_for_production") {
      await tx.artworkFile.update({
        where: { id: artworkFile.id },
        data: {
          status: "APPROVED",
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
          note: note ?? "Datei fuer Produktion freigegeben.",
        },
      });

      return;
    }

    if (payload.action === "request_correction") {
      await tx.artworkFile.update({
        where: { id: artworkFile.id },
        data: {
          status: "CORRECTION_REQUIRED",
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          artworkStatus: "ARTWORK_UPLOADED",
          status: "CORRECTION_REQUIRED",
        },
      });

      await tx.orderStatusEvent.create({
        data: {
          orderId: order.id,
          status: "CORRECTION_REQUIRED",
          note: note ?? "Korrektur an Druckdaten angefordert.",
        },
      });

      return;
    }

    await tx.artworkFile.update({
      where: { id: artworkFile.id },
      data: {
        status: "APPROVED",
      },
    });

    await tx.order.update({
      where: { id: order.id },
      data: {
        artworkStatus: "ARTWORK_UPLOADED",
        status: "PROOF_REQUIRED",
      },
    });

    await tx.orderStatusEvent.create({
      data: {
        orderId: order.id,
        status: "PROOF_REQUIRED",
        note: note ?? "Proof vor Produktion erforderlich.",
      },
    });
  });

  return NextResponse.json({ ok: true });
}
