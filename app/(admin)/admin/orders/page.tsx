import { AdminOrdersListClient } from "@/components/admin/AdminOrdersListClient";
import {
  buildAdminOrdersListWhere,
  hasOrderAddons,
} from "@/lib/admin/orders";
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
        <div className="cta-row">
          <h2>Offene Bestellungen</h2>
          <a href="/api/admin/orders/export" className="secondary-link" download>
            Produktionsliste exportieren (CSV)
          </a>
        </div>
        <AdminOrdersListClient
          orders={orders.map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            statusLabel: getOrderStatusLabel(order.status),
            artworkStatusLabel: getArtworkStatusLabel(order.artworkStatus),
            customerEmail: order.customerEmail,
            productSlug: order.productSlug,
            materialLabel: getMaterialLabel(order.material),
            quantity: order.quantity,
            createdAt: order.createdAt.toISOString(),
            widthMm: order.widthMm,
            paymentStatus: order.payments[0]?.status ?? null,
            hasAddons: hasOrderAddons(order),
          }))}
        />
      </article>
    </section>
  );
}
