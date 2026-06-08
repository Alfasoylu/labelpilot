import { NextResponse } from "next/server";

import { getSupabaseUserFromRequest } from "@/lib/account/auth";
import { ensureCustomerForSupabaseUser } from "@/lib/account/customers";
import { getPrismaClient } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
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

  const url = new URL(request.url);
  const designId = url.searchParams.get("designId");

  try {
    const customer = await ensureCustomerForSupabaseUser(prisma, auth.user);

    const predictions = await prisma.refillPrediction.findMany({
      where: {
        order: { customerId: customer.id },
        ...(designId ? { sourceDesignId: designId } : {}),
      },
      select: {
        id: true,
        sourceDesignId: true,
        predictedDepletionAt: true,
        reminderWindowDays: true,
        isEnabled: true,
        order: { select: { orderNumber: true } },
      },
      orderBy: { predictedDepletionAt: "asc" },
    });

    return NextResponse.json({
      predictions: predictions.map((p) => ({
        id: p.id,
        sourceDesignId: p.sourceDesignId,
        predictedDepletionAt: p.predictedDepletionAt.toISOString(),
        reminderWindowDays: p.reminderWindowDays,
        isEnabled: p.isEnabled,
        orderNumber: p.order.orderNumber,
      })),
    });
  } catch (error) {
    console.error("Refill-Prediction-API fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Erinnerungen konnten nicht geladen werden." },
      { status: 500 },
    );
  }
}
