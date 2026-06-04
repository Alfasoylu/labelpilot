import { NextResponse } from "next/server";
import { z } from "zod";

import { createOrderNumber } from "@/lib/commerce/orders";
import { findPackageByConfig } from "@/lib/commerce/packages";
import {
  getAccessibleStoredDesignDetail,
  getCustomerAccessContext,
} from "@/lib/artwork/saved-designs";
import { getPrismaClient } from "@/lib/db/prisma";
import { getCheckoutBaseUrl, getStripeServerClient } from "@/lib/stripe/server";

export const runtime = "nodejs";

const reorderSchema = z.object({
  designId: z.string().min(1),
  orderId: z.string().min(1),
  token: z.string().min(1),
  artworkVersionId: z.string().min(1).optional().nullable(),
  quantity: z.enum(["1000", "2000", "5000", "10000", "20000+"]),
  mode: z.enum(["SAME_ARTWORK", "MINOR_CHANGE"]),
  stockDuration: z.enum([
    "UNDER_4_WEEKS",
    "ONE_TO_THREE_MONTHS",
    "THREE_TO_SIX_MONTHS",
    "OVER_SIX_MONTHS",
  ]),
});

function getPackageDisplayName(productSlug: string, material: string) {
  if (productSlug === "opake-pp-etiketten" && material === "OPAQUE") {
    return "Opake PP-Rollenetiketten 100x200 mm";
  }

  return "Transparente PP-Rollenetiketten 100x200 mm";
}

export async function POST(request: Request) {
  const parsed = reorderSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Nachbestellanfrage." }, { status: 400 });
  }

  const prisma = getPrismaClient();

  if (!prisma) {
    return NextResponse.json(
      { error: "Nachbestellung ist derzeit nicht verfügbar." },
      { status: 503 },
    );
  }

  const access = await getCustomerAccessContext(
    prisma,
    parsed.data.orderId,
    parsed.data.token,
  );

  if (!access) {
    return NextResponse.json(
      { error: "Sie haben keinen Zugriff auf diese Nachbestellung." },
      { status: 403 },
    );
  }

  const design = await getAccessibleStoredDesignDetail(
    prisma,
    parsed.data.designId,
    access,
  );

  if (!design) {
    return NextResponse.json({ error: "Gespeichertes Design nicht gefunden." }, { status: 404 });
  }

  const requestedVersion = parsed.data.artworkVersionId
    ? design.artworkVersions.find(
        (version: (typeof design.artworkVersions)[number]) =>
          version.id === parsed.data.artworkVersionId,
      ) ?? null
    : null;

  if (parsed.data.artworkVersionId && !requestedVersion) {
    return NextResponse.json(
      { error: "Die angeforderte Druckdatenversion gehört nicht zu dieser Nachbestellung." },
      { status: 409 },
    );
  }

  const selectedVersion =
    requestedVersion ??
    design.currentArtworkVersion ??
    design.artworkVersions[0] ??
    null;

  if (!selectedVersion) {
    return NextResponse.json(
      { error: "Keine freigegebene Druckdatenversion verfügbar." },
      { status: 409 },
    );
  }

  if (!selectedVersion.approvedAt || selectedVersion.status !== "APPROVED") {
    return NextResponse.json(
      { error: "Für die Nachbestellung ist keine freigegebene Druckdatenversion verfügbar." },
      { status: 409 },
    );
  }

  if (parsed.data.quantity === "20000+") {
    const quoteUrl =
      `/de/angebot-anfordern?sourceType=reorder` +
      `&productType=${encodeURIComponent(design.productSlug)}` +
      `&labelSize=${encodeURIComponent(design.labelSize ?? "100x200 mm")}` +
      `&material=${encodeURIComponent(design.material ?? "PP")}` +
      `&quantity=${encodeURIComponent("20.000+")}`;

    return NextResponse.json({
      kind: "quote",
      url: quoteUrl,
      reason: "quote_fallback",
    });
  }

  if (!design.material) {
    return NextResponse.json(
      { error: "Material der gespeicherten Spezifikation fehlt." },
      { status: 409 },
    );
  }

  const quantity = Number(parsed.data.quantity);
  const pkg = findPackageByConfig({
    productSlug: design.productSlug as "opake-pp-etiketten" | "transparente-pp-etiketten",
    material: design.material as "OPAQUE" | "TRANSPARENT",
    quantity,
  });

  if (!pkg) {
    return NextResponse.json(
      { error: "Für diese Nachbestellung wurde kein passendes Paket gefunden." },
      { status: 409 },
    );
  }

  let stripe;
  let baseUrl;

  try {
    stripe = getStripeServerClient();
    baseUrl = getCheckoutBaseUrl();
  } catch (error) {
    console.error("Reorder-Checkout nicht verfügbar:", error);
    return NextResponse.json(
      { error: "Checkout ist derzeit nicht verfügbar. Bitte nutzen Sie das Angebotsformular." },
      { status: 503 },
    );
  }

  const orderNumber = createOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      status: "PENDING_PAYMENT",
      artworkStatus:
        parsed.data.mode === "SAME_ARTWORK" ? "ARTWORK_APPROVED" : "AWAITING_ARTWORK",
      productSlug: pkg.productSlug,
      material: pkg.material,
      quantity: pkg.quantity,
      packageId: pkg.id,
      amountCents: pkg.grossAmountCents,
      currency: "EUR",
      customerEmail: access.customerEmail,
      customerName: access.customerName,
      companyName: access.companyName,
      country: "DE",
      reorderSourceDesignId: design.id,
      reorderSourceArtworkVersionId: selectedVersion.id,
      reorderMode: parsed.data.mode,
      reorderStockDuration: parsed.data.stockDuration,
      statusEvents: {
        create: {
          status: "PENDING_PAYMENT",
          note:
            parsed.data.mode === "SAME_ARTWORK"
              ? `Nachbestellung aus gespeichertem Design ${design.id}, Version ${selectedVersion.versionLabel}, Bestand ${parsed.data.stockDuration}.`
              : `Nachbestellung mit kleiner Anpassung aus Design ${design.id}, Version ${selectedVersion.versionLabel}, Bestand ${parsed.data.stockDuration}.`,
        },
      },
    },
  });

  const metadata = {
    orderId: order.id,
    orderNumber: order.orderNumber,
    productSlug: pkg.productSlug,
    quantity: String(pkg.quantity),
    material: pkg.material,
    packageId: pkg.id,
    source: "reorder_saved_design",
    reorderMode: parsed.data.mode,
    reorderSourceDesignId: design.id,
    reorderSourceArtworkVersionId: selectedVersion.id,
  };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout/cancel`,
    customer_email: access.customerEmail,
    metadata,
    payment_intent_data: {
      metadata,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: pkg.grossAmountCents,
          product_data: {
            name: getPackageDisplayName(pkg.productSlug, pkg.material),
            description:
              parsed.data.mode === "SAME_ARTWORK"
                ? `${pkg.quantity.toLocaleString("de-DE")} Stück, Nachbestellung identisches Artwork`
                : `${pkg.quantity.toLocaleString("de-DE")} Stück, Nachbestellung mit kleiner Anpassung`,
          },
        },
      },
    ],
  });

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: {
        stripeCheckoutSessionId: session.id,
      },
    }),
    prisma.payment.create({
      data: {
        orderId: order.id,
        stripeCheckoutSessionId: session.id,
        amountCents: pkg.grossAmountCents,
        currency: "EUR",
        status: "PENDING",
        provider: "stripe",
      },
    }),
  ]);

  return NextResponse.json({
    kind: "checkout",
    url: session.url,
    orderId: order.id,
  });
}
