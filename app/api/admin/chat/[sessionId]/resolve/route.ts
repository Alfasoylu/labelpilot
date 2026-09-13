import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/auth/supabase-server";
import { verifyAdminRequest } from "@/lib/security/admin-request-auth";

export async function POST(
  request: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await context.params;

  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  const url = new URL(`/admin/chat/${sessionId}`, request.url);

  if (!supabase) {
    url.searchParams.set("error", "Supabase ist nicht konfiguriert.");
    return NextResponse.redirect(url, { status: 303 });
  }

  const formData = await request.formData();
  const resolved = formData.get("resolved") === "true";

  const { error } = await supabase
    .from("chat_sessions")
    .update({ resolved_at: resolved ? new Date().toISOString() : null })
    .eq("id", sessionId);

  url.searchParams.set(
    error ? "error" : "status",
    error
      ? `Status konnte nicht geändert werden: ${error.message}`
      : resolved
        ? "Als erledigt markiert."
        : "Wieder als offen markiert.",
  );

  return NextResponse.redirect(url, { status: 303 });
}
