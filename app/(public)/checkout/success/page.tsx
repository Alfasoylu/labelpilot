import type { Metadata } from "next";
import Link from "next/link";

import { PurchaseEvent } from "@/components/analytics/PurchaseEvent";
import { getPrismaClient } from "@/lib/db/prisma";
import { canCustomerUploadArtwork } from "@/lib/orders/status";
import { getStripeServerClient } from "@/lib/stripe/server";

export const metadata: Metadata = {
  title: "Checkout bestätigt | Labelpilot.de",
  robots: {
    index: false,
    follow: false,
  },
};

type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

async function getSuccessPageData(sessionId?: string) {
  if (!sessionId) {
    return null;
  }

  try {
    const stripe = getStripeServerClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // CHK-001: Payment confirmation comes from Stripe directly. The retrieved
    // session is fetched server-side with the secret key, so payment_status:"paid"
    // is authoritative and available the instant the customer is redirected —
    // BEFORE the webhook has reconciled the DB. We therefore drive the purchase
    // event and the thank-you UI from Stripe, not from the DB order status, so
    // the GA4/Ads conversion is never lost to the webhook race.
    if (session.payment_status !== "paid") {
      return null;
    }

    const orderId = session.metadata?.orderId;
    const amountEur = session.amount_total ? session.amount_total / 100 : null;

    const prisma = getPrismaClient();
    const order =
      orderId && prisma
        ? await prisma.order.findUnique({
            where: { id: orderId },
            select: {
              id: true,
              orderNumber: true,
              status: true,
              reorderMode: true,
              uploadToken: true,
              artworkInputStatus: true,
            },
          })
        : null;

    const isSameArtworkReorder =
      order?.reorderMode === "SAME_ARTWORK" ||
      session.metadata?.reorderMode === "SAME_ARTWORK";

    // The upload link is only offered once the webhook has flipped the order
    // into an uploadable state. Until then the payment is still confirmed; the
    // customer also receives the upload link in the confirmation email.
    const uploadReady = order
      ? canCustomerUploadArtwork(order.status) ||
        order.status === "APPROVED_FOR_PRODUCTION"
      : false;

    return {
      paid: true,
      orderNumber: order?.orderNumber ?? session.metadata?.orderNumber ?? null,
      amountEur,
      isSameArtworkReorder,
      artworkInputStatus: order?.artworkInputStatus ?? null,
      uploadReady,
      uploadHref:
        uploadReady && order?.uploadToken && order.id
          ? `/de/auftrag/${order.id}/druckdaten?token=${encodeURIComponent(order.uploadToken)}`
          : null,
    };
  } catch {
    return null;
  }
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const successData = await getSuccessPageData(params.session_id);
  // Payment is confirmed by Stripe (getSuccessPageData only returns when paid).
  const hasResolvedCheckoutState = Boolean(successData);
  const isSameArtworkReorder = Boolean(successData?.isSameArtworkReorder);
  const uploadFlowAvailable = Boolean(successData?.uploadHref) && !isSameArtworkReorder;
  const needsArtworkHelp = successData?.artworkInputStatus === "needs_help";
  // Paid, but the webhook has not yet flipped the order into an uploadable state.
  const uploadPending =
    hasResolvedCheckoutState &&
    !isSameArtworkReorder &&
    !needsArtworkHelp &&
    !successData?.uploadReady;
  const uploadHref = successData?.uploadHref ?? "";
  const pageHeading = hasResolvedCheckoutState
    ? "Vielen Dank – Ihre Bestellung ist eingegangen."
    : "Ihr Checkout wird geprüft.";

  const intro = !hasResolvedCheckoutState
    ? "Wir prüfen Ihre Checkout-Daten und bestätigen den nächsten Schritt, sobald die Stripe-Sitzung sauber zugeordnet werden konnte."
    : isSameArtworkReorder
    ? "Ihre Nachbestellung mit identischem Artwork wird ohne neuen Upload weiterverarbeitet."
    : needsArtworkHelp
    ? "Wir haben vermerkt, dass Sie Hilfe bei Druckdaten oder Gestaltung brauchen. Unser Team prüft den Auftrag und meldet sich für den nächsten Schritt."
    : "Der nächste Schritt ist das Hochladen Ihrer Druckdaten – danach folgen Druckprüfung, Freigabe und Produktion.";

  return (
    <div className="container section-stack">
      {successData?.orderNumber && successData.amountEur ? (
        <PurchaseEvent
          transactionId={successData.orderNumber}
          value={successData.amountEur}
        />
      ) : null}
      <article className="surface-card">
        <span className="eyebrow">Checkout</span>
        <span className="badge">
          {hasResolvedCheckoutState ? "Bestellung eingegangen" : "Wird bestätigt"}
        </span>
        <h1>{pageHeading}</h1>
        <p>{intro}</p>
        {successData?.orderNumber ? (
          <p className="price-note">
            Bestellnummer: <strong>{successData.orderNumber}</strong>
          </p>
        ) : (
          <p className="price-note">
            Die finale Zahlungsbestätigung erfolgt über den verifizierten Stripe-Webhook.
          </p>
        )}
        {uploadPending ? (
          <p className="field-hint">
            Ihr persönlicher Upload-Link wird gerade vorbereitet und ist in wenigen Augenblicken
            hier sowie in Ihrer Bestellbestätigung per E-Mail verfügbar.
          </p>
        ) : null}
        <div className="cta-row">
          {uploadFlowAvailable ? (
            <Link href={uploadHref} className="cta-link">
              Druckdaten hochladen
            </Link>
          ) : null}
          {successData?.uploadHref && isSameArtworkReorder ? (
            <Link href={successData.uploadHref} className="cta-link">
              Bestellstatus ansehen
            </Link>
          ) : null}
          <Link href="/de/opake-pp-etiketten" className="secondary-link">
            Zu den Produkten
          </Link>
          <Link href="/de/kontakt" className="secondary-link">
            {hasResolvedCheckoutState ? "Kontakt" : "Checkout prüfen lassen"}
          </Link>
        </div>
        {hasResolvedCheckoutState ? (
          <p className="field-hint">
            Bei Rückfragen oder falls der Upload nicht sofort möglich ist, nutzen Sie bitte den
            Kontaktweg mit Ihrer Bestellnummer.
          </p>
        ) : null}
      </article>

      {!isSameArtworkReorder ? (
        <section className="section-stack">
          <h2>So geht es weiter</h2>
          <div className="steps-grid">
            <article className="step-card">
              <span className="badge">Schritt 1</span>
              <h3>{hasResolvedCheckoutState ? "Zahlung bestätigt" : "Checkout wird bestätigt"}</h3>
              <p>
                {hasResolvedCheckoutState
                  ? "Ihre Bestellung ist bei uns eingegangen. Die Zahlung wird über den verifizierten Stripe-Webhook final bestätigt."
                  : "Wir gleichen Stripe-Sitzung und Auftrag noch sauber ab. Erst danach bestätigen wir den nächsten operativen Schritt."}
              </p>
            </article>
            {hasResolvedCheckoutState ? (
              <>
                <article className="step-card">
                  <span className="badge">Schritt 2</span>
                  <h3>{needsArtworkHelp ? "Wir melden uns" : "Druckdaten & Proof"}</h3>
                  <p>
                    {needsArtworkHelp
                      ? "Sie haben Unterstützung bei Datei oder Gestaltung angefragt. Unser Team prüft Ihren Auftrag und meldet sich mit den nächsten Schritten."
                      : "Laden Sie Ihre Druckdaten hoch. Wir prüfen sie technisch und senden Ihnen einen digitalen Proof zur Freigabe."}
                  </p>
                </article>
                <article className="step-card">
                  <span className="badge">Schritt 3</span>
                  <h3>Produktion & Versand</h3>
                  <p>
                    Nach Ihrer Freigabe produzieren wir Ihre PP-Rollenetiketten. Die Lieferzeit
                    liegt bei ca. 7–21 Werktagen je nach Auftragsvolumen (Produktion und Versand nach Deutschland).
                  </p>
                </article>
              </>
            ) : (
              <article className="step-card">
                <span className="badge">Nächster Schritt</span>
                <h3>Checkout-Zuordnung prüfen</h3>
                <p>
                  Solange Bestellung und Stripe-Sitzung noch nicht sauber zugeordnet sind,
                  senden Sie bitte keine Druckdaten. Nutzen Sie bei Rückfragen den Kontaktweg,
                  damit wir den Checkout zuerst prüfen können.
                </p>
              </article>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
