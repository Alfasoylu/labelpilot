import { Resend } from "resend";

import { getServerEnv, hasResendEnv } from "@/lib/env";

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
};

let resendClient: Resend | null | undefined;

export function getResendClient() {
  if (!hasResendEnv()) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(getServerEnv().RESEND_API_KEY!);
  }

  return resendClient;
}

export async function sendTransactionalEmail(input: SendEmailInput) {
  const client = getResendClient();
  const env = getServerEnv();

  if (!client || !env.EMAIL_FROM || !env.EMAIL_REPLY_TO) {
    return {
      ok: false as const,
      reason: "missing_email_env" as const,
    };
  }

  const result = await client.emails.send({
    from: env.EMAIL_FROM,
    replyTo: env.EMAIL_REPLY_TO,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });

  if (result.error) {
    return {
      ok: false as const,
      reason: "send_failed" as const,
      error: result.error.message,
    };
  }

  return {
    ok: true as const,
    id: result.data?.id ?? null,
  };
}
