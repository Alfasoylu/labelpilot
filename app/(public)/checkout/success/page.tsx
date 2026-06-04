import Link from "next/link";

import { getPrismaClient } from "@/lib/db/prisma";
import { getStripeServerClient } from "@/lib/stripe/server";

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
        reorderMode: true,
        uploadToken: true,
        artworkInputStatus: true,
      },
    });

    return {
      orderNumber: order?.orderNumber ?? session.metadata?.orderNumber ?? null,
      isSameArtworkReorder: order?.reorderMode === "SAME_ARTWORK",
      artworkInputStatus: order?.artworkInputStatus ?? null,
      uploadHref:
        order?.uploadToken && order.id
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
  const hasResolvedCheckoutState = Boolean(successData);
  const uploadFlowAvailable =
    Boolean(successData?.uploadHref) && !successData?.isSameArtworkReorder;
  const needsArtworkHelp = successData?.artworkInputStatus === "needs_help";
  const uploadHref = successData?.uploadHref ?? "";

  return (
    <div className="container section-stack">
      <article className="legal-card">
        <span className="eyebrow">Checkout</span>
        <h1>Zahlung und Bestellung sind eingegangen bzw. werden bestaetigt.</h1>
        <p>
          {!hasResolvedCheckoutState
            ? "Wir pruefen Ihre Checkout-Daten und bestaetigen den naechsten Schritt, sobald die Stripe-Sitzung sauber zugeordnet werden konnte."
            : successData?.isSameArtworkReorder
            ? "Ihre Nachbestellung mit identischem Artwork wird ohne neuen Upload weiterverarbeitet."
            : needsArtworkHelp
            ? "Wir haben vermerkt, dass Sie Hilfe bei Druckdaten oder Gestaltung brauchen. Unser Team prueft den Auftrag und meldet sich fuer den naechsten Schritt."
            : "Der naechste Schritt ist das Hochladen Ihrer Druckdaten oder die Produktionspruefung nach Ihrem Upload."}
        </p>
        {successData?.orderNumber ? (
          <p className="price-note">Bestellnummer: {successData.orderNumber}</p>
        ) : (
          <p className="price-note">
            Die finale Zahlungsbestaetigung erfolgt ueber den verifizierten Stripe-Webhook.
          </p>
        )}
        {hasResolvedCheckoutState ? (
          <p className="field-hint">
            Bei Rueckfragen oder falls der Upload nicht sofort moeglich ist, nutzen Sie bitte den
            Kontaktweg unten mit Ihrer Bestellnummer.
          </p>
        ) : null}
        <div className="cta-row">
          {uploadFlowAvailable ? (
            <Link href={uploadHref} className="cta-link">
              Druckdaten hochladen
            </Link>
          ) : null}
          {successData?.uploadHref && successData?.isSameArtworkReorder ? (
            <Link href={successData.uploadHref} className="cta-link">
              Bestellstatus ansehen
            </Link>
          ) : null}
          <Link href="/de/opake-pp-etiketten" className="secondary-link">
            Zu den Produkten
          </Link>
          <Link href="/de/kontakt" className="secondary-link">
            {hasResolvedCheckoutState ? "Kontakt" : "Checkout pruefen lassen"}
          </Link>
        </div>
      </article>
    </div>
  );
}
