import { timingSafeEqual } from "node:crypto";

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
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
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

export function middleware(request: NextRequest) {
  if (!isAdminPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const expectedUser = process.env.ADMIN_BASIC_USER?.trim();
  const expectedPassword = process.env.ADMIN_BASIC_PASSWORD?.trim();

  if (!expectedUser || !expectedPassword) {
    return unauthorizedResponse();
  }

  const provided = parseBasicAuth(request.headers.get("authorization"));

  // Use constant-time comparison to prevent timing side-channel attacks.
  // Pad both sides to the same byte length before comparing so that length
  // differences do not leak information via short-circuit behaviour.
  function safeEqual(a: string, b: string): boolean {
    const aBuf = Buffer.from(a, "utf8");
    const bBuf = Buffer.from(b, "utf8");
    const maxLen = Math.max(aBuf.length, bBuf.length);
    const aPadded = Buffer.concat([aBuf, Buffer.alloc(maxLen - aBuf.length)]);
    const bPadded = Buffer.concat([bBuf, Buffer.alloc(maxLen - bBuf.length)]);
    // timingSafeEqual requires same-length buffers and returns whether they match.
    // We still gate on length equality to avoid accepting a short prefix as valid.
    return aBuf.length === bBuf.length && timingSafeEqual(aPadded, bPadded);
  }

  if (
    !provided ||
    !safeEqual(provided.user, expectedUser) ||
    !safeEqual(provided.password, expectedPassword)
  ) {
    return unauthorizedResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
