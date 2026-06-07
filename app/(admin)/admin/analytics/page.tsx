import { formatCurrencyFromCents } from "@/lib/admin/orders";
import { getPrismaClient } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

type AnalyticsPageProps = {
  searchParams: Promise<{ period?: string }>;
};

const PAID_STATUSES = [
  "PAID",
  "FILE_REVIEW",
  "CORRECTION_REQUIRED",
  "ON_HOLD",
  "PROOF_REQUIRED",
  "WAITING_CUSTOMER_APPROVAL",
  "APPROVED_FOR_PRODUCTION",
  "IN_PRODUCTION",
  "READY_TO_SHIP",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
];

function periodBounds(period: string): { start: Date; end: Date; label: string } {
  const now = new Date();
  if (period === "lastmonth") {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    return { start, end, label: "Letzter Monat" };
  }
  if (period === "quarter") {
    const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const end = now;
    return { start, end, label: "Letzte 3 Monate" };
  }
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = now;
  return { start, end, label: "Aktueller Monat" };
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" }).format(
    new Date(year, month - 1, 1),
  );
}

function materialLabel(m: string) {
  return m === "TRANSPARENT" ? "Transparent PP" : m === "OPAQUE" ? "Opak PP" : m;
}

export default async function AdminAnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const prisma = getPrismaClient();
  const params = await searchParams;
  const period = params.period ?? "month";
  const { start, end, label } = periodBounds(period);

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Analytik ist derzeit nicht verfügbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const [periodOrders, newCustomers, trendOrders, quoteCount] = await Promise.all([
    prisma.order.findMany({
      where: {
        status: { in: PAID_STATUSES as never[] },
        createdAt: { gte: start, lte: end },
      },
      select: { amountCents: true, material: true, createdAt: true },
    }),
    prisma.customer.count({ where: { createdAt: { gte: start, lte: end } } }),
    prisma.order.findMany({
      where: {
        status: { in: PAID_STATUSES as never[] },
        createdAt: { gte: twelveMonthsAgo },
      },
      select: { amountCents: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.quoteRequest.count({ where: { createdAt: { gte: start, lte: end } } }),
  ]);

  const totalRevenueCents = periodOrders.reduce((s, o) => s + o.amountCents, 0);
  const orderCount = periodOrders.length;
  const avgOrderCents = orderCount > 0 ? Math.round(totalRevenueCents / orderCount) : 0;

  const byMaterial: Record<string, { count: number; revenueCents: number }> = {};
  for (const o of periodOrders) {
    if (!byMaterial[o.material]) byMaterial[o.material] = { count: 0, revenueCents: 0 };
    byMaterial[o.material].count++;
    byMaterial[o.material].revenueCents += o.amountCents;
  }

  const monthlyMap: Record<string, { count: number; revenueCents: number }> = {};
  for (const o of trendOrders) {
    const key = monthKey(o.createdAt);
    if (!monthlyMap[key]) monthlyMap[key] = { count: 0, revenueCents: 0 };
    monthlyMap[key].count++;
    monthlyMap[key].revenueCents += o.amountCents;
  }
  const monthlyKeys = Object.keys(monthlyMap).sort();

  return (
    <section className="section-stack">
      <article className="surface-card">
        <h2>Umsatzanalytik</h2>
        <nav className="cta-row">
          <a
            href="/admin/analytics?period=month"
            className={period === "month" ? "cta-button" : "secondary-link"}
            style={{ fontSize: "0.88rem" }}
          >
            Aktueller Monat
          </a>
          <a
            href="/admin/analytics?period=lastmonth"
            className={period === "lastmonth" ? "cta-button" : "secondary-link"}
            style={{ fontSize: "0.88rem" }}
          >
            Letzter Monat
          </a>
          <a
            href="/admin/analytics?period=quarter"
            className={period === "quarter" ? "cta-button" : "secondary-link"}
            style={{ fontSize: "0.88rem" }}
          >
            Letzte 3 Monate
          </a>
        </nav>
      </article>

      <div className="feature-grid">
        <div className="section-card">
          <h3>Umsatz</h3>
          <p style={{ fontSize: "1.6rem", fontWeight: 700, margin: "6px 0 2px" }}>
            {formatCurrencyFromCents(totalRevenueCents)}
          </p>
          <p className="field-hint">{label}</p>
        </div>
        <div className="section-card">
          <h3>Bestellungen</h3>
          <p style={{ fontSize: "1.6rem", fontWeight: 700, margin: "6px 0 2px" }}>
            {orderCount.toLocaleString("de-DE")}
          </p>
          <p className="field-hint">{label}</p>
        </div>
        <div className="section-card">
          <h3>Ø Bestellwert</h3>
          <p style={{ fontSize: "1.6rem", fontWeight: 700, margin: "6px 0 2px" }}>
            {formatCurrencyFromCents(avgOrderCents)}
          </p>
          <p className="field-hint">{label}</p>
        </div>
        <div className="section-card">
          <h3>Neue Kunden</h3>
          <p style={{ fontSize: "1.6rem", fontWeight: 700, margin: "6px 0 2px" }}>
            {newCustomers.toLocaleString("de-DE")}
          </p>
          <p className="field-hint">{label}</p>
        </div>
        <div className="section-card">
          <h3>Angebotsanfragen</h3>
          <p style={{ fontSize: "1.6rem", fontWeight: 700, margin: "6px 0 2px" }}>
            {quoteCount.toLocaleString("de-DE")}
          </p>
          <p className="field-hint">{label}</p>
        </div>
      </div>

      {Object.keys(byMaterial).length > 0 ? (
        <article className="surface-card">
          <h2>Umsatz nach Material ({label})</h2>
          <div className="section-stack">
            {Object.entries(byMaterial)
              .sort((a, b) => b[1].revenueCents - a[1].revenueCents)
              .map(([mat, stats]) => {
                const pct =
                  totalRevenueCents > 0
                    ? Math.round((stats.revenueCents / totalRevenueCents) * 100)
                    : 0;
                return (
                  <div key={mat} className="section-card">
                    <div className="two-column">
                      <div>
                        <strong>{materialLabel(mat)}</strong>
                        <p className="price-note">
                          {stats.count} Bestellung{stats.count !== 1 ? "en" : ""}
                        </p>
                      </div>
                      <div>
                        <p className="price-note">
                          {formatCurrencyFromCents(stats.revenueCents)}
                        </p>
                        <p className="price-note">{pct} % des Gesamtumsatzes</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </article>
      ) : null}

      {monthlyKeys.length > 0 ? (
        <article className="surface-card">
          <h2>Monatlicher Verlauf (letzte 12 Monate)</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>
                  Monat
                </th>
                <th style={{ textAlign: "right", padding: "8px 0", fontWeight: 600 }}>
                  Umsatz
                </th>
                <th style={{ textAlign: "right", padding: "8px 0", fontWeight: 600 }}>
                  Bestellungen
                </th>
              </tr>
            </thead>
            <tbody>
              {monthlyKeys.map((key) => {
                const data = monthlyMap[key];
                return (
                  <tr key={key} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 0" }}>{monthLabel(key)}</td>
                    <td style={{ textAlign: "right", padding: "8px 0" }}>
                      {formatCurrencyFromCents(data.revenueCents)}
                    </td>
                    <td style={{ textAlign: "right", padding: "8px 0" }}>{data.count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </article>
      ) : null}
    </section>
  );
}
