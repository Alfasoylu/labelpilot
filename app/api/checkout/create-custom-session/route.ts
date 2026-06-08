import { NextResponse } from "next/server";

import { mapMaterialCostRecord, mapPricingSettingsRecord } from "@/lib/admin/pricing";
import { getSupabaseUserFromRequest } from "@/lib/account/auth";
import { ensureCustomerForSupabaseUser } from "@/lib/account/customers";
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
    const form = parsed.data.form ?? "RECHTECKIG";
    const farbigkeit = parsed.data.farbigkeit ?? 4;
    const weissunterdruck = parsed.data.weissunterdruck === true;
    const anzahlSorten = parsed.data.anzahlSorten ?? 1;
    const colorCount = farbigkeit + (weissunterdruck ? 1 : 0);

    const [materialRow, settingsRow] = await Promise.all([
      prisma.pricingMaterialCost.findUnique({ where: { materialKey } }),
      prisma.pricingSettings.findUnique({ where: { id: "default" } }),
    ]);

    const priceResult = buildPublicCustomSizePriceResponse({
      featureEnabled: true,
      request: { materialKey, widthMm, heightMm, quantity, colorCount, anzahlSorten },
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

    // Oval surcharge is only computed after confirming the price is directly calculable (not quoteRequired).
    const ovalSurchargeNet = form === "OVAL" ? 0.03 * quantity : 0;
    // BUG-005: Use * 119 instead of * 1.19 * 100 to eliminate one floating-point multiplication
    // that could cause a 1-cent rounding discrepancy between the stored amountCents and
    // the Stripe session total, which would cause the webhook amount check to fail.
    const ovalSurchargeCents = Math.round(ovalSurchargeNet * 119);

    // grossPrice includes material + printing + plates; ovalSurchargeCents added for oval/round form
    const grossAmountCents = Math.round(priceResult.body.grossPrice * 100) + ovalSurchargeCents;
    const method = priceResult.body.method;
    const orderNumber = createOrderNumber();

    // BUG-004: Resolve customerId for authenticated users.
    let customerId: string | null = null;
    const authHeader = request.headers.get("authorization") ?? "";
    if (authHeader.startsWith("Bearer ")) {
      const auth = await getSupabaseUserFromRequest(request);
      if (auth.ok) {
        try {
          const customer = await ensureCustomerForSupabaseUser(prisma, auth.user);
          customerId = customer.id;
        } catch (err) {
          // Non-critical: proceed without linking to customer account.
          console.warn("Kundenkonto konnte nicht verknüpft werden:", err);
        }
      }
    }
    const normalizedCountry =
      parsed.data.country.toUpperCase() === "DE" ||
      parsed.data.country.toLowerCase() === "deutschland"
        ? "DE"
        : parsed.data.country;

    const sortenLabel = anzahlSorten > 1 ? `, ${anzahlSorten} Sorten` : "";
    const weissLabel = weissunterdruck ? "+Weiß" : "";
    const formLabel = form === "OVAL" ? ", Oval" : "";
    const printLabel = method === "DIGITAL"
      ? `Digitaldruck ${farbigkeit}-farbig${weissLabel}`
      : `Flexodruck ${farbigkeit}-farbig${weissLabel}, inkl. Druckplatten`;

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
        billingCompanyName: parsed.data.billingDiffers ? parsed.data.billingCompanyName || null : null,
        billingStreetAddress: parsed.data.billingDiffers ? parsed.data.billingStreetAddress || null : null,
        billingAddressLine2: parsed.data.billingDiffers ? parsed.data.billingAddressLine2 || null : null,
        billingPostalCode: parsed.data.billingDiffers ? parsed.data.billingPostalCode || null : null,
        billingCity: parsed.data.billingDiffers ? parsed.data.billingCity || null : null,
        billingCountry: parsed.data.billingDiffers ? parsed.data.billingCountry || null : null,
        customerNote: parsed.data.notes || null,
        finishing: parsed.data.finishing || null,
        rollKern: parsed.data.rollKern || null,
        abrollrichtung: parsed.data.abrollrichtung || null,
        maxRollendurchmesser: parsed.data.maxRollendurchmesser || null,
        maschineName: parsed.data.maschineName || null,
        artworkInputStatus: parsed.data.artworkStatus,
        selectedAddons: parsed.data.addons ?? undefined,
        // BUG-004: Link to customer account when authenticated.
        customerId: customerId ?? undefined,
        statusEvents: {
          create: {
            status: "PENDING_PAYMENT",
            note: `Wunschformat-Checkout: ${widthMm}×${heightMm} mm${formLabel}, ${quantity} Stück${sortenLabel}, ${printLabel} (${parsed.data.artworkStatus}).`,
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
              description: `${quantity.toLocaleString("de-DE")} Stück${sortenLabel}${formLabel}, ${printLabel}, inkl. Versand`,
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

    // BUG-003: Combine the two post-Stripe DB writes in a single transaction so that a crash
    // between them cannot leave the Payment table missing a row for a real Stripe session.
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { stripeCheckoutSessionId: session.id },
      }),
      prisma.payment.create({
        data: {
          orderId: order.id,
          stripeCheckoutSessionId: session.id,
          amountCents: grossAmountCents,
          currency: "EUR",
          status: "PENDING",
          provider: "stripe",
        },
      }),
    ]);

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
