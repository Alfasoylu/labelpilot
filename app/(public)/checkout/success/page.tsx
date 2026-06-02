import Link from "next/link";

import { getPrismaClient } from "@/lib/db/prisma";
import { getStripeServerClient } from "@/lib/stripe/server";

type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

async function getOrderNumber(sessionId?: string) {
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
      return session.metadata?.orderNumber ?? null;
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { orderNumber: true },
    });

    return order?.orderNumber ?? session.metadata?.orderNumber ?? null;
  } catch {
    return null;
  }
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderNumber = await getOrderNumber(params.session_id);

  return (
    <div className="container section-stack">
      <article className="legal-card">
        <span className="eyebrow">Checkout</span>
        <h1>Zahlung eingegangen bzw. wird bestaetigt.</h1>
        <p>Wir pruefen Ihre Druckdaten vor der Produktion.</p>
        {orderNumber ? (
          <p className="price-note">Bestellnummer: {orderNumber}</p>
        ) : (
          <p className="price-note">
            Die finale Zahlungsbestaetigung erfolgt ueber den verifizierten Stripe-Webhook.
          </p>
        )}
        <div className="cta-row">
          <Link href="/de/opake-pp-etiketten" className="secondary-link">
            Zu den Produkten
          </Link>
          <Link href="/de/kontakt" className="secondary-link">
            Kontakt
          </Link>
        </div>
      </article>
    </div>
  );
}
