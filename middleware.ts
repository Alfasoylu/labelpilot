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

  if (
    !provided ||
    provided.user !== expectedUser ||
    provided.password !== expectedPassword
  ) {
    return unauthorizedResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
