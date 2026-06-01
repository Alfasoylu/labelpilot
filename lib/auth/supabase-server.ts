import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getPublicEnv, getServerEnv, hasSupabaseServerEnv } from "@/lib/env";

let serverClient: SupabaseClient | null | undefined;

export function getSupabaseServerClient() {
  if (!hasSupabaseServerEnv()) {
    return null;
  }

  if (!serverClient) {
    const publicEnv = getPublicEnv();
    const serverEnv = getServerEnv();

    serverClient = createClient(
      publicEnv.NEXT_PUBLIC_SUPABASE_URL!,
      serverEnv.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  return serverClient;
}

