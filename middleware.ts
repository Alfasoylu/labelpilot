import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_PATH_PREFIXES = ["/admin", "/api/admin"] as const;

function isAdminPath(pathname: string) {
  return ADMIN_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function unauthorizedResponse() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Labelpilot Admin"',
    },
  });
}

function parseBasicAuth(headerValue: string | null) {
  if (!headerValue?.startsWith("Basic ")) {
    return null;
  }

  try {
    const encoded = headerValue.slice("Basic ".length).trim();
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return null;
    }

    return {
      user: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

// Constant-time string comparison using the Web Crypto API (Edge Runtime safe).
// We HMAC-sign both values with a per-request random key and compare the MACs,
// which are fixed-length and ensure constant-time equality regardless of input length.
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
  // Both MACs are 32 bytes; compare byte-by-byte with a bitwise OR accumulator.
  const viewA = new Uint8Array(macA);
  const viewB = new Uint8Array(macB);
  let diff = 0;
  for (let i = 0; i < viewA.length; i++) {
    diff |= viewA[i] ^ viewB[i];
  }
  return diff === 0;
}

export async function middleware(request: NextRequest) {
  if (!isAdminPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const expectedUser = process.env.ADMIN_BASIC_USER?.trim();
  const expectedPassword = process.env.ADMIN_BASIC_PASSWORD?.trim();

  if (!expectedUser || !expectedPassword) {
    return unauthorizedResponse();
  }

  const provided = parseBasicAuth(request.headers.get("authorization"));

  if (!provided) {
    return unauthorizedResponse();
  }

  const [userOk, passOk] = await Promise.all([
    safeEqual(provided.user, expectedUser),
    safeEqual(provided.password, expectedPassword),
  ]);

  if (!userOk || !passOk) {
    return unauthorizedResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
