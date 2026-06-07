import Link from "next/link";

import { formatAdminDate, formatCurrencyFromCents } from "@/lib/admin/orders";
import { getPrismaClient } from "@/lib/db/prisma";
import { getMaterialLabel } from "@/lib/orders/artwork";

export const dynamic = "force-dynamic";

type ProductionPageProps = {
  searchParams: Promise<{ message?: string; error?: string }>;
};

const NEXT_ACTIONS: Record<string, Array<{ status: string; label: string }>> = {
  APPROVED_FOR_PRODUCTION: [
    { status: "IN_PRODUCTION", label: "In Produktion setzen" },
    { status: "ON_HOLD", label: "On Hold" },
  ],
  IN_PRODUCTION: [
    { status: "READY_TO_SHIP", label: "Versandbereit" },
    { status: "REPRINT_REQUIRED", label: "Nachdruck nötig" },
    { status: "ON_HOLD", label: "On Hold" },
  ],
};

export default async function AdminProductionPage({ searchParams }: ProductionPageProps) {
  const prisma = getPrismaClient();
  const feedback = await searchParams;

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Produktionskontrolle ist derzeit nicht verfügbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const orders = await prisma.order.findMany({
    where: {
      status: { in: ["APPROVED_FOR_PRODUCTION", "IN_PRODUCTION"] },
    },
    include: {
      artworkFiles: {
        where: { status: "APPROVED" },
        take: 1,
        select: { id: true, fileName: true },
      },
    },
    orderBy: [{ status: "asc" }, { updatedAt: "asc" }],
    take: 100,
  });

  const approved = orders.filter((o) => o.status === "APPROVED_FOR_PRODUCTION");
  const inProd = orders.filter((o) => o.status === "IN_PRODUCTION");

  return (
    <section className="section-stack">
      <article className="surface-card">
        <h2>Produktionskontrolle</h2>
        <p className="price-note">
          {approved.length} freigegeben für Produktion · {inProd.length} in Produktion
        </p>
        {feedback.message ? (
          <p className="form-status success">{feedback.message}</p>
        ) : null}
        {feedback.error ? (
          <p className="form-status error">{feedback.error}</p>
        ) : null}
      </article>

      {orders.length === 0 ? (
        <article className="surface-card">
          <p className="price-note">Keine Aufträge in der Warteschlange.</p>
        </article>
      ) : (
        orders.map((order) => {
          const actions = NEXT_ACTIONS[order.status] ?? [];
          const artworkFile = order.artworkFiles[0];
          const ageMs = Date.now() - order.updatedAt.getTime();
          const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));

          return (
            <article key={order.id} className="surface-card">
              <div className="two-column">
                <div>
                  <div className="admin-order-heading">
                    <h3>{order.orderNumber}</h3>
                    <span
                      className="price-note"
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color:
                          order.status === "IN_PRODUCTION"
                            ? "var(--success)"
                            : "var(--accent)",
                      }}
                    >
                      {order.status === "IN_PRODUCTION" ? "In Produktion" : "Freigegeben"}
                    </span>
                  </div>
                  <p className="price-note">
                    {order.widthMm && order.heightMm
                      ? `${order.widthMm}×${order.heightMm} mm`
                      : "Standardpaket"}{" "}
                    · {getMaterialLabel(order.material)} ·{" "}
                    {order.quantity.toLocaleString("de-DE")} Stück
                  </p>
                  <p className="price-note">
                    {order.finishing ?? "Matt"}
                    {order.rollKern ? ` · Kern ${order.rollKern}` : ""}
                    {order.maschineName ? ` · ${order.maschineName}` : ""}
                  </p>
                  <p className="price-note">
                    {formatCurrencyFromCents(order.amountCents)} · {order.customerEmail}
                  </p>
                  {artworkFile ? (
                    <a
                      href={`/api/admin/orders/${order.id}/artwork/${artworkFile.id}`}
                      className="secondary-link"
                      style={{ display: "inline-block", marginTop: "6px", fontSize: "0.88rem" }}
                    >
                      ↓ {artworkFile.fileName}
                    </a>
                  ) : (
                    <p className="form-status warning" style={{ fontSize: "0.84rem" }}>
                      Keine freigegebene Druckdatei
                    </p>
                  )}
                </div>
                <div>
                  <p className="price-note">
                    Zuletzt aktualisiert: {formatAdminDate(order.updatedAt)}
                  </p>
                  {ageDays > 0 ? (
                    <p
                      className="price-note"
                      style={{ color: ageDays > 7 ? "var(--danger)" : undefined }}
                    >
                      {ageDays} Tag{ageDays !== 1 ? "e" : ""} in der Warteschlange
                    </p>
                  ) : null}
                  <p className="price-note">Erstellt: {formatAdminDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="cta-row">
                {actions.map((action) => (
                  <form
                    key={action.status}
                    action={`/api/admin/orders/${order.id}/status`}
                    method="post"
                  >
                    <input type="hidden" name="status" value={action.status} />
                    <input type="hidden" name="redirectTo" value="/admin/production" />
                    <button
                      type="submit"
                      className={
                        action.status === "IN_PRODUCTION" || action.status === "READY_TO_SHIP"
                          ? "cta-button"
                          : "secondary-link"
                      }
                      style={{ fontSize: "0.88rem" }}
                    >
                      {action.label}
                    </button>
                  </form>
                ))}
                <Link href={`/admin/orders/${order.id}`} className="secondary-link">
                  Bestellung öffnen →
                </Link>
              </div>
            </article>
          );
        })
      )}
    </section>
  );
}
