import { getSupabaseServerClient } from "@/lib/auth/supabase-server";
import { sendEmail } from "@/lib/email/send";
import { chatReplyToVisitor } from "@/lib/email/templates/lifecycle";

/**
 * Zustellung einer Operator-Antwort aus dem Chat.
 *
 * Hintergrund: Der Chat ist kein besetzter Live-Kanal. Antworten entstehen in
 * der Regel Stunden später — per Telegram vom Telefon oder im Admin-Panel. Bis
 * dahin hat der Besucher die Seite längst verlassen, und eine Antwort, die nur
 * in `chat_messages` landet, sieht er nie. Genau so ging am 23.08.2026 eine
 * echte B2B-Anfrage verloren.
 *
 * Deshalb geht jede Antwort zwei Wege gleichzeitig:
 *   1. in den Chat-Verlauf — falls der Besucher noch auf der Seite ist,
 *   2. per E-Mail an die hinterlassene Adresse — der eigentliche Rückweg.
 *
 * Die E-Mail ist der wichtigere der beiden Wege und deshalb kein Nebeneffekt:
 * Der Aufrufer erfährt über `emailed`, ob sie rausging, und kann das im
 * Admin-Panel anzeigen.
 */
export type OperatorReplyResult =
  | { ok: true; emailed: boolean; reason?: "no-contact-email" | "email-failed" }
  | { ok: false; error: string };

export async function deliverOperatorReply(input: {
  sessionId: string;
  reply: string;
}): Promise<OperatorReplyResult> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return { ok: false, error: "Supabase ist nicht konfiguriert." };
  }

  const { error: insertError } = await supabase.from("chat_messages").insert({
    session_id: input.sessionId,
    sender: "operator",
    content: input.reply,
  });

  if (insertError) {
    return { ok: false, error: insertError.message };
  }

  const { data: session } = await supabase
    .from("chat_sessions")
    .select("contact_email, contact_name")
    .eq("id", input.sessionId)
    .maybeSingle();

  const contactEmail = (session?.contact_email as string | null) ?? null;

  if (!contactEmail) {
    return { ok: true, emailed: false, reason: "no-contact-email" };
  }

  // Die letzte Besuchernachricht wird zitiert, damit die E-Mail auch Wochen
  // später ohne den Chat-Verlauf verständlich bleibt.
  const { data: lastVisitorMessage } = await supabase
    .from("chat_messages")
    .select("content")
    .eq("session_id", input.sessionId)
    .eq("sender", "visitor")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const template = chatReplyToVisitor({
    reply: input.reply,
    visitorMessage: (lastVisitorMessage?.content as string | null) ?? null,
    contactName: (session?.contact_name as string | null) ?? null,
  });

  const result = await sendEmail({
    to: contactEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });

  return result.ok
    ? { ok: true, emailed: true }
    : { ok: true, emailed: false, reason: "email-failed" };
}
