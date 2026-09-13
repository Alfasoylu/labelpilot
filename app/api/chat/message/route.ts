import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getServerEnv } from "@/lib/env";
import { getSupabaseServerClient } from "@/lib/auth/supabase-server";
import { sendEmail } from "@/lib/email/send";
import { chatMessageOpsNotification } from "@/lib/email/templates/lifecycle";

const schema = z
  .object({
    sessionId: z.string().uuid().optional(),
    visitorId: z.string().min(1).max(64),
    content: z.string().min(1).max(2000).trim().optional(),
    pageUrl: z.string().max(500).optional(),
    // Optional: der Besucher kann eine Rückmeldeadresse hinterlassen, damit
    // eine Anfrage nicht verloren geht, wenn er die Seite verlässt, bevor
    // jemand antwortet.
    contactEmail: z.string().max(200).email().optional(),
    contactName: z.string().max(120).trim().optional(),
  })
  .refine((value) => Boolean(value.content) || Boolean(value.contactEmail), {
    message: "Entweder eine Nachricht oder eine Kontaktadresse ist erforderlich.",
  })
  // Kontaktdaten werden immer zu einer bereits laufenden Sitzung nachgereicht.
  .refine((value) => Boolean(value.content) || Boolean(value.sessionId), {
    message: "Kontaktdaten ohne Nachricht benötigen eine bestehende Sitzung.",
  });

async function sendTelegramNotification(
  token: string,
  chatId: string,
  sessionId: string,
  content: string,
  pageUrl?: string,
) {
  const page = pageUrl ? `\n🔗 ${pageUrl}` : "";
  const text = `💬 SID:${sessionId} | Neue Nachricht${page}\n\n"${content}"\n\nZum Antworten diese Nachricht zitieren.`;
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

  const { sessionId, visitorId, content, pageUrl, contactEmail, contactName } =
    parsed.data;

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  // Create or verify session
  let activeSessionId = sessionId;
  if (!activeSessionId) {
    const { data: session, error } = await supabase
      .from("chat_sessions")
      .insert({
        visitor_id: visitorId,
        page_url: pageUrl,
        contact_email: contactEmail ?? null,
        contact_name: contactName || null,
      })
      .select("id")
      .single();
    if (error || !session) {
      return NextResponse.json({ error: "Could not create session" }, { status: 500 });
    }
    activeSessionId = session.id as string;
  } else if (contactEmail) {
    // Die Adresse wird in der Regel erst nach der ersten Nachricht nachgereicht.
    // Eine bereits hinterlegte Adresse wird dabei nicht überschrieben.
    const { error: contactError } = await supabase
      .from("chat_sessions")
      .update({
        contact_email: contactEmail,
        ...(contactName ? { contact_name: contactName } : {}),
      })
      .eq("id", activeSessionId)
      .is("contact_email", null);

    if (contactError) {
      console.error(
        "[chat/message] Kontaktadresse konnte nicht gespeichert werden:",
        contactError,
      );
    }
  }

  if (content) {
    const { error: msgError } = await supabase.from("chat_messages").insert({
      session_id: activeSessionId,
      sender: "visitor",
      content,
    });
    if (msgError) {
      return NextResponse.json({ error: "Could not save message" }, { status: 500 });
    }
  }

  const env = getServerEnv();

  // Notify operator via Telegram (fire-and-forget; don't block response)
  if (content && env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_OPERATOR_CHAT_ID) {
    sendTelegramNotification(
      env.TELEGRAM_BOT_TOKEN,
      env.TELEGRAM_OPERATOR_CHAT_ID,
      activeSessionId,
      content,
      pageUrl,
    ).catch((err: unknown) => {
      console.error("[chat/message] Telegram notification failed:", err instanceof Error ? err.message : String(err));
    });
  } else if (content) {
    console.log("[chat/message] Telegram env vars missing", { hasToken: !!env.TELEGRAM_BOT_TOKEN, hasChatId: !!env.TELEGRAM_OPERATOR_CHAT_ID });
  }

  // Zusätzlich per E-Mail ins Betriebspostfach. Bisher lief die einzige
  // Benachrichtigung über Telegram — fehlte dort ein Token oder las niemand
  // mit, blieb eine Chat-Anfrage unbemerkt, ohne jede Spur im Postfach.
  const opsInbox = env.ADMIN_NOTIFY_EMAIL || env.EMAIL_REPLY_TO;
  if (opsInbox) {
    const template = chatMessageOpsNotification({
      sessionId: activeSessionId,
      content: content ?? "(keine neue Nachricht – Kontaktdaten nachgereicht)",
      pageUrl,
      contactEmail: contactEmail ?? null,
      contactName: contactName || null,
    });

    void sendEmail({
      to: opsInbox,
      subject: template.subject,
      html: template.html,
      text: template.text,
    }).catch((err: unknown) => {
      console.error(
        "[chat/message] E-Mail-Benachrichtigung fehlgeschlagen:",
        err instanceof Error ? err.message : String(err),
      );
    });
  }

  return NextResponse.json({ sessionId: activeSessionId });
}
