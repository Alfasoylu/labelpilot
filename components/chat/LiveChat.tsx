"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  sender: "visitor" | "operator";
  content: string;
  created_at: string;
};

function genVisitorId(): string {
  return "v_" + Math.random().toString(36).slice(2, 12);
}

// Read-only: never writes. Used on mount so we do NOT store an identifier
// before the visitor actually interacts (TTDSG — no storage without the
// user-initiated functional action of starting a chat).
function readVisitorId(): string {
  try {
    return localStorage.getItem("lp_vid") || "";
  } catch {
    return "";
  }
}

// Creates and persists the id. Only called once the visitor sends a message —
// a functional interaction the user requested, so the identifier is necessary
// to route the conversation.
function getOrCreateVisitorId(): string {
  try {
    const stored = localStorage.getItem("lp_vid");
    if (stored) return stored;
    const id = genVisitorId();
    localStorage.setItem("lp_vid", id);
    return id;
  } catch {
    return genVisitorId();
  }
}

function getStoredSessionId(): string | null {
  try { return sessionStorage.getItem("lp_chat_sid"); } catch { return null; }
}

function storeSessionId(id: string) {
  try { sessionStorage.setItem("lp_chat_sid", id); } catch { /* noop */ }
}

// Merkt sich nur, dass die Abfrage erledigt ist — nie die Adresse selbst.
function readContactSaved(): boolean {
  try { return sessionStorage.getItem("lp_chat_contact") === "1"; } catch { return false; }
}

