import { formatQuoteDate, getQuoteStatusLabel } from "@/lib/admin/quotes";
import { getPrismaClient } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

type QuoteDetailPageProps = {
  params: Promise<{
    quoteId: string;
  }>;
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
};

export default async function AdminQuoteDetailPage({
  params,
  searchParams,
}: QuoteDetailPageProps) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Quote-Verwaltung ist derzeit nicht verfuegbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const { quoteId } = await params;
  const feedback = await searchParams;
  const quote = await prisma.quoteRequest.findUnique({
    where: { id: quoteId },
  });

  if (!quote) {
    return (
      <article className="legal-card">
        <h2>Angebotsanfrage nicht gefunden.</h2>
      </article>
    );
  }

  return (
    <section className="section-stack">
      <article className="surface-card">
        <h2>{quote.companyName}</h2>
        <p className="price-note">
          {getQuoteStatusLabel(quote.status)} · {formatQuoteDate(quote.createdAt)}
        </p>
        {feedback.message ? <p className="form-status success">{feedback.message}</p> : null}
        {feedback.error ? <p className="form-status error">{feedback.error}</p> : null}
      </article>

      <article className="surface-card">
        <h2>Status und Bearbeitung</h2>
        <form action={`/api/admin/quotes/${quote.id}`} method="post" className="quote-form">
          <div className="form-grid">
            <div>
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={quote.status}>
                <option value="NEW">Neu</option>
                <option value="UNDER_REVIEW">In Pruefung</option>
                <option value="NEEDS_MORE_INFO">Weitere Informationen benoetigt</option>
                <option value="QUOTE_SENT">Angebot gesendet</option>
                <option value="ACCEPTED">Akzeptiert</option>
                <option value="REJECTED">Abgelehnt</option>
                <option value="EXPIRED">Abgelaufen</option>
                <option value="CONVERTED_TO_ORDER">In Bestellung umgewandelt</option>
              </select>
            </div>
            <div className="field-full">
              <label htmlFor="adminNote">Interne Notiz / Kundenhinweis</label>
              <textarea
                id="adminNote"
                name="adminNote"
                rows={5}
                defaultValue={quote.adminNote ?? ""}
                placeholder="Interne Bearbeitungsnotiz oder Hinweis fuer Kundenmail."
              />
            </div>
          </div>
          <div className="inline-actions">
            <button type="submit" className="cta-button">Anfrage speichern</button>
          </div>
        </form>
      </article>

      <article className="surface-card">
        <h2>Details</h2>
        <ul className="simple-list">
          <li>Firma: {quote.companyName}</li>
          <li>Ansprechpartner: {quote.contactName || "Nicht angegeben"}</li>
          <li>E-Mail: {quote.email}</li>
          <li>Telefon: {quote.phone || "Nicht angegeben"}</li>
          <li>Land: {quote.country}</li>
          <li>Website / Shop: {quote.website || "Nicht angegeben"}</li>
          <li>Branche: {quote.industry || "Nicht angegeben"}</li>
          <li>Produkttyp: {quote.productType || "Nicht angegeben"}</li>
          <li>Etikettengroesse: {quote.labelSize || "Nicht angegeben"}</li>
          <li>Material: {quote.material || "Nicht angegeben"}</li>
          <li>Menge: {quote.quantity || "Nicht angegeben"}</li>
          <li>Wiederkehrender Bedarf: {quote.recurringNeed || "Nicht angegeben"}</li>
          <li>Druckdatei vorhanden: {quote.hasArtwork == null ? "Nicht angegeben" : quote.hasArtwork ? "Ja" : "Nein"}</li>
          <li>Ziel-Liefertermin: {quote.targetDeliveryDate ? formatQuoteDate(quote.targetDeliveryDate) : "Nicht angegeben"}</li>
          <li>Quelle: {quote.sourcePage || "Nicht angegeben"}</li>
          <li>Umgewandelte Bestellung: {quote.convertedOrderId || "Noch keine"}</li>
        </ul>
        {quote.notes ? <p className="field-hint">Kundennotiz: {quote.notes}</p> : null}
        {quote.adminNote ? <p className="field-hint">Admin-Notiz: {quote.adminNote}</p> : null}
      </article>
    </section>
  );
}
