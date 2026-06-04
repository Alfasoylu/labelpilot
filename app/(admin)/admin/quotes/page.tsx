import Link from "next/link";

import {
  buildQuoteWhere,
  formatQuoteDate,
  getQuoteSourceFilterValue,
  getQuoteStatusLabel,
} from "@/lib/admin/quotes";
import { getPrismaClient } from "@/lib/db/prisma";
import { getQuoteSourceLabel } from "@/lib/quotes/source";

export const dynamic = "force-dynamic";

type QuoteListPageProps = {
  searchParams: Promise<{
    status?: string;
    source?: string;
    q?: string;
  }>;
};

type QuoteListItem = {
  id: string;
  companyName: string;
  contactName: string | null;
  email: string;
  industry: string | null;
  productType: string | null;
  quantity: string | null;
  status: string;
  source: string | null;
  createdAt: Date;
};

export default async function AdminQuotesPage({ searchParams }: QuoteListPageProps) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Quote-Verwaltung ist derzeit nicht verfügbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const filters = await searchParams;
  const quotes = (await prisma.quoteRequest.findMany({
    where: buildQuoteWhere(filters),
    orderBy: [{ createdAt: "desc" }],
    take: 100,
  })) as unknown as QuoteListItem[];

  return (
    <section className="section-stack">
      <article className="surface-card">
        <h2>Angebotsanfragen</h2>
        <form className="quote-form" method="get">
          <div className="form-grid">
            <div>
              <label htmlFor="q">Suche</label>
              <input id="q" name="q" defaultValue={filters.q ?? ""} />
            </div>
            <div>
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={filters.status ?? "all"}>
                <option value="all">Alle</option>
                <option value="NEW">Neu</option>
                <option value="UNDER_REVIEW">In Prüfung</option>
                <option value="NEEDS_MORE_INFO">Weitere Informationen benötigt</option>
                <option value="QUOTE_SENT">Angebot gesendet</option>
                <option value="ACCEPTED">Akzeptiert</option>
                <option value="REJECTED">Abgelehnt</option>
                <option value="EXPIRED">Abgelaufen</option>
                <option value="CONVERTED_TO_ORDER">In Bestellung umgewandelt</option>
              </select>
            </div>
            <div>
              <label htmlFor="source">Quelle</label>
              <select
                id="source"
                name="source"
                defaultValue={getQuoteSourceFilterValue(filters.source)}
              >
                <option value="all">Alle</option>
                <option value="wunschformat">Wunschformat</option>
              </select>
            </div>
          </div>
          <div className="inline-actions">
            <button type="submit" className="cta-button">
              Filtern
            </button>
            <Link href="/admin/quotes?source=wunschformat" className="secondary-link">
              Nur Wunschformat
            </Link>
          </div>
        </form>
      </article>

      <article className="surface-card">
        <h2>Aktuelle Einträge</h2>
        {quotes.length === 0 ? (
          <p className="price-note">Keine Angebotsanfragen für den aktuellen Filter.</p>
        ) : (
          <div className="section-stack">
            {quotes.map((quote) => (
              <div key={quote.id} className="section-card">
                <h3>{quote.companyName}</h3>
                <p className="price-note">
                  {getQuoteStatusLabel(quote.status)} · {formatQuoteDate(quote.createdAt)}
                </p>
                <p className="field-hint">
                  {getQuoteSourceLabel(quote.source)} · {quote.email}
                  {quote.quantity ? ` · ${quote.quantity}` : ""}
                  {quote.productType ? ` · ${quote.productType}` : ""}
                  {quote.industry ? ` · ${quote.industry}` : ""}
                </p>
                <Link href={`/admin/quotes/${quote.id}`} className="secondary-link">
                  Anfrage ansehen
                </Link>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
