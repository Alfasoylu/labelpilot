import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getPrismaClient } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/send";
import { artworkApproved, orderConfirmation } from "@/lib/email/templates/lifecycle";
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

  // CHK-005: Move confirmationEmailSentAt reservation INSIDE the transaction so that
  // the idempotency check and the order status update are atomic. On a partial retry
  // caused by a transaction failure, the email can only be sent once.
  const now = new Date();
  const txResults = await prisma.$transaction([
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
        paidAt: now,
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
        paidAt: now,
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
    // Idempotent email reservation: only succeeds (count=1) when confirmationEmailSentAt is null.
    prisma.order.updateMany({
      where: {
        id: order.id,
        confirmationEmailSentAt: null,
      },
      data: {
        confirmationEmailSentAt: now,
      },
    }),
  ]);

  // The last element of txResults is always the emailReservation updateMany result.
  const emailReservation = txResults[txResults.length - 1] as { count: number };

  const customerEmail = session.customer_details?.email ?? order.customerEmail;

  if (emailReservation.count !== 1) {
    return;
  }

  if (!customerEmail) {
    console.debug(`Bestellbestätigung übersprungen: keine E-Mail für ${order.id}.`);
    return;
  }

  // REORDER-006: Pass isSameArtworkReorder so the confirmation email suppresses the
  // artwork-upload call-to-action for reorders where artwork is already approved.
  const template = orderConfirmation({
    orderId: order.id,
    orderNumber: order.orderNumber,
    uploadToken: order.uploadToken,
    material: order.material,
    quantity: order.quantity,
    finishing: order.finishing,
    widthMm: order.widthMm,
    heightMm: order.heightMm,
    amountCents: order.amountCents,
    currency: order.currency,
    physicalProofCents: order.physicalProofCents,
    addonsTotalCents: order.addonsTotalCents,
    companyName: order.companyName,
    customerName: order.customerName,
    streetAddress: order.streetAddress,
    addressLine2: order.addressLine2,
    postalCode: order.postalCode,
    city: order.city,
    country: order.country,
    isSameArtworkReorder,
  });

  // SW-002: Capture sendEmail result. On failure, roll back the email reservation so a retry
  // or manual trigger can re-send the confirmation. Log at error level for monitoring.
  const emailResult = await sendEmail({
    to: customerEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });

  if (!emailResult.ok) {
    console.error(
      `Bestellbestätigung konnte nicht gesendet werden für Bestellung ${order.id} (${customerEmail}). E-Mail-Reservierung wird zurückgesetzt.`,
    );
    await prisma.order.update({
      where: { id: order.id },
      data: { confirmationEmailSentAt: null },
    });
  }

  // EMAIL-004: For same-artwork reorders the order is immediately set to APPROVED_FOR_PRODUCTION.
  // Send an artworkApproved notification so the customer knows production has started.
  if (isSameArtworkReorder) {
    try {
      const approvedTemplate = artworkApproved({
        orderId: order.id,
        orderNumber: order.orderNumber,
        uploadToken: order.uploadToken,
      });
      await sendEmail({
        to: customerEmail,
        subject: approvedTemplate.subject,
        html: approvedTemplate.html,
        text: approvedTemplate.text,
      });
    } catch (error) {
      console.error(`Artwork-Freigabemail für Nachbestellung ${order.id} fehlgeschlagen:`, error);
    }
  }
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
    // SW-007: Log only the message, not the full Error object, to avoid leaking secret material.
    console.error(
      "Stripe-Signaturprüfung fehlgeschlagen:",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json({ error: "Ungültige Signatur." }, { status: 400 });
  }

  // SW-001: Atomic upsert instead of findUnique + conditional create to prevent TOCTOU race.
  // The upsert returns the existing row unchanged if the stripeEventId already exists.
  const stripeEventRecord = await prisma.stripeEvent.upsert({
    where: { stripeEventId: event.id },
    update: {},
    create: {
      stripeEventId: event.id,
      type: event.type,
      status: "RECEIVED",
    },
  });

  // SW-003: Skip already-PROCESSED events (idempotency). Also skip ERROR events after logging
  // a warning — they may have partially succeeded; Stripe retries are not safe to re-run.
  if (stripeEventRecord.status === "PROCESSED") {
    return NextResponse.json({ received: true });
  }

  if (stripeEventRecord.status === "ERROR") {
    console.warn(
      `Stripe-Webhook ${event.id} (${event.type}) bereits mit ERROR markiert – übersprungen. Manuelle Prüfung erforderlich.`,
    );
    return NextResponse.json({ received: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event);
        break;
      // SW-005: Handle expired checkout sessions so orders do not stay stuck in PENDING_PAYMENT.
      case "checkout.session.expired": {
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        const expiredOrderId = expiredSession.metadata?.orderId;
        if (expiredOrderId) {
          await prisma.order.updateMany({
            where: { id: expiredOrderId, status: "PENDING_PAYMENT" },
            data: { status: "CANCELLED" },
          });
          await prisma.orderStatusEvent.create({
            data: {
              orderId: expiredOrderId,
              status: "CANCELLED",
              note: "Stripe-Checkout-Session abgelaufen.",
            },
          });
        }
        break;
      }
      default:
        // SW-006: Log unrecognized event types so developers know which events arrive unhandled.
        console.info(
          `Stripe-Webhook-Ereignistyp nicht verarbeitet: ${event.type} (${event.id}) – als PROCESSED markiert.`,
        );
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
