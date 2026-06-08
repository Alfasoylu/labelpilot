import { getPrismaClient } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "short", timeStyle: "short" }).format(d);
}

const EVENT_LABELS: Record<string, string> = {
  page_view: "Seitenaufruf",
  quote_form_submit: "Angebot abgeschickt",
  sample_box_submit: "Musterbox angefragt",
  reorder_start_submit: "Nachbestellung gestartet",
  reorder_checkout_redirect: "Nachbestellung → Checkout",
  reorder_quote_redirect: "Nachbestellung → Angebot",
  configurator_price_calculated: "Preis berechnet",
  configurator_order_click: "Bestellung gestartet",
};

export default async function AdminVisitorsPage() {
  const prisma = getPrismaClient();

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Besucherstatistik ist derzeit nicht verfügbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const where = { createdAt: { gte: since } };

  const [
    totalEvents,
    pageViews,
    uniqueVisitorRows,
    topPages,
    topSources,
    eventTypes,
    consentTotal,
    consentAnalytics,
    recentEvents,
  ] = await Promise.all([
    prisma.visitorEvent.count({ where }),
    prisma.visitorEvent.count({ where: { ...where, eventType: "page_view" } }),
    prisma.visitorEvent.findMany({ where, select: { visitorId: true }, distinct: ["visitorId"] }),
    prisma.visitorEvent.groupBy({
      by: ["path"],
      where: { ...where, eventType: "page_view" },
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    }),
    prisma.visitorEvent.groupBy({
      by: ["utmSource"],
      where: { ...where, utmSource: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { utmSource: "desc" } },
      take: 10,
    }),
    prisma.visitorEvent.groupBy({
      by: ["eventType"],
      where,
      _count: { _all: true },
      orderBy: { _count: { eventType: "desc" } },
      take: 12,
    }),
    prisma.consentRecord.count({ where }),
    prisma.consentRecord.count({ where: { ...where, analytics: true } }),
    prisma.visitorEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 25,
      select: {
        id: true,
        eventType: true,
        path: true,
        utmSource: true,
        country: true,
        device: true,
        createdAt: true,
      },
    }),
  ]);

  const uniqueVisitors = uniqueVisitorRows.length;
  const consentRate = consentTotal > 0 ? Math.round((consentAnalytics / consentTotal) * 100) : 0;

  return (
    <section className="section-stack">
      <article className="surface-card">
        <h2>Besucherstatistik</h2>
        <p className="price-note">Letzte 30 Tage · nur einwilligungsbasierte, anonyme Erstanbieter-Daten</p>
        <div className="account-stat-grid" style={{ marginTop: "1rem" }}>
          <div className="account-stat-card account-stat-card--neutral">
            <div className="account-stat-card__head"><span className="account-stat-card__label">Seitenaufrufe</span></div>
            <span className="account-stat-card__value">{pageViews.toLocaleString("de-DE")}</span>
          </div>
          <div className="account-stat-card account-stat-card--accent">
            <div className="account-stat-card__head"><span className="account-stat-card__label">Eindeutige Besucher</span></div>
            <span className="account-stat-card__value">{uniqueVisitors.toLocaleString("de-DE")}</span>
          </div>
          <div className="account-stat-card account-stat-card--neutral">
            <div className="account-stat-card__head"><span className="account-stat-card__label">Ereignisse gesamt</span></div>
            <span className="account-stat-card__value">{totalEvents.toLocaleString("de-DE")}</span>
          </div>
          <div className="account-stat-card account-stat-card--success">
            <div className="account-stat-card__head"><span className="account-stat-card__label">Statistik-Einwilligung</span></div>
            <span className="account-stat-card__value">{consentRate}%</span>
            <span className="account-stat-card__hint">{consentAnalytics} von {consentTotal} Entscheidungen</span>
          </div>
        </div>
      </article>

      <div className="two-column">
        <article className="surface-card">
          <h2>Top-Seiten</h2>
          {topPages.length === 0 ? (
            <p className="price-note">Noch keine Daten.</p>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Seite</th><th>Aufrufe</th></tr></thead>
              <tbody>
                {topPages.map((row) => (
                  <tr key={row.path ?? "—"}>
                    <td style={{ wordBreak: "break-word" }}>{row.path ?? "—"}</td>
                    <td>{row._count._all.toLocaleString("de-DE")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>

        <article className="surface-card">
          <h2>Top-Quellen (UTM)</h2>
          {topSources.length === 0 ? (
            <p className="price-note">Keine UTM-Quellen erfasst.</p>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Quelle</th><th>Ereignisse</th></tr></thead>
              <tbody>
                {topSources.map((row) => (
                  <tr key={row.utmSource ?? "—"}>
                    <td>{row.utmSource ?? "—"}</td>
                    <td>{row._count._all.toLocaleString("de-DE")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>
      </div>

      <article className="surface-card">
        <h2>Ereignistypen</h2>
        <table className="admin-table">
          <thead><tr><th>Typ</th><th>Anzahl</th></tr></thead>
          <tbody>
            {eventTypes.map((row) => (
              <tr key={row.eventType}>
                <td>{EVENT_LABELS[row.eventType] ?? row.eventType}</td>
                <td>{row._count._all.toLocaleString("de-DE")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      <article className="surface-card">
        <h2>Letzte Ereignisse</h2>
        {recentEvents.length === 0 ? (
          <p className="price-note">Noch keine Ereignisse erfasst.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr><th>Zeit</th><th>Typ</th><th>Seite</th><th>Quelle</th><th>Land</th><th>Gerät</th></tr>
              </thead>
              <tbody>
                {recentEvents.map((e) => (
                  <tr key={e.id}>
                    <td style={{ whiteSpace: "nowrap" }}>{formatDateTime(e.createdAt)}</td>
                    <td>{EVENT_LABELS[e.eventType] ?? e.eventType}</td>
                    <td style={{ wordBreak: "break-word" }}>{e.path ?? "—"}</td>
                    <td>{e.utmSource ?? "—"}</td>
                    <td>{e.country ?? "—"}</td>
                    <td>{e.device ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
