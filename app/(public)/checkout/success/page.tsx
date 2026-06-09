import type { Metadata } from "next";
import Link from "next/link";

import { PurchaseEvent } from "@/components/analytics/PurchaseEvent";
import { getPrismaClient } from "@/lib/db/prisma";
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

    // CHK-001: Only show success UI for completed payments.
    if (session.payment_status !== "paid") {
      return null;
    }

    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return null;
    }

    const prisma = getPrismaClient();
    if (!prisma) {
      return {
        orderNumber: session.metadata?.orderNumber ?? null,
        isSameArtworkReorder: session.metadata?.reorderMode === "SAME_ARTWORK",
        uploadHref: null,
        artworkInputStatus: null,
      };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        reorderMode: true,
        uploadToken: true,
        artworkInputStatus: true,
      },
    });

    // CHK-001: Also guard against orders that are not yet marked PAID in the DB.
    if (!order || order.status !== "PAID" && order.status !== "APPROVED_FOR_PRODUCTION") {
      return null;
    }

    return {
      orderNumber: order?.orderNumber ?? session.metadata?.orderNumber ?? null,
      isSameArtworkReorder: order?.reorderMode === "SAME_ARTWORK",
      artworkInputStatus: order?.artworkInputStatus ?? null,
      uploadHref:
        order?.uploadToken && order.id
          ? `/de/auftrag/${order.id}/druckdaten?token=${encodeURIComponent(order.uploadToken)}`
          : null,
      amountEur: session.amount_total ? session.amount_total / 100 : null,
    };
  } catch {
    return null;
  }
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const successData = await getSuccessPageData(params.session_id);
  const hasResolvedCheckoutState = Boolean(successData);
  const isSameArtworkReorder = Boolean(successData?.isSameArtworkReorder);
  const uploadFlowAvailable = Boolean(successData?.uploadHref) && !isSameArtworkReorder;
  const needsArtworkHelp = successData?.artworkInputStatus === "needs_help";
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
                    liegt bei ca. 10–14 Werktagen nach Ihrer Freigabe für Produktion und Versand
                    nach Deutschland.
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
