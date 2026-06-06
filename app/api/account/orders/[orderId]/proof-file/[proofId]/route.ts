import { NextResponse } from "next/server";

import { getSupabaseUserFromRequest } from "@/lib/account/auth";
import { ensureCustomerForSupabaseUser } from "@/lib/account/customers";
import { getPrismaClient } from "@/lib/db/prisma";
import { getSignedUrl } from "@/lib/storage/artwork";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ orderId: string; proofId: string }> },
): Promise<Response> {
  const auth = await getSupabaseUserFromRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "Nicht verfügbar." }, { status: 503 });

  const { orderId, proofId } = await context.params;

  try {
    const customer = await ensureCustomerForSupabaseUser(prisma, auth.user);

    const proofFile = await prisma.proofFile.findFirst({
      where: {
        id: proofId,
        orderId,
        order: { customerId: customer.id },
      },
      select: { storagePath: true },
    });

    if (!proofFile) {
      return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
    }

    const signedUrl = await getSignedUrl(proofFile.storagePath, 900);
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error("Proof-Download fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Datei konnte nicht geladen werden." },
      { status: 500 },
    );
  }
}
