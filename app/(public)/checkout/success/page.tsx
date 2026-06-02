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
        uploadHref: null,
      };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
        uploadToken: true,
      },
    });

    return {
      orderNumber: order?.orderNumber ?? session.metadata?.orderNumber ?? null,
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

  return (
    <div className="container section-stack">
      <article className="legal-card">
        <span className="eyebrow">Checkout</span>
        <h1>Zahlung eingegangen bzw. wird bestaetigt.</h1>
        <p>Der naechste Schritt ist das Hochladen Ihrer Druckdaten.</p>
        {successData?.orderNumber ? (
          <p className="price-note">Bestellnummer: {successData.orderNumber}</p>
        ) : (
          <p className="price-note">
            Die finale Zahlungsbestaetigung erfolgt ueber den verifizierten Stripe-Webhook.
          </p>
        )}
        <div className="cta-row">
          {successData?.uploadHref ? (
            <Link href={successData.uploadHref} className="cta-link">
              Druckdaten hochladen
            </Link>
          ) : null}
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
