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

const PAGE_SIZE = 50;

type OrdersPageProps = {
  searchParams: Promise<{
    status?: string;
    artworkStatus?: string;
    addons?: string;
    q?: string;
    page?: string;
  }>;
};

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const prisma = getPrismaClient();
  const filters = await searchParams;
  const statusFilter = filters.status ?? "review-needed";
  const artworkStatusFilter = filters.artworkStatus ?? "all";
  const addonsFilter = filters.addons === "with" ? "with" : "all";
  const query = filters.q?.trim() ?? "";
  const page = Math.max(0, parseInt(filters.page ?? "0", 10) || 0);

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Bestellungen sind derzeit nicht verfügbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const where = buildAdminOrdersListWhere({
    status: statusFilter,
    artworkStatus: artworkStatusFilter,
    addons: addonsFilter,
    q: query,
  });

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { payments: true },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function buildPageUrl(p: number) {
    const params = new URLSearchParams();
    if (statusFilter !== "review-needed") params.set("status", statusFilter);
    if (artworkStatusFilter !== "all") params.set("artworkStatus", artworkStatusFilter);
    if (addonsFilter !== "all") params.set("addons", addonsFilter);
    if (query) params.set("q", query);
    if (p > 0) params.set("page", String(p));
    const qs = params.toString();
    return `/admin/orders${qs ? `?${qs}` : ""}`;
  }

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
              <option value="PAID">Bezahlt (wartet auf Druckdaten)</option>
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
          <h2>
            Bestellungen{" "}
            <span className="field-hint" style={{ fontSize: "0.88rem", fontWeight: 400 }}>
              {total.toLocaleString("de-DE")} gesamt · Seite {page + 1} von {Math.max(1, totalPages)}
            </span>
          </h2>
          <a href="/api/admin/orders/export" className="secondary-link" download>
            CSV exportieren
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
        {totalPages > 1 ? (
          <div className="cta-row" style={{ marginTop: "16px", justifyContent: "center" }}>
            {page > 0 ? (
              <a href={buildPageUrl(page - 1)} className="secondary-link">
                ← Vorherige
              </a>
            ) : null}
            <span className="price-note">
              Seite {page + 1} / {totalPages}
            </span>
            {page < totalPages - 1 ? (
              <a href={buildPageUrl(page + 1)} className="secondary-link">
                Nächste →
              </a>
            ) : null}
          </div>
        ) : null}
      </article>
    </section>
  );
}
