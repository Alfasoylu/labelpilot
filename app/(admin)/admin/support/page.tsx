import type { Prisma } from "@prisma/client";
import Link from "next/link";

import { getPrismaClient } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Offen",
  IN_REVIEW: "In Bearbeitung",
  RESOLVED: "Gelöst",
};

const TYPE_LABELS: Record<string, string> = {
  GENERAL: "Allgemein",
  REPRINT: "Nachdruck / Reklamation",
  BILLING: "Rechnung & Zahlung",
  DELIVERY: "Lieferung & Versand",
};

const STATUS_FILTERS = ["all", "OPEN", "IN_REVIEW", "RESOLVED"] as const;

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(value);
}

type SupportListPageProps = {
  searchParams: Promise<{ status?: string; q?: string }>;
};

export default async function AdminSupportPage({ searchParams }: SupportListPageProps) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Support-Verwaltung ist derzeit nicht verfügbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const filters = await searchParams;
  const status = filters.status && STATUS_FILTERS.includes(filters.status as never) ? filters.status : "all";
  const q = (filters.q ?? "").trim();

  const where: Prisma.SupportRequestWhereInput = {
    ...(status !== "all" ? { status } : {}),
    ...(q
      ? {
          OR: [
            { subject: { contains: q, mode: "insensitive" } },
            { customer: { email: { contains: q, mode: "insensitive" } } },
            { customer: { companyName: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const requests = await prisma.supportRequest.findMany({
    where,
    select: {
      id: true,
      type: true,
      subject: true,
      status: true,
      createdAt: true,
      attachments: true,
      customer: { select: { email: true, companyName: true, contactName: true } },
      order: { select: { orderNumber: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const openCount = await prisma.supportRequest.count({ where: { status: "OPEN" } });

  return (
    <section className="section-stack">
      <article className="surface-card">
        <h2>Support-Anfragen</h2>
        <p className="price-note">{openCount} offen · {requests.length} angezeigt</p>
        <form method="get" className="quote-form">
          <div className="form-grid">
            <div>
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={status}>
                <option value="all">Alle</option>
                <option value="OPEN">Offen</option>
                <option value="IN_REVIEW">In Bearbeitung</option>
                <option value="RESOLVED">Gelöst</option>
              </select>
            </div>
            <div>
              <label htmlFor="q">Suche</label>
              <input id="q" name="q" defaultValue={q} placeholder="Betreff, E-Mail, Firma" />
            </div>
          </div>
          <div className="inline-actions">
            <button type="submit" className="cta-button">Filtern</button>
          </div>
        </form>
      </article>

      <article className="surface-card">
        {requests.length === 0 ? (
          <p className="price-note">Keine Support-Anfragen gefunden.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-border, #e5e5e5)", textAlign: "left" }}>
                  <th style={{ padding: "0.5rem 1rem 0.5rem 0" }}>Datum</th>
                  <th style={{ padding: "0.5rem 1rem 0.5rem 0" }}>Kunde</th>
                  <th style={{ padding: "0.5rem 1rem 0.5rem 0" }}>Typ</th>
                  <th style={{ padding: "0.5rem 1rem 0.5rem 0" }}>Betreff</th>
                  <th style={{ padding: "0.5rem 1rem 0.5rem 0" }}>Status</th>
                  <th style={{ padding: "0.5rem 0" }}></th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => {
                  const attachmentCount = Array.isArray(r.attachments) ? r.attachments.length : 0;
                  return (
                    <tr key={r.id} style={{ borderBottom: "1px solid var(--color-border, #e5e5e5)" }}>
                      <td style={{ padding: "0.6rem 1rem 0.6rem 0", whiteSpace: "nowrap" }}>{formatDate(r.createdAt)}</td>
                      <td style={{ padding: "0.6rem 1rem 0.6rem 0" }}>
                        {r.customer?.companyName || r.customer?.contactName || r.customer?.email || "—"}
                      </td>
                      <td style={{ padding: "0.6rem 1rem 0.6rem 0" }}>{TYPE_LABELS[r.type] ?? r.type}</td>
                      <td style={{ padding: "0.6rem 1rem 0.6rem 0" }}>
                        {r.subject}
                        {attachmentCount > 0 ? <span className="price-note"> · {attachmentCount} Anhang</span> : null}
                        {r.order?.orderNumber ? <span className="price-note"> · {r.order.orderNumber}</span> : null}
                      </td>
                      <td style={{ padding: "0.6rem 1rem 0.6rem 0" }}>{STATUS_LABELS[r.status] ?? r.status}</td>
                      <td style={{ padding: "0.6rem 0" }}>
                        <Link href={`/admin/support/${r.id}`} className="secondary-link">Öffnen →</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
