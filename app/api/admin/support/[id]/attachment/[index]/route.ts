import { NextResponse } from "next/server";

import { getPrismaClient } from "@/lib/db/prisma";
import { getSignedUrl } from "@/lib/storage/artwork";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SupportAttachment = { path: string; name: string; size: number; type: string };

// Access is gated by the /api/admin middleware (cookie / basic auth).
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string; index: string }> },
) {
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "Nicht verfügbar." }, { status: 503 });

  const { id, index } = await context.params;
  const idx = Number.parseInt(index, 10);

  try {
    const ticket = await prisma.supportRequest.findUnique({
      where: { id },
      select: { attachments: true },
    });

    const attachments = Array.isArray(ticket?.attachments)
      ? (ticket!.attachments as unknown as SupportAttachment[])
      : [];
    const attachment = attachments[idx];

    if (!attachment?.path) {
      return NextResponse.json({ error: "Anhang wurde nicht gefunden." }, { status: 404 });
    }

    const url = await getSignedUrl(attachment.path, 300);
    return NextResponse.redirect(url, { status: 302 });
  } catch (error) {
    console.error("Admin-Support-Anhang-Download fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Anhang konnte nicht bereitgestellt werden." },
      { status: 500 },
    );
  }
}
