import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseServerClient } from "@/lib/auth/supabase-server";

/**
 * Nachrichten einer Chat-Sitzung für den Besucher.
 *
 * Vorher las der Chat-Client `chat_messages` direkt mit dem anon-Key. Die dafür
 * nötige Policy erlaubte das Lesen ALLER Nachrichten aller Besucher — wer den
 * anon-Key aus dem Seitenquelltext nahm, konnte jede Konversation mitlesen.
 *
 * Diese Route liest stattdessen serverseitig mit dem Service-Role-Key und gibt
 * ausschließlich die Nachrichten der angefragten Sitzung zurück. Die Sitzungs-ID
 * ist eine zufällige UUID v4 und damit nicht erratbar — dasselbe Schutzmodell
 * wie bei den signierten Auftragslinks.
 */
const querySchema = z.object({
  sessionId: z.string().uuid(),
});

const MAX_MESSAGES = 200;

export async function GET(req: NextRequest) {
  const parsed = querySchema.safeParse({
    sessionId: req.nextUrl.searchParams.get("sessionId"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, sender, content, created_at")
    .eq("session_id", parsed.data.sessionId)
    .order("created_at", { ascending: true })
    .limit(MAX_MESSAGES);

  if (error) {
    console.error("[chat/messages] Abruf fehlgeschlagen:", error.message);
    return NextResponse.json({ error: "Could not load messages" }, { status: 500 });
  }

  return NextResponse.json(
    { messages: data ?? [] },
    // Antworten dürfen nie aus einem Cache kommen — sonst sieht der Besucher
    // eine veraltete Konversation.
    { headers: { "Cache-Control": "no-store" } },
  );
}
