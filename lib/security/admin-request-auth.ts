import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Defense-in-depth admin check for API route handlers.
 *
 * Mirrors the middleware gate: when Supabase env vars are present, the request
 * must carry a valid Supabase session whose email matches ADMIN_EMAIL. When
 * Supabase is not configured, falls back to verifying the Basic-Auth header
 * against ADMIN_BASIC_USER / ADMIN_BASIC_PASSWORD (the credential the
 * middleware already enforced).
 */
export async function verifyAdminRequest(request: Request): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (supabaseUrl && supabaseAnonKey && adminEmail) {
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // Read-only check — token refresh is handled by the middleware.
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return Boolean(user && user.email?.toLowerCase() === adminEmail);
  }

  return verifyBasicAuthHeader(request);
}

function verifyBasicAuthHeader(request: Request): boolean {
  const expectedUser = process.env.ADMIN_BASIC_USER?.trim();
  const expectedPassword = process.env.ADMIN_BASIC_PASSWORD?.trim();
  if (!expectedUser || !expectedPassword) {
    return false;
  }

  const headerValue = request.headers.get("authorization");
  if (!headerValue?.startsWith("Basic ")) {
    return false;
  }

  try {
    const decoded = Buffer.from(
      headerValue.slice("Basic ".length).trim(),
      "base64",
    ).toString("utf8");
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) {
      return false;
    }
    return (
      decoded.slice(0, separatorIndex) === expectedUser &&
      decoded.slice(separatorIndex + 1) === expectedPassword
    );
  } catch {
    return false;
  }
}