function markContactSaved() {
  try { sessionStorage.setItem("lp_chat_contact", "1"); } catch { /* noop */ }
}

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [started, setStarted] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  // Kontaktabfrage: erscheint nach der ersten Nachricht, damit eine Anfrage
  // beantwortbar bleibt, wenn der Besucher die Seite verlässt. Am 23.08.2026
  // ging genau so eine echte B2B-Anfrage verloren — der Chat erfasste keine
  // Adresse und der Kontakt war nicht mehr erreichbar.
  const [contactEmail, setContactEmail] = useState("");
  const [contactSaved, setContactSaved] = useState(false);
  const [contactPending, setContactPending] = useState(false);
  const [contactError, setContactError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const visitorId = useRef<string>("");

  // On mount only restore an existing id/session — never create one (no storage
  // write before the visitor interacts).
  useEffect(() => {
    visitorId.current = readVisitorId();
    const sid = getStoredSessionId();
    if (sid) {
      setSessionId(sid);
      setStarted(true);
    }
    if (readContactSaved()) {
      setContactSaved(true);
    }
  }, []);

  // Show promo bubble after 40s if chat not yet opened and no prior session
  useEffect(() => {
    if (started) return;
    const t = setTimeout(() => setShowPromo(true), 40000);
    return () => clearTimeout(t);
  }, [started]);

  // Nachrichten über die eigene Route laden statt direkt aus Supabase.
  //
  // Der Chat ist kein besetzter Live-Kanal: Antworten kommen in der Regel
  // Stunden später. Eine Realtime-Verbindung offen zu halten hätte also kaum
  // Nutzen — sie zwang aber dazu, chat_messages für den anon-Key lesbar zu
  // machen, und damit für jeden mitlesbar. Polling über /api/chat/messages
  // liest serverseitig und ausschließlich die eigene Sitzung.
  const loadMessages = useCallback(async () => {
    if (!sessionId) return;

    try {
      const res = await fetch(
        `/api/chat/messages?sessionId=${encodeURIComponent(sessionId)}`,
        { cache: "no-store" },
      );
      if (!res.ok) return;

      const data = (await res.json()) as { messages?: Message[] };
      if (data.messages) setMessages(data.messages);
    } catch {
      // Netzwerkfehler sind hier folgenlos — der nächste Durchlauf holt nach.
    }
  }, [sessionId]);

  // Einmal beim Wiederfinden der Sitzung: So sieht ein Besucher die Antwort,
  // die in der Zwischenzeit eingegangen ist, auch wenn er Tage später
  // zurückkommt.
  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  // Danach nur abfragen, solange das Fenster offen ist.
  useEffect(() => {
    if (!open || !sessionId) return;

    const interval = setInterval(() => {
      void loadMessages();
    }, 8000);

    return () => clearInterval(interval);
  }, [open, sessionId, loadMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Focus input when opening
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput("");

    // Create + persist the visitor id now (first interaction), not on page load.
    if (!visitorId.current) {
      visitorId.current = getOrCreateVisitorId();
    }

    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId ?? undefined,
          visitorId: visitorId.current,
          content: text,
          pageUrl: window.location.pathname,
        }),
      });
      const data = await res.json() as { sessionId?: string };
      const activeId = data.sessionId ?? sessionId;

      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
        storeSessionId(data.sessionId);
        setStarted(true);
      }

      // Ohne Realtime muss der Verlauf nach dem Senden selbst nachgeladen
      // werden, damit die eigene Nachricht sofort erscheint.
      if (activeId) {
        const res2 = await fetch(
          `/api/chat/messages?sessionId=${encodeURIComponent(activeId)}`,
          { cache: "no-store" },
        );
        if (res2.ok) {
          const payload = (await res2.json()) as { messages?: Message[] };
          if (payload.messages) setMessages(payload.messages);
        }
      }
    } catch {
      setInput(text); // restore on error
    } finally {
      setSending(false);
    }
  }

  async function submitContact() {
    const email = contactEmail.trim();
    if (!email || contactPending || !sessionId) return;

    // Bewusst nur eine Grobprüfung im Browser — die verbindliche Validierung
    // macht der Server.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setContactError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }

    setContactPending(true);
    setContactError("");

    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          visitorId: visitorId.current,
          contactEmail: email,
          pageUrl: window.location.pathname,
        }),
      });

      if (!res.ok) throw new Error("request failed");

      setContactSaved(true);
      markContactSaved();
    } catch {
      setContactError("Konnte nicht gespeichert werden. Bitte erneut versuchen.");
    } finally {
      setContactPending(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div className="livechat__window" role="dialog" aria-label="Live Chat">
          <div className="livechat__header">
            <span className="livechat__header-title">Labelpilot Support</span>
            <span className="livechat__header-hint">
              Nachricht hinterlassen – Antwort in der Regel innerhalb eines Werktags
            </span>
            <button
              className="livechat__close"
              onClick={() => setOpen(false)}
              aria-label="Schließen"
            >
              ✕
            </button>
          </div>

          <div className="livechat__messages">
            {!started && messages.length === 0 && (
              <div className="livechat__welcome">
                <p>Hallo! Wie können wir Ihnen helfen?</p>
                <p className="livechat__welcome-sub">
                  Fragen zu Format, Material, Bestellung oder Druckdaten – einfach
                  schreiben. Wir sind ein kleines Team und nicht durchgehend
                  besetzt: Hinterlassen Sie im nächsten Schritt Ihre
                  E-Mail-Adresse, dann erreicht Sie unsere Antwort auch, wenn Sie
                  längst weitergeklickt haben.
                </p>
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`livechat__msg livechat__msg--${m.sender}`}
              >
                <span className="livechat__msg-text">{m.content}</span>
              </div>
            ))}
            {started && !contactSaved && messages.length > 0 && (
              <div className="livechat__contact">
                <p className="livechat__contact-title">
                  Wohin dürfen wir antworten?
                </p>
                <p className="livechat__contact-sub">
                  Wir sind nicht durchgehend im Chat. Ohne E-Mail-Adresse sehen
                  Sie unsere Antwort nur, solange diese Seite offen bleibt — mit
                  Adresse erreicht sie Sie in jedem Fall.
                </p>
                <div className="livechat__contact-row">
                  <input
                    className="livechat__contact-input"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="ihre@firma.de"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        void submitContact();
                      }
                    }}
                    disabled={contactPending}
                    maxLength={200}
                    aria-label="E-Mail-Adresse für die Antwort"
                  />
                  <button
                    className="livechat__contact-save"
                    onClick={() => void submitContact()}
                    disabled={!contactEmail.trim() || contactPending}
                  >
                    {contactPending ? "…" : "Speichern"}
                  </button>
                </div>
                {contactError && (
                  <p className="livechat__contact-error" role="alert">{contactError}</p>
                )}
                <p className="livechat__contact-hint">
                  Wir nutzen die Adresse ausschließlich für die Antwort auf diese
                  Anfrage.
                </p>
              </div>
            )}
            {contactSaved && messages.length > 0 && (
              <p className="livechat__contact-done" role="status">
                Danke — unsere Antwort geht an Ihre E-Mail-Adresse.
              </p>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="livechat__input-row">
            <input
              ref={inputRef}
              className="livechat__input"
              type="text"
              placeholder="Ihre Nachricht …"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={sending}
              maxLength={2000}
            />
            <button
              className="livechat__send"
              onClick={() => void sendMessage()}
              disabled={!input.trim() || sending}
              aria-label="Senden"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Promo bubble */}
      {showPromo && !open && (
        <div className="livechat__promo" role="status">
          <button
            className="livechat__promo-close"
            onClick={(e) => { e.stopPropagation(); setShowPromo(false); }}
            aria-label="Schließen"
          >✕</button>
          <span
            className="livechat__promo-text"
            onClick={() => { setShowPromo(false); setOpen(true); }}
          >Nicht gefunden, was Sie suchen? Wir helfen gerne.</span>
        </div>
      )}

      {/* Floating button */}
      <button
        className={`livechat__fab${open ? " livechat__fab--open" : ""}`}
        onClick={() => { setShowPromo(false); setOpen((v) => !v); }}
        aria-label={open ? "Chat schließen" : "Chat öffnen"}
      >
        {open ? (
          <span aria-hidden>✕</span>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor"/>
          </svg>
        )}
      </button>
    </>
  );
}
