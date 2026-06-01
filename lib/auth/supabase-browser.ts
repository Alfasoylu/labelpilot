import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getPublicEnv, hasSupabasePublicEnv } from "@/lib/env";

let browserClient: SupabaseClient | null | undefined;

export function getSupabaseBrowserClient() {
  if (typeof window === "undefined" || !hasSupabasePublicEnv()) {
    return null;
  }

  if (!browserClient) {
    const env = getPublicEnv();
    browserClient = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL!,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return browserClient;
}

