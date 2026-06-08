import { NextRequest, NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";

// One-time endpoint to register the Telegram webhook.
// Protected by CHAT_WEBHOOK_SECRET — call once after deploy, then forget.
// GET /api/chat/setup-webhook?secret=YOUR_CHAT_WEBHOOK_SECRET
export async function GET(req: NextRequest) {
  const env = getServerEnv();
  const secret = req.nextUrl.searchParams.get("secret");

  if (!env.CHAT_WEBHOOK_SECRET || secret !== env.CHAT_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!env.TELEGRAM_BOT_TOKEN) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not set" }, { status: 500 });
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : null;

  if (!appUrl) {
    return NextResponse.json({ error: "Could not determine app URL" }, { status: 500 });
  }

  const webhookUrl = `${appUrl}/api/chat/telegram-webhook`;

  const res = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/setWebhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        secret_token: env.CHAT_WEBHOOK_SECRET,
        allowed_updates: ["message"],
      }),
    }
  );

  const data = await res.json();
  return NextResponse.json({ webhookUrl, telegram: data });
}
