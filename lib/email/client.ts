import { Resend } from "resend";

import { getServerEnv, hasResendEnv } from "@/lib/env";

export function getResendClient() {
  if (!hasResendEnv()) {
    console.debug("E-Mail-Versand uebersprungen: Resend ist nicht konfiguriert.");
    return null;
  }

  const apiKey = getServerEnv().RESEND_API_KEY;

  if (!apiKey) {
    console.debug("E-Mail-Versand uebersprungen: RESEND_API_KEY fehlt.");
    return null;
  }

  return new Resend(apiKey);
}
