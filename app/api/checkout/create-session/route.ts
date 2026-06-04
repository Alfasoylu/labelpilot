import { NextResponse } from "next/server";

import { getDefaultPricingSettings, mapPricingSettingsRecord } from "@/lib/admin/pricing";
import { checkoutIntakeSchema } from "@/lib/checkout/intake";
import { findPackageByConfig, type PackageMaterial, type ProductSlug } from "@/lib/commerce/packages";
import { createOrderNumber } from "@/lib/commerce/orders";
import { getPrismaClient } from "@/lib/db/prisma";
import { isAddonsEnabled } from "@/lib/pricing/addons-feature";
import { buildCheckoutAddons } from "@/lib/pricing/checkout-addons";
import { getCheckoutBaseUrl, getStripeServerClient } from "@/lib/stripe/server";

export const runtime = "nodejs";

function getPackageDisplayName(productSlug: ProductSlug, material: PackageMaterial) {
  if (productSlug === "opake-pp-etiketten" && material === "OPAQUE") {
    return "Opake PP-Rollenetiketten 100x200 mm";
  }

  return "Transparente PP-Rollenetiketten 100x200 mm";
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = checkoutIntakeSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Ungültige Checkout-Anfrage." }, { status: 400 });
    }

    const prisma = getPrismaClient();
    if (!prisma) {
      console.error("Checkout nicht verfügbar: DATABASE_URL fehlt.");
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

    const pkg = findPackageByConfig(parsed.data);

    if (!pkg) {
      return NextResponse.json({ error: "Unbekanntes Paket." }, { status: 400 });
    }

    const addonFeatureEnabled = isAddonsEnabled();
    const pricingSettingsRow = await prisma.pricingSettings.findUnique({
      where: { id: "default" },
    });
    const pricingSettings =
      mapPricingSettingsRecord(pricingSettingsRow) ?? getDefaultPricingSettings();
    const addonPricing = buildCheckoutAddons({
      featureEnabled: addonFeatureEnabled,
      addons: parsed.data.addons,
      baseGrossAmountCents: pkg.grossAmountCents,
      settings: pricingSettings,
    });
    const totalAmountCents = pkg.grossAmountCents + addonPricing.addonsTotalCents;

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
        productSlug: pkg.productSlug,
        material: pkg.material,
        quantity: pkg.quantity,
        packageId: pkg.id,
        amountCents: totalAmountCents,
        designServiceCents: addonPricing.designServiceCents,
        physicalProofCents: addonPricing.physicalProofCents,
        expressCents: addonPricing.expressCents,
        extraDesignCount: addonPricing.extraDesignCount,
        extraDesignCents: addonPricing.extraDesignCents,
        addonsTotalCents: addonPricing.addonsTotalCents || null,
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
        artworkInputStatus: parsed.data.artworkStatus,
        selectedAddons: parsed.data.addons,
        statusEvents: {
          create: {
            status: "PENDING_PAYMENT",
            note: `Checkout-Intake erfasst (${parsed.data.artworkStatus}).`,
          },
        },
      },
    });

    const metadata = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      companyName: parsed.data.companyName,
      customerEmail: parsed.data.email,
      productSlug: pkg.productSlug,
      quantity: String(pkg.quantity),
      material: pkg.material,
      packageId: pkg.id,
      source: "standard_checkout",
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      customer_email: parsed.data.email,
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
              description: `${pkg.quantity.toLocaleString("de-DE")} Stück, ${pkg.label}`,
            },
          },
        },
        ...addonPricing.lineItems
          .filter((item) => item.grossAmountCents > 0)
          .map((item) => ({
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: item.grossAmountCents,
            product_data: {
              name: item.name,
              description: item.description,
            },
          },
        })),
      ],
    });

    if (!session.url) {
      console.error("Checkout-Session ohne URL erstellt:", session.id);
      return NextResponse.json(
        { error: "Checkout ist derzeit nicht verfügbar. Bitte nutzen Sie das Angebotsformular." },
        { status: 503 },
      );
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeCheckoutSessionId: session.id,
      },
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        stripeCheckoutSessionId: session.id,
        amountCents: totalAmountCents,
        currency: "EUR",
        status: "PENDING",
        provider: "stripe",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout-Session konnte nicht erstellt werden:", error);
    return NextResponse.json(
      { error: "Checkout ist derzeit nicht verfügbar. Bitte nutzen Sie das Angebotsformular." },
      { status: 500 },
    );
  }
}
