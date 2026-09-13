import { getSupabaseServerClient } from "@/lib/auth/supabase-server";

export type AdminChatMessage = {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
};

export type AdminChatSession = {
  id: string;
  pageUrl: string | null;
  contactEmail: string | null;
  contactName: string | null;
  createdAt: string;
  resolvedAt: string | null;
  lastMessageAt: string | null;
  lastMessage: string | null;
  /** Letzte Nachricht stammt vom Besucher — also noch unbeantwortet. */
  awaitingReply: boolean;
  messageCount: number;
};

export function formatChatDate(value: string | Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(typeof value === "string" ? new Date(value) : value);
}

type SessionRow = {
  id: string;
  page_url: string | null;
  contact_email: string | null;
  contact_name: string | null;
  created_at: string;
  resolved_at: string | null;
};

type MessageRow = {
  id: string;
  session_id: string;
  sender: string;
  content: string;
  created_at: string;
};

/**
 * Alle Chat-Sitzungen mit der jeweils letzten Nachricht.
 *
 * Bewusst über den Supabase-Client und nicht über Prisma: Der Chat wird
 * durchgehend über Supabase geschrieben (Route + Telegram-Webhook), und beide
 * Wege auf derselben Verbindung zu halten spart eine zweite Datenquelle für
 * dieselben zwei Tabellen.
 */
export async function listChatSessions(limit = 100): Promise<AdminChatSession[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return [];
  }

  const { data: sessions, error } = await supabase
    .from("chat_sessions")
    .select("id, page_url, contact_email, contact_name, created_at, resolved_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !sessions?.length) {
    return [];
  }

  const sessionRows = sessions as SessionRow[];
  const { data: messages } = await supabase
    .from("chat_messages")
    .select("id, session_id, sender, content, created_at")
    .in(
      "session_id",
      sessionRows.map((session) => session.id),
    )
    .order("created_at", { ascending: true });

  const bySession = new Map<string, MessageRow[]>();
  for (const message of (messages ?? []) as MessageRow[]) {
    const bucket = bySession.get(message.session_id);
    if (bucket) {
      bucket.push(message);
    } else {
      bySession.set(message.session_id, [message]);
    }
  }

  return sessionRows.map((session) => {
    const sessionMessages = bySession.get(session.id) ?? [];
    const last = sessionMessages.at(-1);

    return {
      id: session.id,
      pageUrl: session.page_url,
      contactEmail: session.contact_email,
      contactName: session.contact_name,
      createdAt: session.created_at,
      resolvedAt: session.resolved_at,
      lastMessageAt: last?.created_at ?? null,
      lastMessage: last?.content ?? null,
      awaitingReply: last ? last.sender === "visitor" && !session.resolved_at : false,
      messageCount: sessionMessages.length,
    };
  });
}

export async function getChatSession(sessionId: string): Promise<{
  session: AdminChatSession;
  messages: AdminChatMessage[];
} | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data: session } = await supabase
    .from("chat_sessions")
    .select("id, page_url, contact_email, contact_name, created_at, resolved_at")
    .eq("id", sessionId)
    .maybeSingle();

  if (!session) {
    return null;
  }

  const { data: messages } = await supabase
    .from("chat_messages")
    .select("id, session_id, sender, content, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  const rows = (messages ?? []) as MessageRow[];
  const last = rows.at(-1);
  const typedSession = session as SessionRow;

  return {
    session: {
      id: typedSession.id,
      pageUrl: typedSession.page_url,
      contactEmail: typedSession.contact_email,
      contactName: typedSession.contact_name,
      createdAt: typedSession.created_at,
      resolvedAt: typedSession.resolved_at,
      lastMessageAt: last?.created_at ?? null,
      lastMessage: last?.content ?? null,
      awaitingReply: last
        ? last.sender === "visitor" && !typedSession.resolved_at
        : false,
      messageCount: rows.length,
    },
    messages: rows.map((message) => ({
      id: message.id,
      sender: message.sender,
      content: message.content,
      createdAt: message.created_at,
    })),
  };
}
