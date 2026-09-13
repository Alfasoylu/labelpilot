import { NextResponse } from "next/server";
import { z } from "zod";

import { deliverOperatorReply } from "@/lib/chat/deliver-operator-reply";
import { verifyAdminRequest } from "@/lib/security/admin-request-auth";

const replySchema = z.object({
  reply: z.string().trim().min(1).max(4000),
});

function redirectBack(
  request: Request,
  sessionId: string,
  search: Record<string, string>,
) {
  const url = new URL(`/admin/chat/${sessionId}`, request.url);
  for (const [key, value] of Object.entries(search)) {
    url.searchParams.set(key, value);
  }
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await context.params;

  // Die Middleware deckt /api/admin/* bereits ab; diese Prüfung ist die zweite
  // Schicht, damit eine spätere Routing-Änderung den Versand nicht freilegt.
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const formData = await request.formData();
  const parsed = replySchema.safeParse({ reply: formData.get("reply") });

  if (!parsed.success) {
    return redirectBack(request, sessionId, {
      error: "Bitte geben Sie eine Antwort ein.",
    });
  }

  const result = await deliverOperatorReply({
    sessionId,
    reply: parsed.data.reply,
  });

  if (!result.ok) {
    return redirectBack(request, sessionId, {
      error: `Antwort konnte nicht gespeichert werden: ${result.error}`,
    });
  }

  if (result.emailed) {
    return redirectBack(request, sessionId, {
      status: "Antwort gespeichert und per E-Mail zugestellt.",
    });
  }

  return redirectBack(request, sessionId, {
    status:
      result.reason === "no-contact-email"
        ? "Antwort steht im Chat. Ohne Kontaktadresse sieht der Besucher sie nur bei geöffneter Seite."
        : "Antwort steht im Chat, der E-Mail-Versand ist jedoch fehlgeschlagen.",
  });
}
