import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  buildAdminOrdersListWhere,
  formatAdminDate,
  hasOrderAddons,
} from "@/lib/admin/orders";
import { getPrismaClient } from "@/lib/db/prisma";
import {
  getArtworkStatusLabel,
  getMaterialLabel,
  getOrderStatusLabel,
} from "@/lib/orders/artwork";
import type { OrderStatusValue } from "@/lib/orders/status";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning";

function orderStatusVariant(status: string): BadgeVariant {
  switch (status as OrderStatusValue) {
    case "CORRECTION_REQUIRED":
    case "PAYMENT_FAILED":
    case "CANCELLED":
    case "REFUND_REQUESTED":
      return "destructive";
    case "APPROVED_FOR_PRODUCTION":
    case "DELIVERED":
    case "COMPLETED":
      return "success";
    case "SHIPPED":
    case "IN_PRODUCTION":
      return "secondary";
    case "WAITING_CUSTOMER_APPROVAL":
    case "REPRINT_REQUIRED":
    case "ON_HOLD":
      return "warning";
    default:
      return "outline";
  }
}

export const dynamic = "force-dynamic";

type OrdersPageProps = {
  searchParams: Promise<{
    status?: string;
    artworkStatus?: string;
    addons?: string;
    q?: string;
  }>;
};

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const prisma = getPrismaClient();
  const filters = await searchParams;
  const statusFilter = filters.status ?? "review-needed";
  const artworkStatusFilter = filters.artworkStatus ?? "all";
  const addonsFilter = filters.addons === "with" ? "with" : "all";
  const query = filters.q?.trim() ?? "";

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Bestellungen sind derzeit nicht verfügbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const orders = await prisma.order.findMany({
    where: buildAdminOrdersListWhere({
      status: statusFilter,
      artworkStatus: artworkStatusFilter,
      addons: addonsFilter,
      q: query,
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
            <label htmlFor="q">Suche</label>
            <input id="q" name="q" defaultValue={query} />
          </div>
          <div>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={statusFilter}>
              <option value="review-needed">Prüfung nötig</option>
              <option value="all">Alle</option>
              <option value="FILE_REVIEW">Dateiprüfung</option>
              <option value="CORRECTION_REQUIRED">Korrektur erforderlich</option>
              <option value="WAITING_CUSTOMER_APPROVAL">Proof wartet</option>
              <option value="APPROVED_FOR_PRODUCTION">Freigegeben für Produktion</option>
              <option value="READY_TO_SHIP">Versandbereit</option>
              <option value="SHIPPED">Versendet</option>
              <option value="DELIVERED">Zugestellt</option>
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
          <div>
            <label htmlFor="addons">Zusatzleistungen</label>
            <select id="addons" name="addons" defaultValue={addonsFilter}>
              <option value="all">Alle</option>
              <option value="with">Nur mit Zusatzleistungen</option>
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
                    <div className="admin-order-heading">
                      <h3>{order.orderNumber}</h3>
                      <Badge variant={orderStatusVariant(order.status)}>
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                      {order.widthMm ? (
                        <Badge variant="outline">Wunschformat</Badge>
                      ) : null}
                      {hasOrderAddons(order) ? (
                        <Badge variant="secondary">Zusatzleistungen</Badge>
                      ) : null}
                    </div>
                    <p className="price-note">
                      {getArtworkStatusLabel(order.artworkStatus)}
                    </p>
                    <p className="price-note">
                      {order.customerEmail} · {order.productSlug} · {getMaterialLabel(order.material)}
                    </p>
                  </div>
                  <div>
                    <p className="price-note">
                      Menge: {order.quantity.toLocaleString("de-DE")} Stück
                    </p>
                    <p className="price-note">
                      Zahlung: {order.payments[0]?.status ?? "PENDING"}
                    </p>
                    <p className="price-note">{formatAdminDate(order.createdAt)}</p>
                  </div>
                </div>
                <Link href={`/admin/orders/${order.id}`} className="secondary-link">
                  Bestellung öffnen
                </Link>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
