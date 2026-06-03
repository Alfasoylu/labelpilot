import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getPrismaClient } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/send";
import { shippedOrderCustomer } from "@/lib/email/templates/lifecycle";
import { canTransitionOrderStatus } from "@/lib/orders/status";

const shipmentSchema = z.object({
  shippingMode: z.string().trim().optional(),
  shippingCarrier: z.string().trim().optional(),
  trackingNumber: z.string().trim().optional(),
  trackingUrl: z
    .union([z.literal(""), z.string().trim().url("Bitte geben Sie eine gueltige Tracking-URL ein.")])
    .transform((value) => (value === "" ? null : value))
    .optional(),
  packageCount: z
    .union([z.literal(""), z.coerce.number().int().positive()])
    .transform((value) => (value === "" ? null : value)),
  shipmentWeightKg: z
    .union([z.literal(""), z.coerce.number().positive()])
    .transform((value) => (value === "" ? null : value)),
  shippedAt: z
    .union([z.literal(""), z.string().trim()])
    .transform((value) => (value === "" ? null : value)),
  estimatedDeliveryAt: z
    .union([z.literal(""), z.string().trim()])
    .transform((value) => (value === "" ? null : value)),
  shipmentNote: z.string().trim().optional(),
  markShipped: z.union([z.literal("yes"), z.literal("no")]).default("no"),
  markDelivered: z.union([z.literal("yes"), z.literal("no")]).default("no"),
});

function buildRedirectUrl(request: Request, orderId: string, search: Record<string, string>) {
  const url = new URL(`/admin/orders/${orderId}`, request.url);
  for (const [key, value] of Object.entries(search)) {
    url.searchParams.set(key, value);
  }
  return url;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  const prisma = getPrismaClient();
  const { orderId } = await context.params;

  if (!prisma) {
    return NextResponse.redirect(
      buildRedirectUrl(request, orderId, { error: "Datenbankverbindung fehlt." }),
      { status: 303 },
    );
  }

  const formData = await request.formData();
  const parsed = shipmentSchema.safeParse({
    shippingMode: formData.get("shippingMode"),
    shippingCarrier: formData.get("shippingCarrier"),
    trackingNumber: formData.get("trackingNumber"),
    trackingUrl: formData.get("trackingUrl"),
    packageCount: formData.get("packageCount"),
    shipmentWeightKg: formData.get("shipmentWeightKg"),
    shippedAt: formData.get("shippedAt"),
    estimatedDeliveryAt: formData.get("estimatedDeliveryAt"),
    shipmentNote: formData.get("shipmentNote"),
    markShipped: formData.get("markShipped") === "yes" ? "yes" : "no",
    markDelivered: formData.get("markDelivered") === "yes" ? "yes" : "no",
  });

  if (!parsed.success) {
    return NextResponse.redirect(
      buildRedirectUrl(request, orderId, {
        error: parsed.error.issues[0]?.message ?? "Bitte pruefen Sie die Versandangaben.",
      }),
      { status: 303 },
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return NextResponse.redirect(
      buildRedirectUrl(request, orderId, { error: "Bestellung wurde nicht gefunden." }),
      { status: 303 },
    );
  }

  const values = parsed.data;
  const nextStatus =
    values.markDelivered === "yes"
      ? "DELIVERED"
      : values.markShipped === "yes"
        ? "SHIPPED"
        : order.status;

  if (nextStatus !== order.status && !canTransitionOrderStatus(order.status, nextStatus)) {
    return NextResponse.redirect(
      buildRedirectUrl(request, orderId, { error: "Dieser Statuswechsel ist nicht erlaubt." }),
      { status: 303 },
    );
  }

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        shippingMode: values.shippingMode || null,
        shippingCarrier: values.shippingCarrier || null,
        trackingNumber: values.trackingNumber || null,
        trackingUrl: values.trackingUrl ?? null,
        packageCount: values.packageCount,
        shipmentWeightKg: values.shipmentWeightKg,
        shippedAt: values.markShipped === "yes"
          ? values.shippedAt
            ? new Date(values.shippedAt)
            : order.shippedAt ?? new Date()
          : values.shippedAt
            ? new Date(values.shippedAt)
            : order.shippedAt,
        estimatedDeliveryAt: values.estimatedDeliveryAt
          ? new Date(values.estimatedDeliveryAt)
          : null,
        deliveredAt: values.markDelivered === "yes" ? new Date() : order.deliveredAt,
        shipmentNote: values.shipmentNote || null,
        status: nextStatus,
      },
    });

    if (nextStatus !== order.status) {
      await tx.orderStatusEvent.create({
        data: {
          orderId: order.id,
          status: nextStatus,
          note:
            nextStatus === "SHIPPED"
              ? `Sendung erfasst${values.trackingNumber ? `: ${values.trackingNumber}` : "."}`
              : "Sendung als zugestellt markiert.",
        },
      });
    }
  });

  if (nextStatus === "SHIPPED" && order.status !== "SHIPPED" && order.customerEmail) {
    const template = shippedOrderCustomer({
      orderId: order.id,
      orderNumber: order.orderNumber,
      uploadToken: order.uploadToken,
      shippingCarrier: values.shippingCarrier || order.shippingCarrier,
      trackingNumber: values.trackingNumber || order.trackingNumber,
      trackingUrl: values.trackingUrl ?? order.trackingUrl,
    });

    await sendEmail({
      to: order.customerEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  return NextResponse.redirect(
    buildRedirectUrl(request, orderId, { message: "Versanddaten gespeichert." }),
    { status: 303 },
  );
}
