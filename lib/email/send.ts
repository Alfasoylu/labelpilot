import { getServerEnv, hasResendEnv } from "@/lib/env";

import { getResendClient } from "@/lib/email/client";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailInput): Promise<{ ok: boolean }> {
  if (!hasResendEnv()) {
    console.debug("E-Mail-Versand uebersprungen: E-Mail-Umgebung ist nicht konfiguriert.");
    return { ok: false };
  }

  const client = getResendClient();
  const env = getServerEnv();

  if (!client || !env.EMAIL_FROM || !env.EMAIL_REPLY_TO) {
    console.debug("E-Mail-Versand uebersprungen: Absenderdaten fehlen.");
    return { ok: false };
  }

  try {
    const result = await client.emails.send({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
      text,
      replyTo: env.EMAIL_REPLY_TO,
    });

    if (result.error) {
      console.error("E-Mail-Versand fehlgeschlagen:", result.error);
      return { ok: false };
    }

    return { ok: true };
  } catch (error) {
    console.error("E-Mail-Versand fehlgeschlagen:", error);
    return { ok: false };
  }
}
