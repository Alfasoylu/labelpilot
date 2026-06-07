import { NextResponse } from "next/server";

import { Prisma } from "@prisma/client";

import { getDefaultPricingSettings, mapPricingSettingsRecord } from "@/lib/admin/pricing";
import { getSupabaseUserFromRequest } from "@/lib/account/auth";
import { ensureCustomerForSupabaseUser } from "@/lib/account/customers";
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
  let createdOrderId: string | null = null;
  let prisma = getPrismaClient();

  try {
    const json = await request.json();
    const parsed = checkoutIntakeSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Ungültige Checkout-Anfrage." }, { status: 400 });
    }

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

    // CHK-003: Use 8 hex chars (16^8 ≈ 4 billion) to reduce collision risk; retry on P2002.
    const orderNumber = createOrderNumber();
    const normalizedCountry =
      parsed.data.country.toUpperCase() === "DE" ||
      parsed.data.country.toLowerCase() === "deutschland"
        ? "DE"
        : parsed.data.country;

    // CHK-002: Create Stripe session FIRST so that no DB order is left orphaned when
    // the Stripe API call fails. The order is only written once we have a valid session.
    const stripeMetadataPlaceholder = {
      orderId: "",
      orderNumber,
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
      metadata: stripeMetadataPlaceholder,
      payment_intent_data: {
        metadata: stripeMetadataPlaceholder,
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

    // Stripe session exists with a valid URL — now persist the order.
    // CHK-003: Retry up to 3 times on orderNumber collision (Prisma P2002).
    let order: Awaited<ReturnType<typeof prisma.order.create>>;
    let currentOrderNumber = orderNumber;
    for (let attempt = 1; ; attempt++) {
      try {
        order = await prisma.order.create({
          data: {
            orderNumber: currentOrderNumber,
            status: "PENDING_PAYMENT",
            productSlug: pkg.productSlug,
            material: pkg.material,
            quantity: pkg.quantity,
            packageId: pkg.id,
            amountCents: totalAmountCents,
            designServiceCents: addonPricing.designServiceCents,
            physicalProofCents: addonPricing.physicalProofCents,
            expressCents: addonPricing.expressCents,
            extraDesignCount: parsed.data.addons?.extraDesignCount ?? 0,
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
            finishing: parsed.data.finishing || null,
            rollKern: parsed.data.rollKern || null,
            abrollrichtung: parsed.data.abrollrichtung || null,
            maxRollendurchmesser: parsed.data.maxRollendurchmesser || null,
            maschineName: parsed.data.maschineName || null,
            artworkInputStatus: parsed.data.artworkStatus,
            selectedAddons: parsed.data.addons,
            stripeCheckoutSessionId: session.id,
            // BUG-004: Link to customer account when authenticated.
            customerId: customerId ?? undefined,
            statusEvents: {
              create: {
                status: "PENDING_PAYMENT",
                note: `Checkout-Intake erfasst (${parsed.data.artworkStatus}).`,
              },
            },
          },
        });
        break; // success
      } catch (err) {
        // CHK-003: Retry on orderNumber uniqueness collision.
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2002" &&
          attempt < 3
        ) {
          console.warn(`Bestellnummer-Kollision bei ${currentOrderNumber}, neuer Versuch ${attempt + 1}.`);
          currentOrderNumber = createOrderNumber();
          continue;
        }
        throw err; // unrelated error or exhausted retries
      }
    }
    createdOrderId = order.id;

    // BUG-002: payment.create is the only post-Stripe DB write (stripeCheckoutSessionId is
    // already set in order.create above). Create the Payment row first so that any failure
    // is caught by the outer catch block which marks the order PAYMENT_FAILED.
    // The Stripe metadata back-fill is best-effort and does not affect payment processing.
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

    // Back-fill orderId into Stripe session metadata so the webhook can resolve the order.
    // Non-critical: the orderId is already in the DB; this just makes the Stripe dashboard
    // more readable. Failure here does not affect the customer flow.
    const fullMetadata = {
      ...stripeMetadataPlaceholder,
      orderId: order.id,
    };
    try {
      await stripe.checkout.sessions.update(session.id, {
        metadata: fullMetadata,
      });
    } catch (metaErr) {
      console.warn("Stripe-Metadaten-Update nach Bestellanlage fehlgeschlagen:", metaErr);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout-Session konnte nicht erstellt werden:", error);
    if (prisma && createdOrderId) {
      try {
        await prisma.order.update({
          where: { id: createdOrderId },
          data: {
            status: "PAYMENT_FAILED",
            statusEvents: {
              create: {
                status: "PAYMENT_FAILED",
                note: "Checkout-Session konnte vor der Weiterleitung nicht sauber erstellt werden.",
              },
            },
          },
        });
      } catch (statusError) {
        console.error("Checkout-Fehlerstatus konnte nicht gespeichert werden:", statusError);
      }
    }
    return NextResponse.json(
      { error: "Checkout ist derzeit nicht verfügbar. Bitte nutzen Sie das Angebotsformular." },
      { status: 500 },
    );
  }
}
