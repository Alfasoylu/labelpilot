import { NextResponse } from "next/server";

import { mapMaterialCostRecord, mapPricingSettingsRecord } from "@/lib/admin/pricing";
import { customSizeCheckoutIntakeSchema } from "@/lib/checkout/intake";
import { createOrderNumber } from "@/lib/commerce/orders";
import { getPrismaClient } from "@/lib/db/prisma";
import { getCheckoutBaseUrl, getStripeServerClient } from "@/lib/stripe/server";
import { buildPublicCustomSizePriceResponse } from "@/lib/pricing/custom-size-public";

export const runtime = "nodejs";

function materialKeyToSlug(materialKey: "OPAQUE_PP" | "TRANSPARENT_PP") {
  return materialKey === "OPAQUE_PP" ? "opake-pp-etiketten" : "transparente-pp-etiketten";
}

function materialKeyToMaterial(materialKey: "OPAQUE_PP" | "TRANSPARENT_PP") {
  return materialKey === "OPAQUE_PP" ? "OPAQUE" : "TRANSPARENT";
}

function getProductDisplayName(materialKey: "OPAQUE_PP" | "TRANSPARENT_PP", widthMm: number, heightMm: number) {
  const mat = materialKey === "OPAQUE_PP" ? "Opake PP-Rollenetiketten" : "Transparente PP-Rollenetiketten";
  return `${mat} ${widthMm}×${heightMm} mm`;
}

export async function POST(request: Request) {
  let createdOrderId: string | null = null;
  const prisma = getPrismaClient();

  try {
    const json = await request.json();
    const parsed = customSizeCheckoutIntakeSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Ungültige Checkout-Anfrage." }, { status: 400 });
    }

    if (!prisma) {
      return NextResponse.json(
        { error: "Checkout ist derzeit nicht verfügbar. Bitte nutzen Sie das Angebotsformular." },
        { status: 503 },
      );
    }

    let stripe;
    let baseUrl;
    try {
      stripe = getStripeServerClient();
      baseUrl = getCheckoutBaseUrl();
    } catch (error) {
      console.error("Checkout nicht verfügbar:", error);
      return NextResponse.json(
        { error: "Checkout ist derzeit nicht verfügbar. Bitte nutzen Sie das Angebotsformular." },
        { status: 503 },
      );
    }

    const { materialKey, widthMm, heightMm, quantity } = parsed.data;

    const [materialRow, settingsRow] = await Promise.all([
      prisma.pricingMaterialCost.findUnique({ where: { materialKey } }),
      prisma.pricingSettings.findUnique({ where: { id: "default" } }),
    ]);

    const priceResult = buildPublicCustomSizePriceResponse({
      featureEnabled: true,
      request: { materialKey, widthMm, heightMm, quantity },
      params: mapMaterialCostRecord(materialRow),
      settings: mapPricingSettingsRecord(settingsRow),
    });

    if (priceResult.status !== 200 || !priceResult.body) {
      return NextResponse.json(
        { error: "Preisberechnung nicht verfügbar. Bitte nutzen Sie das Angebotsformular." },
        { status: 503 },
      );
    }

    if (!priceResult.body.configured || priceResult.body.quoteRequired) {
      return NextResponse.json(
        { error: "Für diese Konfiguration ist ein individuelles Angebot erforderlich." },
        { status: 422 },
      );
    }

    const grossAmountCents = Math.round(priceResult.body.grossPrice * 100);
    const orderNumber = createOrderNumber();
    const normalizedCountry =
      parsed.data.country.toUpperCase() === "DE" ||
      parsed.data.country.toLowerCase() === "deutschland"
        ? "DE"
        : parsed.data.country;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: "PENDING_PAYMENT",
        productSlug: materialKeyToSlug(materialKey),
        material: materialKeyToMaterial(materialKey),
        quantity,
        packageId: null,
        widthMm,
        heightMm,
        amountCents: grossAmountCents,
        currency: "EUR",
        customerEmail: parsed.data.email,
        customerName: parsed.data.contactName,
        companyName: parsed.data.companyName,
        customerPhone: parsed.data.phone,
        vatId: parsed.data.vatId || null,
        country: normalizedCountry,
        streetAddress: parsed.data.streetAddress,
        addressLine2: parsed.data.addressLine2 || null,
        postalCode: parsed.data.postalCode,
        city: parsed.data.city,
        customerNote: parsed.data.notes || null,
        finishing: parsed.data.finishing || null,
        rollKern: parsed.data.rollKern || null,
        abrollrichtung: parsed.data.abrollrichtung || null,
        maxRollendurchmesser: parsed.data.maxRollendurchmesser || null,
        maschineName: parsed.data.maschineName || null,
        artworkInputStatus: parsed.data.artworkStatus,
        selectedAddons: parsed.data.addons ?? undefined,
        statusEvents: {
          create: {
            status: "PENDING_PAYMENT",
            note: `Wunschformat-Checkout: ${widthMm}×${heightMm} mm, ${quantity} Stück (${parsed.data.artworkStatus}).`,
          },
        },
      },
    });
    createdOrderId = order.id;

    const metadata = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      companyName: parsed.data.companyName,
      customerEmail: parsed.data.email,
      productSlug: materialKeyToSlug(materialKey),
      quantity: String(quantity),
      material: materialKeyToMaterial(materialKey),
      packageId: "custom",
      source: "custom_size_checkout",
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      customer_email: parsed.data.email,
      metadata,
      payment_intent_data: { metadata },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: grossAmountCents,
            product_data: {
              name: getProductDisplayName(materialKey, widthMm, heightMm),
              description: `${quantity.toLocaleString("de-DE")} Stück, Wunschformat, inkl. Versand`,
            },
          },
        },
      ],
    });

    if (!session.url) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAYMENT_FAILED",
          statusEvents: { create: { status: "PAYMENT_FAILED", note: "Stripe-Session ohne URL." } },
        },
      });
      return NextResponse.json(
        { error: "Checkout ist derzeit nicht verfügbar. Bitte nutzen Sie das Angebotsformular." },
        { status: 503 },
      );
    }

    await prisma.order.update({ where: { id: order.id }, data: { stripeCheckoutSessionId: session.id } });
    await prisma.payment.create({
      data: {
        orderId: order.id,
        stripeCheckoutSessionId: session.id,
        amountCents: grossAmountCents,
        currency: "EUR",
        status: "PENDING",
        provider: "stripe",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Custom-Checkout-Session fehlgeschlagen:", error);
    if (prisma && createdOrderId) {
      try {
        await prisma.order.update({
          where: { id: createdOrderId },
          data: {
            status: "PAYMENT_FAILED",
            statusEvents: { create: { status: "PAYMENT_FAILED", note: "Session-Erstellung fehlgeschlagen." } },
          },
        });
      } catch {}
    }
    return NextResponse.json(
      { error: "Checkout ist derzeit nicht verfügbar. Bitte nutzen Sie das Angebotsformular." },
      { status: 500 },
    );
  }
}
