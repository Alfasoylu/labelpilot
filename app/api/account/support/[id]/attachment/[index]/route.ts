import { NextResponse } from "next/server";

import { getSupabaseUserFromRequest } from "@/lib/account/auth";
import { ensureCustomerForSupabaseUser } from "@/lib/account/customers";
import { getPrismaClient } from "@/lib/db/prisma";
import { getSignedUrl } from "@/lib/storage/artwork";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SupportAttachment = { path: string; name: string; size: number; type: string };

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string; index: string }> },
) {
  const auth = await getSupabaseUserFromRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "Nicht verfügbar." }, { status: 503 });

  const { id, index } = await context.params;
  const idx = Number.parseInt(index, 10);

  try {
    const customer = await ensureCustomerForSupabaseUser(prisma, auth.user);

    // Ownership: the support request must belong to the authenticated customer.
    const ticket = await prisma.supportRequest.findFirst({
      where: { id, customerId: customer.id },
      select: { attachments: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Anfrage wurde nicht gefunden." }, { status: 404 });
    }

    const attachments = Array.isArray(ticket.attachments)
      ? (ticket.attachments as unknown as SupportAttachment[])
      : [];
    const attachment = attachments[idx];

    if (!attachment?.path) {
      return NextResponse.json({ error: "Anhang wurde nicht gefunden." }, { status: 404 });
    }

    const url = await getSignedUrl(attachment.path, 60);

    const wantsJson = (request.headers.get("accept") ?? "").includes("application/json");
    if (wantsJson) {
      return NextResponse.json({ url });
    }
    return NextResponse.redirect(url, { status: 302 });
  } catch (error) {
    console.error("Support-Anhang-Download fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Anhang konnte nicht bereitgestellt werden." },
      { status: 500 },
    );
  }
}
