import Link from "next/link";

import {
  buildLeadWhere,
  formatLeadDate,
  getLeadSourceTypeFilterValue,
  getLeadSourceTypeLabel,
  getLeadStatusLabel,
} from "@/lib/admin/leads";
import { getPrismaClient } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

type LeadListItem = {
  id: string;
  companyName: string | null;
  contactName: string | null;
  email: string;
  type: string;
  status: string;
  score: number;
  sourceType: string | null;
  createdAt: Date;
  quantity: string | null;
  industry: string | null;
};

type LeadListPageProps = {
  searchParams: Promise<{
    status?: string;
    type?: string;
    sourceType?: string;
    q?: string;
  }>;
};

export default async function AdminLeadsPage({ searchParams }: LeadListPageProps) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Lead-Verwaltung ist derzeit nicht verfuegbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const filters = await searchParams;
  const leads = (await prisma.lead.findMany({
    where: buildLeadWhere(filters),
    orderBy: [{ createdAt: "desc" }],
    take: 100,
  })) as LeadListItem[];

  return (
    <section className="section-stack">
      <article className="surface-card">
        <h2>Leads</h2>
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
                <option value="QUALIFYING">In Qualifizierung</option>
                <option value="QUALIFIED">Qualifiziert</option>
                <option value="SAMPLE_SENT">Muster versendet</option>
                <option value="QUOTE_NEEDED">Angebot noetig</option>
                <option value="QUOTE_SENT">Angebot gesendet</option>
                <option value="FOLLOW_UP">Follow-up</option>
                <option value="WON">Gewonnen</option>
                <option value="LOST">Verloren</option>
                <option value="DISQUALIFIED">Disqualifiziert</option>
              </select>
            </div>
            <div>
              <label htmlFor="type">Typ</label>
              <select id="type" name="type" defaultValue={filters.type ?? "all"}>
                <option value="all">Alle</option>
                <option value="QUOTE_REQUEST">Quote Request</option>
                <option value="SAMPLE_BOX_REQUEST">Sample Box</option>
                <option value="CONTACT_REQUEST">Kontakt</option>
                <option value="REORDER_INTEREST">Nachbestellung</option>
                <option value="BULK_ORDER_INTEREST">Grossmenge</option>
              </select>
            </div>
            <div>
              <label htmlFor="sourceType">Quelle</label>
              <select
                id="sourceType"
                name="sourceType"
                defaultValue={getLeadSourceTypeFilterValue(filters.sourceType)}
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
          </div>
        </form>
      </article>

      <article className="surface-card">
        <h2>Aktuelle Eintraege</h2>
        {leads.length === 0 ? (
          <p className="price-note">Keine Leads fuer den aktuellen Filter.</p>
        ) : (
          <div className="section-stack">
            {leads.map((lead) => (
              <div key={lead.id} className="section-card">
                <h3>{lead.companyName || lead.contactName || lead.email}</h3>
                <p className="price-note">
                  {lead.type} · {getLeadStatusLabel(lead.status)} · Score {lead.score} ·{" "}
                  {formatLeadDate(lead.createdAt)}
                </p>
                <p className="field-hint">
                  {getLeadSourceTypeLabel(lead.sourceType)} · {lead.email}
                  {lead.quantity ? ` · ${lead.quantity}` : ""}
                  {lead.industry ? ` · ${lead.industry}` : ""}
                </p>
                <Link href={`/admin/leads/${lead.id}`} className="secondary-link">
                  Lead ansehen
                </Link>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
