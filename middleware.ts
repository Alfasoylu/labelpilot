import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_PATHS = ["/admin", "/api/admin"] as const;
const ADMIN_LOGIN_PATH = "/admin-login";

function isAdminPath(pathname: string) {
  return ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function isAdminApiPath(pathname: string) {
  return pathname === "/api/admin" || pathname.startsWith("/api/admin/");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isAdminPath(pathname)) {
    return NextResponse.next();
  }

  // Auth routes are always accessible (logout, future auth endpoints)
  if (pathname.startsWith("/api/admin/auth/")) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  // No Supabase config → fall back to Basic Auth (dev / partial-config environments)
  if (!supabaseUrl || !supabaseAnonKey || !adminEmail) {
    return handleBasicAuth(request);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email?.toLowerCase() !== adminEmail) {
    if (isAdminApiPath(pathname)) {
      return NextResponse.json({ message: "Nicht autorisiert." }, { status: 401 });
    }
    const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

// Constant-time string comparison using Web Crypto API (Edge Runtime safe).
async function safeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const keyMaterial = crypto.getRandomValues(new Uint8Array(32));
  const key = await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const [macA, macB] = await Promise.all([
    crypto.subtle.sign("HMAC", key, enc.encode(a)),
    crypto.subtle.sign("HMAC", key, enc.encode(b)),
  ]);
  const viewA = new Uint8Array(macA);
  const viewB = new Uint8Array(macB);
  let diff = 0;
  for (let i = 0; i < viewA.length; i++) diff |= viewA[i] ^ viewB[i];
  return diff === 0;
}

function unauthorizedResponse() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Labelpilot Admin"' },
  });
}

async function handleBasicAuth(request: NextRequest): Promise<NextResponse> {
  const expectedUser = process.env.ADMIN_BASIC_USER?.trim();
  const expectedPassword = process.env.ADMIN_BASIC_PASSWORD?.trim();

  if (!expectedUser || !expectedPassword) {
    return new NextResponse("Admin-Konfiguration fehlt.", { status: 503 });
  }

  const headerValue = request.headers.get("authorization");
  if (!headerValue?.startsWith("Basic ")) return unauthorizedResponse();

  try {
    const decoded = atob(headerValue.slice("Basic ".length).trim());
    const sep = decoded.indexOf(":");
    if (sep === -1) return unauthorizedResponse();
    const provided = { user: decoded.slice(0, sep), password: decoded.slice(sep + 1) };

    const [userOk, passOk] = await Promise.all([
      safeEqual(provided.user, expectedUser),
      safeEqual(provided.password, expectedPassword),
    ]);

    if (!userOk || !passOk) return unauthorizedResponse();
    return NextResponse.next();
  } catch {
    return unauthorizedResponse();
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
