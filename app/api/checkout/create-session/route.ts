import { NextResponse } from "next/server";
import { z } from "zod";

import { findPackageByConfig, type PackageMaterial, type ProductSlug } from "@/lib/commerce/packages";
import { createOrderNumber } from "@/lib/commerce/orders";
import { getPrismaClient } from "@/lib/db/prisma";
import { getCheckoutBaseUrl, getStripeServerClient } from "@/lib/stripe/server";

export const runtime = "nodejs";

const checkoutPayloadSchema = z.object({
  packageId: z.string().min(1),
  productSlug: z.enum(["opake-pp-etiketten", "transparente-pp-etiketten"]),
  material: z.enum(["OPAQUE", "TRANSPARENT"]),
  quantity: z.number().int().positive(),
  customerEmail: z.string().email().optional(),
  customerName: z.string().min(1).max(120).optional(),
  companyName: z.string().min(1).max(160).optional(),
});

function getPackageDisplayName(productSlug: ProductSlug, material: PackageMaterial) {
  if (productSlug === "opake-pp-etiketten" && material === "OPAQUE") {
    return "Opake PP-Rollenetiketten 100x200 mm";
  }

  return "Transparente PP-Rollenetiketten 100x200 mm";
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = checkoutPayloadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Ungueltige Checkout-Anfrage." }, { status: 400 });
    }

    const prisma = getPrismaClient();
    if (!prisma) {
      console.error("Checkout nicht verfuegbar: DATABASE_URL fehlt.");
      return NextResponse.json(
        { error: "Checkout ist derzeit nicht verfuegbar. Bitte nutzen Sie das Angebotsformular." },
        { status: 503 },
      );
    }

    let stripe;
    let baseUrl;

    try {
      stripe = getStripeServerClient();
      baseUrl = getCheckoutBaseUrl();
    } catch (error) {
      console.error("Checkout nicht verfuegbar:", error);
      return NextResponse.json(
        { error: "Checkout ist derzeit nicht verfuegbar. Bitte nutzen Sie das Angebotsformular." },
        { status: 503 },
      );
    }

    const pkg = findPackageByConfig(parsed.data);

    if (!pkg) {
      return NextResponse.json({ error: "Unbekanntes Paket." }, { status: 400 });
    }

    const orderNumber = createOrderNumber();
    const customerEmail =
      parsed.data.customerEmail ?? `${orderNumber.toLowerCase()}@pending.labelpilot.invalid`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: "PENDING_PAYMENT",
        productSlug: pkg.productSlug,
        material: pkg.material,
        quantity: pkg.quantity,
        packageId: pkg.id,
        amountCents: pkg.grossAmountCents,
        currency: "EUR",
        customerEmail,
        customerName: parsed.data.customerName,
        companyName: parsed.data.companyName,
        country: "DE",
        statusEvents: {
          create: {
            status: "PENDING_PAYMENT",
            note: "Checkout-Session angelegt.",
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
      source: "standard_checkout",
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      customer_email: parsed.data.customerEmail,
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
              description: `${pkg.quantity.toLocaleString("de-DE")} Stueck, ${pkg.label}`,
            },
          },
        },
      ],
    });

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
        amountCents: pkg.grossAmountCents,
        currency: "EUR",
        status: "PENDING",
        provider: "stripe",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout-Session konnte nicht erstellt werden:", error);
    return NextResponse.json(
      { error: "Checkout ist derzeit nicht verfuegbar. Bitte nutzen Sie das Angebotsformular." },
      { status: 500 },
    );
  }
}
