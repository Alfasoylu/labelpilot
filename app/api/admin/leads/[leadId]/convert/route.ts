import { NextResponse } from "next/server";
import { z } from "zod";

import { createOrderNumber } from "@/lib/commerce/orders";
import { getPrismaClient } from "@/lib/db/prisma";

export const runtime = "nodejs";

const bodySchema = z.object({
  quantity: z.coerce.number().int().positive(),
  amountCents: z.coerce.number().int().positive(),
  notes: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .or(z.literal("")),
  skipPayment: z.enum(["yes", "no"]).default("no"),
  redirectTo: z.string().optional(),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ leadId: string }> },
): Promise<Response> {
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "Nicht verfügbar." }, { status: 503 });

  const { leadId } = await context.params;

  const formData = await request.formData().catch(() => new FormData());
  const rawData = Object.fromEntries(formData) as Record<string, unknown>;

  const parsed = bodySchema.safeParse(rawData);
  if (!parsed.success) {
    const redirectTo =
      typeof rawData.redirectTo === "string"
        ? rawData.redirectTo
        : `/admin/leads/${leadId}`;
    return NextResponse.redirect(
      new URL(`${redirectTo}?error=Ungültige+Eingabe`, request.url),
    );
  }

  const {
    quantity,
    amountCents,
    notes,
    skipPayment,
    redirectTo = `/admin/leads/${leadId}`,
  } = parsed.data;

  try {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });

    if (!lead) {
      return NextResponse.redirect(
        new URL("/admin/leads?error=Lead+nicht+gefunden", request.url),
      );
    }

    if (lead.convertedOrderId) {
      return NextResponse.redirect(
        new URL(
          `${redirectTo}?error=Lead+wurde+bereits+konvertiert`,
          request.url,
        ),
      );
    }

    const paid = skipPayment === "yes";
    const orderStatus = paid ? "PAID" : "PENDING_PAYMENT";
    const material =
      lead.material?.toUpperCase().includes("TRANSPARENT") ? "TRANSPARENT" : "OPAQUE";

    const order = await prisma.order.create({
      data: {
        orderNumber: createOrderNumber(),
        status: orderStatus,
        productSlug:
          material === "TRANSPARENT"
            ? "transparente-pp-etiketten"
            : "opake-pp-etiketten",
        material,
        quantity,
        amountCents,
        currency: "EUR",
        customerEmail: lead.email,
        customerName: lead.contactName ?? undefined,
        companyName: lead.companyName ?? undefined,
        customerPhone: lead.phone ?? undefined,
        country: lead.country ?? "DE",
        customerNote: notes || lead.notes || undefined,
        statusEvents: {
          create: {
            status: orderStatus,
            note: `Aus Lead ${leadId} konvertiert.`,
          },
        },
      },
      select: { id: true, orderNumber: true },
    });

    // BUG-006: Create a Payment row for audit-trail parity when an admin skips payment.
    // Without this row, the order shows as PAID in the status but has no matching Payment
    // record, breaking admin financial reconciliation.
    if (paid) {
      await prisma.$transaction([
        prisma.lead.update({
          where: { id: leadId },
          data: { status: "WON", convertedOrderId: order.id },
        }),
        prisma.payment.create({
          data: {
            orderId: order.id,
            amountCents,
            currency: "EUR",
            status: "PAID",
            provider: "manual",
          },
        }),
      ]);
    } else {
      await prisma.lead.update({
        where: { id: leadId },
        data: { status: "WON", convertedOrderId: order.id },
      });
    }

    return NextResponse.redirect(
      new URL(
        `/admin/orders/${order.id}?message=Auftrag+${encodeURIComponent(order.orderNumber)}+erstellt`,
        request.url,
      ),
    );
  } catch (error) {
    console.error("Lead-Konvertierung fehlgeschlagen:", error);
    return NextResponse.redirect(
      new URL(`${redirectTo}?error=Konvertierung+fehlgeschlagen`, request.url),
    );
  }
}
