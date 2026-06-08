import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getServerEnv } from "@/lib/env";
import { getSupabaseServerClient } from "@/lib/auth/supabase-server";

const schema = z.object({
  sessionId: z.string().uuid().optional(),
  visitorId: z.string().min(1).max(64),
  content: z.string().min(1).max(2000).trim(),
  pageUrl: z.string().max(500).optional(),
});

async function sendTelegramNotification(
  token: string,
  chatId: string,
  sessionId: string,
  content: string,
  pageUrl?: string,
) {
  const page = pageUrl ? `\n🔗 ${pageUrl}` : "";
  const text = `💬 SID:${sessionId.slice(0, 8)} | Neue Nachricht${page}\n\n"${content}"\n\nZum Antworten diese Nachricht zitieren.`;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });
  const data = await res.json() as { ok: boolean; result?: { message_id: number } };
  return data.ok ? data.result?.message_id : null;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { sessionId, visitorId, content, pageUrl } = parsed.data;

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  // Create or verify session
  let activeSessionId = sessionId;
  if (!activeSessionId) {
    const { data: session, error } = await supabase
      .from("chat_sessions")
      .insert({ visitor_id: visitorId, page_url: pageUrl })
      .select("id")
      .single();
    if (error || !session) {
      return NextResponse.json({ error: "Could not create session" }, { status: 500 });
    }
    activeSessionId = session.id as string;
  }

  // Save the message
  const { error: msgError } = await supabase.from("chat_messages").insert({
    session_id: activeSessionId,
    sender: "visitor",
    content,
  });
  if (msgError) {
    return NextResponse.json({ error: "Could not save message" }, { status: 500 });
  }

  // Notify operator via Telegram (fire-and-forget; don't block response)
  const env = getServerEnv();
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_OPERATOR_CHAT_ID) {
    sendTelegramNotification(
      env.TELEGRAM_BOT_TOKEN,
      env.TELEGRAM_OPERATOR_CHAT_ID,
      activeSessionId,
      content,
      pageUrl,
    ).catch((err: unknown) => {
      console.error("[chat/message] Telegram notification failed:", err instanceof Error ? err.message : String(err));
    });
  } else {
    console.log("[chat/message] Telegram env vars missing", { hasToken: !!env.TELEGRAM_BOT_TOKEN, hasChatId: !!env.TELEGRAM_OPERATOR_CHAT_ID });
  }

  return NextResponse.json({ sessionId: activeSessionId });
}
