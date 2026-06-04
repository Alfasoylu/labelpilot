import {
  formatLeadDate,
  getLeadSourceTypeLabel,
  getLeadStatusLabel,
} from "@/lib/admin/leads";
import { getPrismaClient } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

type LeadDetailPageProps = {
  params: Promise<{
    leadId: string;
  }>;
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
};

export default async function AdminLeadDetailPage({
  params,
  searchParams,
}: LeadDetailPageProps) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Lead-Verwaltung ist derzeit nicht verfuegbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const { leadId } = await params;
  const feedback = await searchParams;
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!lead) {
    return (
      <article className="legal-card">
        <h2>Lead nicht gefunden.</h2>
      </article>
    );
  }

  return (
    <section className="section-stack">
      <article className="surface-card">
        <h2>{lead.companyName || lead.contactName || lead.email}</h2>
        <p className="price-note">
          {lead.type} · {getLeadStatusLabel(lead.status)} · Score {lead.score} (
          {lead.quality ?? "n/a"})
        </p>
        {lead.sourceType === "WUNSCHFORMAT" ? (
          <p className="form-status success">Wunschformat</p>
        ) : null}
        {feedback.message ? <p className="form-status success">{feedback.message}</p> : null}
        {feedback.error ? <p className="form-status error">{feedback.error}</p> : null}
        <p className="field-hint">Eingang: {formatLeadDate(lead.createdAt)}</p>
      </article>

      <article className="surface-card">
        <h2>Lead aktualisieren</h2>
        <form action={`/api/admin/leads/${lead.id}`} method="post" className="quote-form">
          <div className="form-grid">
            <div>
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={lead.status}>
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
              <label htmlFor="nextFollowUpAt">Naechstes Follow-up</label>
              <input
                id="nextFollowUpAt"
                name="nextFollowUpAt"
                type="datetime-local"
                defaultValue={
                  lead.nextFollowUpAt
                    ? new Date(
                        lead.nextFollowUpAt.getTime() -
                          lead.nextFollowUpAt.getTimezoneOffset() * 60000,
                      )
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
              />
            </div>
            <div className="field-full">
              <label htmlFor="followUpReason">Follow-up Notiz</label>
              <textarea
                id="followUpReason"
                name="followUpReason"
                rows={4}
                defaultValue={lead.followUpReason ?? ""}
              />
            </div>
          </div>
          <div className="inline-actions">
            <button type="submit" className="cta-button">
              Lead speichern
            </button>
          </div>
        </form>
      </article>

      <article className="surface-card">
        <h2>Details</h2>
        <ul className="simple-list">
          <li>E-Mail: {lead.email}</li>
          <li>Telefon: {lead.phone || "Nicht angegeben"}</li>
          <li>Land: {lead.country}</li>
          <li>Website / Shop: {lead.website || "Nicht angegeben"}</li>
          <li>Branche: {lead.industry || "Nicht angegeben"}</li>
          <li>Produkttyp: {lead.productType || "Nicht angegeben"}</li>
          <li>Menge: {lead.quantity || "Nicht angegeben"}</li>
          <li>Wiederkehrender Bedarf: {lead.recurringNeed || "Nicht angegeben"}</li>
          <li>Quelle: {getLeadSourceTypeLabel(lead.sourceType)}</li>
          <li>Landing Page: {lead.landingPage || "Nicht angegeben"}</li>
          <li>Source Page: {lead.sourcePage || "Nicht angegeben"}</li>
          <li>Referrer: {lead.referrer || "Nicht angegeben"}</li>
          <li>UTM Source: {lead.utmSource || "Nicht angegeben"}</li>
          <li>UTM Medium: {lead.utmMedium || "Nicht angegeben"}</li>
          <li>UTM Campaign: {lead.utmCampaign || "Nicht angegeben"}</li>
          <li>UTM Term: {lead.utmTerm || "Nicht angegeben"}</li>
          <li>UTM Content: {lead.utmContent || "Nicht angegeben"}</li>
        </ul>
        {lead.notes ? <p className="field-hint">Notizen: {lead.notes}</p> : null}
      </article>
    </section>
  );
}
