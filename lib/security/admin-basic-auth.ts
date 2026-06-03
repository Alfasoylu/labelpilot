import { getServerEnv } from "@/lib/env";

function parseBasicAuthHeader(headerValue: string | null) {
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

export function getAdminActorFromRequest(request: Request) {
  const provided = parseBasicAuthHeader(request.headers.get("authorization"));
  const env = getServerEnv();

  if (!provided) {
    return "admin";
  }

  if (env.ADMIN_BASIC_USER && provided.user === env.ADMIN_BASIC_USER) {
    return provided.user;
  }

  return "admin";
}
