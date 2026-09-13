import { NextRequest, NextResponse } from "next/server";

import { getServerEnv } from "@/lib/env";
import { deliverOperatorReply } from "@/lib/chat/deliver-operator-reply";

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

// Extract full session UUID from Telegram notification text: "SID:<uuid> | ..."
function extractSessionId(text?: string): string | null {
  if (!text) return null;
  const match = text.match(/SID:([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/);
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

  // Fail closed: without a configured secret, anyone could POST forged
  // "operator" messages into a chat whose UUID is known/leaked. Require the
  // secret and verify the X-Telegram-Bot-Api-Secret-Token header against it.
  if (!env.CHAT_WEBHOOK_SECRET) {
    console.error("Telegram-Webhook abgelehnt: CHAT_WEBHOOK_SECRET nicht konfiguriert.");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }
  const secret = req.headers.get("x-telegram-bot-api-secret-token");
  if (secret !== env.CHAT_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    console.log("[webhook] ignored: no text or no reply_to_message", { text: msg?.text?.slice(0, 30), hasReply: !!msg?.reply_to_message });
    return NextResponse.json({ ok: true });
  }

  const sessionId = extractSessionId(msg.reply_to_message.text);
  console.log("[webhook] reply received", { replyText: msg.reply_to_message.text?.slice(0, 80), sessionId });
  if (!sessionId) {
    console.log("[webhook] no session ID found in reply text");
    return NextResponse.json({ ok: true });
  }

  // Die Antwort geht in den Chat-Verlauf UND per E-Mail an die hinterlassene
  // Adresse. Ohne den zweiten Weg sieht ein Besucher, der die Seite verlassen
  // hat, die Antwort vom Telefon nie.
  const result = await deliverOperatorReply({ sessionId, reply: msg.text });
  console.log("[webhook] reply delivered", { sessionId, result });

  // Rückmeldung an das Telefon, damit sofort sichtbar ist, ob die Antwort den
  // Besucher tatsächlich erreichen konnte.
  if (env.TELEGRAM_BOT_TOKEN && msg.chat?.id) {
    const note = !result.ok
      ? `⚠️ Antwort konnte nicht gespeichert werden: ${result.error}`
      : result.emailed
        ? "✅ Antwort gesendet – auch per E-Mail zugestellt."
        : result.reason === "no-contact-email"
          ? "⚠️ Antwort steht im Chat, aber der Besucher hat keine E-Mail-Adresse hinterlassen. Er sieht sie nur, solange die Seite offen ist."
          : "⚠️ Antwort steht im Chat, der E-Mail-Versand ist jedoch fehlgeschlagen.";

    await sendTelegramReply(env.TELEGRAM_BOT_TOKEN, msg.chat.id, note);
  }

  return NextResponse.json({ ok: true });
}
