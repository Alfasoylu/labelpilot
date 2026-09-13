import Link from "next/link";

import { formatChatDate, listChatSessions } from "@/lib/admin/chat";

export const dynamic = "force-dynamic";

export default async function AdminChatPage() {
  const sessions = await listChatSessions();
  const awaiting = sessions.filter((session) => session.awaitingReply);
  const rest = sessions.filter((session) => !session.awaitingReply);

  return (
    <div className="section-stack">
      <section className="surface-card">
        <p className="eyebrow">Chat</p>
        <h2>Anfragen aus dem Live-Chat</h2>
        <p className="field-hint">
          Der Chat ist ein asynchroner Kanal: Antworten gehen zusätzlich per
          E-Mail an die hinterlassene Adresse raus, damit sie den Besucher auch
          erreichen, wenn er die Seite längst verlassen hat. Antworten ist auch
          per Telegram möglich — beide Wege landen im selben Verlauf.
        </p>
      </section>

      <section className="surface-card">
        <h3>Unbeantwortet ({awaiting.length})</h3>
        {awaiting.length === 0 ? (
          <p className="field-hint">Keine offenen Chat-Anfragen.</p>
        ) : (
          <ul className="simple-list">
            {awaiting.map((session) => (
              <li key={session.id}>
                <Link href={`/admin/chat/${session.id}`}>
                  {session.contactEmail ?? "ohne Kontaktadresse"}
                </Link>{" "}
                · {session.lastMessageAt ? formatChatDate(session.lastMessageAt) : "—"}{" "}
                · {session.pageUrl ?? "unbekannte Seite"}
                {!session.contactEmail ? " · ⚠️ nur im Chat erreichbar" : null}
                <br />
                <span className="field-hint">
                  {session.lastMessage?.slice(0, 160) ?? "Keine Nachricht"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="surface-card">
        <h3>Übrige Verläufe ({rest.length})</h3>
        {rest.length === 0 ? (
          <p className="field-hint">Keine weiteren Verläufe.</p>
        ) : (
          <ul className="simple-list">
            {rest.map((session) => (
              <li key={session.id}>
                <Link href={`/admin/chat/${session.id}`}>
                  {session.contactEmail ?? "ohne Kontaktadresse"}
                </Link>{" "}
                · {session.lastMessageAt ? formatChatDate(session.lastMessageAt) : "—"}{" "}
                · {session.messageCount} Nachricht(en)
                {session.resolvedAt ? " · erledigt" : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
