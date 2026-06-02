import { getServerEnv } from "@/lib/env";

function getOperatorSecret() {
  const secret = getServerEnv().APP_SECRET;

  if (!secret) {
    throw new Error("APP_SECRET fehlt.");
  }

  return secret;
}

export function isOperatorRequestAuthorized(request: Request) {
  const expected = getOperatorSecret();
  const headerSecret =
    request.headers.get("x-labelpilot-app-secret") ??
    request.headers.get("x-internal-secret");
  const authHeader = request.headers.get("authorization");
  const bearerSecret = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : null;

  return headerSecret === expected || bearerSecret === expected;
}
