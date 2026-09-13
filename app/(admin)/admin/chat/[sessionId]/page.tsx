import Link from "next/link";
import { notFound } from "next/navigation";

import { formatChatDate, getChatSession } from "@/lib/admin/chat";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ status?: string; error?: string }>;
};

export default async function AdminChatDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { sessionId } = await params;
  const { status, error } = await searchParams;
  const data = await getChatSession(sessionId);

  if (!data) {
    notFound();
  }

  const { session, messages } = data;

  return (
    <div className="section-stack">
      <section className="surface-card">
        <p className="eyebrow">Chat-Verlauf</p>
        <h2>{session.contactEmail ?? "Besucher ohne Kontaktadresse"}</h2>
        <Link href="/admin/chat" className="secondary-link">
          Zurück zur Übersicht
        </Link>

        {status ? (
          <p className="field-hint" role="status">
            {status}
          </p>
        ) : null}
        {error ? (
          <p className="field-hint" role="alert">
            {error}
          </p>
        ) : null}

        <dl className="kontakt-info-card__list">
          <div className="kontakt-info-card__row">
            <dt>Name</dt>
            <dd>{session.contactName ?? "—"}</dd>
          </div>
          <div className="kontakt-info-card__row">
            <dt>E-Mail</dt>
            <dd>
              {session.contactEmail ? (
                <a href={`mailto:${session.contactEmail}`}>{session.contactEmail}</a>
              ) : (
                "nicht hinterlassen"
              )}
            </dd>
          </div>
          <div className="kontakt-info-card__row">
            <dt>Seite</dt>
            <dd>{session.pageUrl ?? "unbekannt"}</dd>
          </div>
          <div className="kontakt-info-card__row">
            <dt>Begonnen</dt>
            <dd>{formatChatDate(session.createdAt)}</dd>
          </div>
          <div className="kontakt-info-card__row">
            <dt>Status</dt>
            <dd>
              {session.resolvedAt
                ? `erledigt am ${formatChatDate(session.resolvedAt)}`
                : session.awaitingReply
                  ? "wartet auf Antwort"
                  : "offen"}
            </dd>
          </div>
        </dl>

        {!session.contactEmail ? (
          <p className="field-hint">
            Ohne Kontaktadresse erreicht eine Antwort den Besucher nur, solange er
            die Seite geöffnet hat. Für eine verlässliche Rückmeldung fehlt hier
            der Rückweg.
          </p>
        ) : null}
      </section>

      <section className="surface-card">
        <h3>Verlauf</h3>
        {messages.length === 0 ? (
          <p className="field-hint">Keine Nachrichten.</p>
        ) : (
          <ul className="simple-list">
            {messages.map((message) => (
              <li key={message.id}>
                <strong>
                  {message.sender === "operator" ? "Labelpilot" : "Besucher"}
                </strong>{" "}
                · {formatChatDate(message.createdAt)}
                <br />
                <span style={{ whiteSpace: "pre-wrap" }}>{message.content}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="surface-card">
        <h3>Antworten</h3>
        <p className="field-hint">
          Die Antwort landet im Chat-Verlauf und geht — sofern eine Adresse
          vorliegt — zusätzlich per E-Mail raus.
        </p>
        <form action={`/api/admin/chat/${session.id}/reply`} method="post">
          <label htmlFor="reply">Nachricht</label>
          <textarea id="reply" name="reply" rows={6} required maxLength={4000} />
          <div className="cta-row">
            <button type="submit" className="cta-button">
              Antwort senden
            </button>
          </div>
        </form>

        <form
          action={`/api/admin/chat/${session.id}/resolve`}
          method="post"
          style={{ marginTop: "16px" }}
        >
          <input
            type="hidden"
            name="resolved"
            value={session.resolvedAt ? "false" : "true"}
          />
          <button type="submit" className="secondary-link">
            {session.resolvedAt
              ? "Wieder als offen markieren"
              : "Als erledigt markieren"}
          </button>
        </form>
      </section>
    </div>
  );
}
