"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

type Message = {
  id: string;
  sender: "visitor" | "operator";
  content: string;
  created_at: string;
};

function genVisitorId(): string {
  return "v_" + Math.random().toString(36).slice(2, 12);
}

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

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const visitorId = useRef<string>("");

  // Init visitor ID on mount
  useEffect(() => {
    visitorId.current = getOrCreateVisitorId();
    const sid = getStoredSessionId();
    if (sid) {
      setSessionId(sid);
      setStarted(true);
    }
  }, []);

  // Load existing messages + subscribe to realtime when sessionId is known
  useEffect(() => {
    if (!sessionId) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    // Initial load
    void supabase
      .from("chat_messages")
      .select("id, sender, content, created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data as Message[]);
      });

    // Realtime subscription
    const channel = supabase
      .channel(`chat:${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setMessages((prev) => {
            const msg = payload.new as Message;
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        },
      )
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, [sessionId]);

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
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
        storeSessionId(data.sessionId);
        setStarted(true);
      }
    } catch {
      setInput(text); // restore on error
    } finally {
      setSending(false);
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
            <span className="livechat__header-hint">Genellikle birkaç dakika içinde yanıt verilir</span>
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
                <p>Merhaba! Size nasıl yardımcı olabiliriz?</p>
                <p className="livechat__welcome-sub">Etiket formatı, sipariş veya teknik sorularınızı yazabilirsiniz.</p>
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
            <div ref={bottomRef} />
          </div>

          <div className="livechat__input-row">
            <input
              ref={inputRef}
              className="livechat__input"
              type="text"
              placeholder="Mesajınızı yazın…"
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

      {/* Floating button */}
      <button
        className={`livechat__fab${open ? " livechat__fab--open" : ""}`}
        onClick={() => setOpen((v) => !v)}
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
