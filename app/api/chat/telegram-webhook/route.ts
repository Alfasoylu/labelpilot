import { NextRequest, NextResponse } from "next/server";

import { getServerEnv } from "@/lib/env";
import { getSupabaseServerClient } from "@/lib/auth/supabase-server";

type TelegramMessage = {
  message_id: number;
  text?: string;
  reply_to_message?: {
    message_id: number;
    text?: string;
  };
};

type TelegramUpdate = {
  message?: TelegramMessage & { from?: { id: number }; chat?: { id: number } };
};

// Extract session ID from Telegram notification text: "[abc12345] ..."
function extractSessionPrefix(text?: string): string | null {
  if (!text) return null;
  const match = text.match(/\[([a-f0-9]{8})\]/);
  return match ? match[1] : null;
}

async function sendTelegramReply(token: string, chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

export async function POST(req: NextRequest) {
  const env = getServerEnv();

  // Verify secret token sent by Telegram in X-Telegram-Bot-Api-Secret-Token header
  if (env.CHAT_WEBHOOK_SECRET) {
    const secret = req.headers.get("x-telegram-bot-api-secret-token");
    if (secret !== env.CHAT_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const update: TelegramUpdate = await req.json().catch(() => ({}));
  const msg = update.message;

  // /start or /chatid command — reply with the sender's numeric chat ID
  if (msg?.text && (msg.text === "/start" || msg.text === "/chatid") && msg.from?.id) {
    if (env.TELEGRAM_BOT_TOKEN) {
      await sendTelegramReply(
        env.TELEGRAM_BOT_TOKEN,
        msg.from.id,
        `Deine Chat-ID: ${msg.from.id}\n\nTrage diese Zahl als TELEGRAM_OPERATOR_CHAT_ID in Vercel ein.`,
      );
    }
    return NextResponse.json({ ok: true });
  }

  if (!msg?.text || !msg.reply_to_message) {
    // Not a reply — ignore
    return NextResponse.json({ ok: true });
  }

  const sessionPrefix = extractSessionPrefix(msg.reply_to_message.text);
  if (!sessionPrefix) {
    return NextResponse.json({ ok: true });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ ok: true });

  // Find session by ID prefix
  const { data: sessions } = await supabase
    .from("chat_sessions")
    .select("id")
    .ilike("id", `${sessionPrefix}%`)
    .is("resolved_at", null)
    .limit(1);

  const session = sessions?.[0] as { id: string } | undefined;
  if (!session) return NextResponse.json({ ok: true });

  await supabase.from("chat_messages").insert({
    session_id: session.id,
    sender: "operator",
    content: msg.text,
  });

  return NextResponse.json({ ok: true });
}
