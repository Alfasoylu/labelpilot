import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseUserFromRequest } from "@/lib/account/auth";
import { ensureCustomerForSupabaseUser } from "@/lib/account/customers";
import { getPrismaClient } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const patchSchema = z.object({
  isEnabled: z.boolean(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await getSupabaseUserFromRequest(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const prisma = getPrismaClient();

  if (!prisma) {
    return NextResponse.json(
      { error: "Kundenkonto ist derzeit nicht verfügbar." },
      { status: 503 },
    );
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  try {
    const customer = await ensureCustomerForSupabaseUser(prisma, auth.user);

    // Ownership: prediction -> order -> customerId must match the authenticated customer.
    const prediction = await prisma.refillPrediction.findFirst({
      where: { id, order: { customerId: customer.id } },
      select: { id: true },
    });

    if (!prediction) {
      return NextResponse.json(
        { error: "Erinnerung wurde nicht gefunden." },
        { status: 404 },
      );
    }

    const updated = await prisma.refillPrediction.update({
      where: { id: prediction.id },
      data: { isEnabled: parsed.data.isEnabled },
      select: { id: true, isEnabled: true },
    });

    return NextResponse.json({ id: updated.id, isEnabled: updated.isEnabled });
  } catch (error) {
    console.error("Refill-Prediction-Update fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Erinnerung konnte nicht aktualisiert werden." },
      { status: 500 },
    );
  }
}
