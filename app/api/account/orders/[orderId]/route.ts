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
        streetAddress: true,
        addressLine2: true,
        postalCode: true,
        city: true,
        billingCompanyName: true,
        billingStreetAddress: true,
        billingAddressLine2: true,
        billingPostalCode: true,
        billingCity: true,
        billingCountry: true,
        amountCents: true,
        currency: true,
        createdAt: true,
        uploadToken: true,
        reorderSourceDesignId: true,
        trackingNumber: true,
        trackingUrl: true,
        estimatedDeliveryAt: true,
        shippedAt: true,
        deliveredAt: true,
        shipmentNote: true,
        proofFiles: {
          where: { status: { not: "SUPERSEDED" } },
          select: {
            id: true,
            fileName: true,
            status: true,
            adminNote: true,
            customerApprovedAt: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
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

    const { uploadToken, proofFiles, ...orderData } = order;

    return NextResponse.json({
      ...orderData,
      createdAt: order.createdAt.toISOString(),
      estimatedDeliveryAt: order.estimatedDeliveryAt?.toISOString() ?? null,
      shippedAt: order.shippedAt?.toISOString() ?? null,
      deliveredAt: order.deliveredAt?.toISOString() ?? null,
      amountLabel: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(order.amountCents / 100),
      uploadHref:
        uploadToken && canOpenArtworkStep
          ? `/de/auftrag/${order.id}/druckdaten?token=${encodeURIComponent(uploadToken)}`
          : null,
      proofFiles: proofFiles.map((p) => ({
        id: p.id,
        fileName: p.fileName,
        status: p.status,
        adminNote: p.adminNote ?? null,
        customerApprovedAt: p.customerApprovedAt?.toISOString() ?? null,
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Bestelldetail-API fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Bestellung konnte nicht geladen werden." },
      { status: 500 },
    );
  }
}
