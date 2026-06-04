import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getPrismaClient } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/send";
import { orderConfirmation } from "@/lib/email/templates/lifecycle";
import {
  canApplyStripePaymentFailure,
  canApplyStripePaymentSuccess,
} from "@/lib/orders/status";
import { getStripeServerClient, getStripeWebhookSecret } from "@/lib/stripe/server";

export const runtime = "nodejs";

async function markStripeEventError(eventId: string, message: string) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return;
  }

  await prisma.stripeEvent.updateMany({
    where: { stripeEventId: eventId },
    data: {
      status: "ERROR",
      errorMessage: message,
    },
  });
}

async function handleCheckoutCompleted(event: Stripe.Event) {
  const prisma = getPrismaClient();
  if (!prisma) {
    return;
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") {
    return;
  }

  const orderId = session.metadata?.orderId;
  if (!orderId) {
    throw new Error("checkout.session.completed ohne orderId.");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payments: true },
  });

  if (!order) {
    throw new Error(`Bestellung ${orderId} nicht gefunden.`);
  }

  if (order.status === "PAID") {
    return;
  }

  if (!canApplyStripePaymentSuccess(order.status)) {
    throw new Error(
      `checkout.session.completed darf Status ${order.status} nicht auf PAID setzen.`,
    );
  }

  if (typeof session.amount_total === "number" && session.amount_total !== order.amountCents) {
    throw new Error(
      `checkout.session.completed Gesamtbetrag stimmt nicht: Stripe ${session.amount_total} vs Bestellung ${order.amountCents}.`,
    );
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;
  const isSameArtworkReorder =
    order.reorderMode === "SAME_ARTWORK" && Boolean(order.reorderSourceArtworkVersionId);
  const nextStatus = isSameArtworkReorder ? "APPROVED_FOR_PRODUCTION" : "PAID";
  const nextArtworkStatus = isSameArtworkReorder ? "ARTWORK_APPROVED" : "AWAITING_ARTWORK";

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: {
        status: nextStatus,
        artworkStatus: nextArtworkStatus,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: paymentIntentId,
        customerEmail: session.customer_details?.email ?? order.customerEmail,
      },
    }),
    prisma.payment.upsert({
      where: {
        orderId: order.id,
      },
      update: {
        status: "PAID",
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: paymentIntentId,
        stripeCustomerId:
          typeof session.customer === "string" ? session.customer : session.customer?.id,
        stripeEventId: event.id,
        paidAt: new Date(),
      },
      create: {
        orderId: order.id,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: paymentIntentId,
        stripeCustomerId:
          typeof session.customer === "string" ? session.customer : session.customer?.id,
        amountCents: order.amountCents,
        currency: order.currency,
        status: "PAID",
        provider: "stripe",
        stripeEventId: event.id,
        paidAt: new Date(),
      },
    }),
    prisma.orderStatusEvent.create({
      data: {
        orderId: order.id,
        status: "PAID",
        note: "Stripe Checkout bestätigt.",
      },
    }),
    ...(isSameArtworkReorder
      ? [
          prisma.orderStatusEvent.create({
            data: {
              orderId: order.id,
              status: "APPROVED_FOR_PRODUCTION",
              note: "Nachbestellung mit identischem Artwork wurde direkt für die Produktion vorbereitet.",
            },
          }),
        ]
      : []),
  ]);

  const emailReservation = await prisma.order.updateMany({
    where: {
      id: order.id,
      confirmationEmailSentAt: null,
    },
    data: {
      confirmationEmailSentAt: new Date(),
    },
  });

  const customerEmail = session.customer_details?.email ?? order.customerEmail;

  if (emailReservation.count !== 1) {
    return;
  }

  if (!customerEmail) {
    console.debug(`Bestellbestätigung übersprungen: keine E-Mail für ${order.id}.`);
    return;
  }

  const template = orderConfirmation({
    orderId: order.id,
    orderNumber: order.orderNumber,
    uploadToken: order.uploadToken,
  });

  await sendEmail({
    to: customerEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

async function handlePaymentFailed(event: Stripe.Event) {
  const prisma = getPrismaClient();
  if (!prisma) {
    return;
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) {
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payments: true },
  });

  if (!order) {
    return;
  }

  if (!canApplyStripePaymentFailure(order.status)) {
    return;
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: {
        status: "PAYMENT_FAILED",
        stripePaymentIntentId: paymentIntent.id,
      },
    }),
    prisma.payment.upsert({
      where: {
        orderId: order.id,
      },
      update: {
        status: "FAILED",
        stripePaymentIntentId: paymentIntent.id,
        stripeEventId: event.id,
      },
      create: {
        orderId: order.id,
        stripePaymentIntentId: paymentIntent.id,
        amountCents: order.amountCents,
        currency: order.currency,
        status: "FAILED",
        provider: "stripe",
        stripeEventId: event.id,
      },
    }),
    prisma.orderStatusEvent.create({
      data: {
        orderId: order.id,
        status: "PAYMENT_FAILED",
        note: "Stripe Payment Intent fehlgeschlagen.",
      },
    }),
  ]);
}

export async function POST(request: Request) {
  const prisma = getPrismaClient();
  if (!prisma) {
    console.error("Webhook nicht verfügbar: DATABASE_URL fehlt.");
    return NextResponse.json(
      { error: "Webhook-Verarbeitung nicht verfügbar." },
      { status: 503 },
    );
  }

  let stripe;
  let webhookSecret;

  try {
    stripe = getStripeServerClient();
    webhookSecret = getStripeWebhookSecret();
  } catch (error) {
    console.error("Webhook nicht verfügbar:", error);
    return NextResponse.json(
      { error: "Webhook-Verarbeitung nicht verfügbar." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Fehlende Stripe-Signatur." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe-Signatur konnte nicht verifiziert werden:", error);
    return NextResponse.json({ error: "Ungültige Signatur." }, { status: 400 });
  }

  const existingEvent = await prisma.stripeEvent.findUnique({
    where: { stripeEventId: event.id },
  });

  if (existingEvent?.status === "PROCESSED") {
    return NextResponse.json({ received: true });
  }

  if (!existingEvent) {
    await prisma.stripeEvent.create({
      data: {
        stripeEventId: event.id,
        type: event.type,
        status: "RECEIVED",
      },
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event);
        break;
      default:
        break;
    }

    await prisma.stripeEvent.update({
      where: { stripeEventId: event.id },
      data: {
        status: "PROCESSED",
        processedAt: new Date(),
        errorMessage: null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unbekannter Webhook-Fehler.";
    console.error("Stripe-Webhook-Verarbeitung fehlgeschlagen:", error);
    await markStripeEventError(event.id, message);
    return NextResponse.json({ error: "Webhook-Verarbeitung fehlgeschlagen." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
