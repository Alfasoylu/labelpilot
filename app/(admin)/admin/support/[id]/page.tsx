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

type SupportAttachment = { path: string; name: string; size: number; type: string };

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "long", timeStyle: "short" }).format(value);
}

type SupportDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
};

export default async function AdminSupportDetailPage({ params, searchParams }: SupportDetailPageProps) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Support-Verwaltung ist derzeit nicht verfügbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const { id } = await params;
  const feedback = await searchParams;

  const ticket = await prisma.supportRequest.findUnique({
    where: { id },
    select: {
      id: true,
      type: true,
      subject: true,
      message: true,
      status: true,
      adminNote: true,
      attachments: true,
      createdAt: true,
      customer: {
        select: { email: true, companyName: true, contactName: true, phone: true },
      },
      order: { select: { id: true, orderNumber: true } },
    },
  });

  if (!ticket) {
    return (
      <article className="legal-card">
        <h2>Support-Anfrage nicht gefunden.</h2>
        <a href="/admin/support" className="secondary-link">Zurück zur Liste</a>
      </article>
    );
  }

  const attachments = Array.isArray(ticket.attachments)
    ? (ticket.attachments as unknown as SupportAttachment[])
    : [];

  return (
    <section className="section-stack">
      <article className="surface-card">
        <div className="cta-row">
          <a href="/admin/support" className="secondary-link">Zurück zur Liste</a>
        </div>
        <h2>{ticket.subject}</h2>
        <p className="price-note">
          {TYPE_LABELS[ticket.type] ?? ticket.type} · {STATUS_LABELS[ticket.status] ?? ticket.status} ·{" "}
          {formatDate(ticket.createdAt)}
        </p>
        {feedback.message ? <p className="form-status success">{feedback.message}</p> : null}
        {feedback.error ? <p className="form-status error">{feedback.error}</p> : null}
      </article>

      <article className="surface-card">
        <h2>Kunde</h2>
        <ul className="simple-list">
          <li>Firma: {ticket.customer?.companyName || "—"}</li>
          <li>Ansprechpartner: {ticket.customer?.contactName || "—"}</li>
          <li>E-Mail: {ticket.customer?.email || "—"}</li>
          <li>Telefon: {ticket.customer?.phone || "—"}</li>
          {ticket.order?.orderNumber ? (
            <li>
              Bestellung:{" "}
              <a href={`/admin/orders/${ticket.order.id}`} className="secondary-link">
                {ticket.order.orderNumber} →
              </a>
            </li>
          ) : null}
        </ul>
      </article>

      <article className="surface-card">
        <h2>Nachricht</h2>
        <p style={{ whiteSpace: "pre-wrap" }}>{ticket.message}</p>
        {attachments.length > 0 ? (
          <>
            <h3 style={{ marginTop: "1rem" }}>Anhänge</h3>
            <ul className="simple-list">
              {attachments.map((a, i) => (
                <li key={`${ticket.id}-att-${i}`}>
                  <a
                    href={`/api/admin/support/${ticket.id}/attachment/${i}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="secondary-link"
                  >
                    {a.name} herunterladen →
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </article>

      <article className="surface-card">
        <h2>Anfrage bearbeiten</h2>
        <form action={`/api/admin/support/${ticket.id}`} method="post" className="quote-form">
          <div className="form-grid">
            <div>
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={ticket.status}>
                <option value="OPEN">Offen</option>
                <option value="IN_REVIEW">In Bearbeitung</option>
                <option value="RESOLVED">Gelöst</option>
              </select>
            </div>
            <div className="field-full">
              <label htmlFor="adminNote">Interne Notiz</label>
              <textarea id="adminNote" name="adminNote" rows={4} defaultValue={ticket.adminNote ?? ""} />
            </div>
          </div>
          <div className="inline-actions">
            <button type="submit" className="cta-button">Speichern</button>
          </div>
        </form>
        <p className="field-hint">
          Antworten an den Kunden erfolgen per E-Mail an {ticket.customer?.email || "die hinterlegte Adresse"}.
        </p>
      </article>
    </section>
  );
}
