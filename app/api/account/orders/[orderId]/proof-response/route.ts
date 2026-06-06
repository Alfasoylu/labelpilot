import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseUserFromRequest } from "@/lib/account/auth";
import { ensureCustomerForSupabaseUser } from "@/lib/account/customers";
import { getPrismaClient } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  proofFileId: z.string().cuid(),
  action: z.enum(["APPROVE", "REQUEST_CHANGES"]),
  note: z.string().trim().max(1000).optional(),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
): Promise<Response> {
  const auth = await getSupabaseUserFromRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "Nicht verfügbar." }, { status: 503 });

  const { orderId } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });

  const { proofFileId, action, note } = parsed.data;

  try {
    const customer = await ensureCustomerForSupabaseUser(prisma, auth.user);

    const order = await prisma.order.findFirst({
      where: { id: orderId, customerId: customer.id },
      select: { id: true, status: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Bestellung nicht gefunden." }, { status: 404 });
    }

    const proofFile = await prisma.proofFile.findFirst({
      where: { id: proofFileId, orderId },
      select: { id: true, status: true },
    });

    if (!proofFile || proofFile.status !== "WAITING_CUSTOMER_APPROVAL") {
      return NextResponse.json(
        { error: "Dieser Proof ist nicht mehr zur Freigabe verfügbar." },
        { status: 409 },
      );
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";

    if (action === "APPROVE") {
      await prisma.$transaction([
        prisma.proofFile.update({
          where: { id: proofFileId },
          data: {
            status: "APPROVED",
            customerApprovedAt: new Date(),
            customerApprovalIp: ip,
          },
        }),
        prisma.order.update({
          where: { id: orderId },
          data: {
            status: "APPROVED_FOR_PRODUCTION",
            statusEvents: {
              create: {
                status: "APPROVED_FOR_PRODUCTION",
                note: "Druckfreigabe durch Kunden erteilt.",
              },
            },
          },
        }),
      ]);

      return NextResponse.json({ ok: true, newStatus: "APPROVED_FOR_PRODUCTION" });
    }

    await prisma.$transaction([
      prisma.proofFile.update({
        where: { id: proofFileId },
        data: {
          status: "CHANGES_REQUESTED",
          customerChangeRequestNote: note ?? "",
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PROOF_REQUIRED",
          statusEvents: {
            create: {
              status: "PROOF_REQUIRED",
              note: `Änderungswunsch vom Kunden: ${note ?? "keine Angabe"}`,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({ ok: true, newStatus: "PROOF_REQUIRED" });
  } catch (error) {
    console.error("Proof-Response fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Anfrage konnte nicht verarbeitet werden." },
      { status: 500 },
    );
  }
}
