import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const unauthorizedResponse = new NextResponse("Sie haben keinen Zugriff auf diesen Bereich.", {
  status: 401,
  headers: {
    "WWW-Authenticate": 'Basic realm="Labelpilot Admin"',
    "X-Robots-Tag": "noindex, nofollow",
  },
});

function constantTimeEqual(left: string, right: string) {
  const encoder = new TextEncoder();
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  const maxLength = Math.max(leftBytes.length, rightBytes.length);
  let diff = leftBytes.length ^ rightBytes.length;

  for (let index = 0; index < maxLength; index += 1) {
    diff |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }

  return diff === 0;
}

function getAdminCredentials() {
  const user = process.env.ADMIN_BASIC_USER?.trim();
  const password = process.env.ADMIN_BASIC_PASSWORD?.trim();

  if (!user || !password) {
    return null;
  }

  return { user, password };
}

function parseBasicAuthHeader(headerValue: string | null) {
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

export function middleware(request: NextRequest) {
  // Stopgap MVP gate. Replace with Supabase Auth server-side role checks later.
  const credentials = getAdminCredentials();

  if (!credentials) {
    return unauthorizedResponse;
  }

  const provided = parseBasicAuthHeader(request.headers.get("authorization"));

  if (
    !provided ||
    !constantTimeEqual(provided.user, credentials.user) ||
    !constantTimeEqual(provided.password, credentials.password)
  ) {
    return unauthorizedResponse;
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
