import Link from "next/link";

import { buildAdminOrdersWhere, formatAdminDate } from "@/lib/admin/orders";
import { getPrismaClient } from "@/lib/db/prisma";
import {
  getArtworkStatusLabel,
  getMaterialLabel,
  getOrderStatusLabel,
} from "@/lib/orders/artwork";

export const dynamic = "force-dynamic";

type OrdersPageProps = {
  searchParams: Promise<{
    status?: string;
    artworkStatus?: string;
  }>;
};

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const prisma = getPrismaClient();
  const filters = await searchParams;
  const statusFilter = filters.status ?? "review-needed";
  const artworkStatusFilter = filters.artworkStatus ?? "all";

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Bestellungen sind derzeit nicht verfuegbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const orders = await prisma.order.findMany({
    where: buildAdminOrdersWhere({
      status: statusFilter,
      artworkStatus: artworkStatusFilter,
    }),
    include: {
      payments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  return (
    <section className="section-stack">
      <article className="surface-card">
        <h2>Bestellungen</h2>
        <form method="get" className="form-grid">
          <div>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={statusFilter}>
              <option value="review-needed">Pruefung noetig</option>
              <option value="all">Alle</option>
              <option value="FILE_REVIEW">Dateipruefung</option>
              <option value="CORRECTION_REQUIRED">Korrektur erforderlich</option>
              <option value="WAITING_CUSTOMER_APPROVAL">Proof wartet</option>
              <option value="APPROVED_FOR_PRODUCTION">Freigegeben fuer Produktion</option>
            </select>
          </div>
          <div>
            <label htmlFor="artworkStatus">Druckdatenstatus</label>
            <select id="artworkStatus" name="artworkStatus" defaultValue={artworkStatusFilter}>
              <option value="all">Alle</option>
              <option value="AWAITING_ARTWORK">Druckdaten fehlen</option>
              <option value="ARTWORK_UPLOADED">Druckdaten erhalten</option>
              <option value="ARTWORK_APPROVED">Druckdaten freigegeben</option>
            </select>
          </div>
          <div className="inline-actions">
            <button type="submit" className="cta-button">
              Filter anwenden
            </button>
          </div>
        </form>
      </article>

      <article className="surface-card">
        <h2>Offene Bestellungen</h2>
        {orders.length === 0 ? (
          <p className="price-note">Keine Bestellungen gefunden.</p>
        ) : (
          <div className="section-stack">
            {orders.map((order: (typeof orders)[number]) => (
              <div key={order.id} className="section-card">
                <div className="two-column">
                  <div>
                    <h3>{order.orderNumber}</h3>
                    <p className="price-note">
                      {getOrderStatusLabel(order.status)} · {getArtworkStatusLabel(order.artworkStatus)}
                    </p>
                    <p className="price-note">
                      {order.customerEmail} · {order.productSlug} · {getMaterialLabel(order.material)}
                    </p>
                  </div>
                  <div>
                    <p className="price-note">
                      Menge: {order.quantity.toLocaleString("de-DE")} Stueck
                    </p>
                    <p className="price-note">
                      Zahlung: {order.payments[0]?.status ?? "PENDING"}
                    </p>
                    <p className="price-note">{formatAdminDate(order.createdAt)}</p>
                  </div>
                </div>
                <Link href={`/admin/orders/${order.id}`} className="secondary-link">
                  Bestellung oeffnen
                </Link>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
