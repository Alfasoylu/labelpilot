import { NextResponse } from "next/server";

import { getSupabaseUserFromRequest } from "@/lib/account/auth";
import { ensureCustomerForSupabaseUser } from "@/lib/account/customers";
import { getPrismaClient } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  const auth = await getSupabaseUserFromRequest(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const prisma = getPrismaClient();

  if (!prisma) {
    return NextResponse.json(
      { error: "Kundenkonto ist derzeit nicht verfügbar." },
      { status: 503 },
    );
  }

  const { orderId } = await context.params;

  try {
    const customer = await ensureCustomerForSupabaseUser(prisma, auth.user);

    const order = await prisma.order.findFirst({
      where: { id: orderId, customerId: customer.id },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        artworkStatus: true,
        productSlug: true,
        material: true,
        finishing: true,
        quantity: true,
        packageId: true,
        widthMm: true,
        heightMm: true,
        rollKern: true,
        abrollrichtung: true,
        maxRollendurchmesser: true,
        amountCents: true,
        currency: true,
        createdAt: true,
        uploadToken: true,
        reorderSourceDesignId: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Bestellung wurde nicht gefunden." },
        { status: 404 },
      );
    }

    const canOpenArtworkStep = ![
      "PENDING_PAYMENT",
      "PAYMENT_FAILED",
      "CANCELLED",
    ].includes(order.status);

    const { uploadToken, ...orderData } = order;

    return NextResponse.json({
      ...orderData,
      createdAt: order.createdAt.toISOString(),
      amountLabel: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(order.amountCents / 100),
      uploadHref:
        uploadToken && canOpenArtworkStep
          ? `/de/auftrag/${order.id}/druckdaten?token=${encodeURIComponent(uploadToken)}`
          : null,
    });
  } catch (error) {
    console.error("Bestelldetail-API fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Bestellung konnte nicht geladen werden." },
      { status: 500 },
    );
  }
}
