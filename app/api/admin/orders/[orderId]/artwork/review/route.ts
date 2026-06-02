import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { getPrismaClient } from "@/lib/db/prisma";

export const runtime = "nodejs";

type ReviewAction = "under_review" | "approve" | "request_correction";

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
      { error: "Review ist derzeit nicht verfuegbar." },
      { status: 503 },
    );
  }

  const { orderId } = await context.params;
  const formData = await request.formData();
  const artworkFileId = formData.get("artworkFileId");
  const action = formData.get("action");
  const noteValue = formData.get("note");
  const redirectToValue = formData.get("redirectTo");
  const note = typeof noteValue === "string" ? noteValue.trim() : "";
  const redirectTo =
    typeof redirectToValue === "string" && redirectToValue ? redirectToValue : `/admin/orders/${orderId}`;

  if (
    typeof artworkFileId !== "string" ||
    typeof action !== "string" ||
    !["under_review", "approve", "request_correction"].includes(action)
  ) {
    return redirectWithMessage(request, redirectTo, {
      error: "Ungueltige Review-Anfrage.",
    });
  }

  if (action === "request_correction" && !note) {
    return redirectWithMessage(request, redirectTo, {
      error: "Bitte geben Sie einen sichtbaren Korrekturhinweis an.",
    });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      artworkFiles: {
        where: { id: artworkFileId },
        take: 1,
      },
    },
  });

  if (!order || order.artworkFiles.length === 0) {
    return redirectWithMessage(request, redirectTo, {
      error: "Bestellung oder Datei wurde nicht gefunden.",
    });
  }

  const artworkFile = order.artworkFiles[0];
  const allowedStatuses = new Set(["FILE_REVIEW", "CORRECTION_REQUIRED", "PAID", "PROOF_REQUIRED"]);

  if (!allowedStatuses.has(order.status)) {
    return redirectWithMessage(request, redirectTo, {
      error: "Dieser Statuswechsel ist nicht erlaubt.",
    });
  }

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (action === "under_review") {
      await tx.artworkFile.update({
        where: { id: artworkFile.id },
        data: {
          status: "UNDER_REVIEW",
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "FILE_REVIEW",
          artworkStatus: "ARTWORK_UPLOADED",
        },
      });

      await tx.orderStatusEvent.create({
        data: {
          orderId: order.id,
          status: "FILE_REVIEW",
          note: note || "Datei in technischer Pruefung.",
        },
      });

      return;
    }

    if (action === "approve") {
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
          note: note || "Datei fuer Produktion freigegeben.",
        },
      });

      return;
    }

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
        note,
      },
    });
  });

  const successMessage =
    action === "approve"
      ? "Datei freigegeben."
      : action === "under_review"
        ? "Datei zur Pruefung markiert."
        : "Korrektur wurde angefordert.";

  return redirectWithMessage(request, redirectTo, {
    message: successMessage,
  });
}
