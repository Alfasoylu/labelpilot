import type { User } from "@supabase/supabase-js";

import { getSupabaseServerClient } from "@/lib/auth/supabase-server";

export type AccountAuthResult =
  | {
      ok: true;
      user: User;
    }
  | {
      ok: false;
      status: number;
      error: string;
    };

export async function getSupabaseUserFromRequest(
  request: Request,
): Promise<AccountAuthResult> {
  const authHeader = request.headers.get("authorization") ?? "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return {
      ok: false,
      status: 401,
      error: "Bitte melden Sie sich im Kundenkonto an.",
    };
  }

  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      status: 503,
      error: "Kundenkonto ist derzeit nicht verfügbar.",
    };
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user?.email) {
    return {
      ok: false,
      status: 401,
      error: "Ihre Sitzung konnte nicht bestätigt werden.",
    };
  }

  return {
    ok: true,
    user: data.user,
  };
}
