import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseUserFromRequest } from "@/lib/account/auth";
import { ensureCustomerForSupabaseUser } from "@/lib/account/customers";
import { getPrismaClient } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/send";
import { proofDecisionOpsNotification } from "@/lib/email/templates/lifecycle";
import { canRespondToProofOrderStatus } from "@/lib/orders/status";
import { getServerEnv } from "@/lib/env";

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
      select: { id: true, status: true, orderNumber: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Bestellung nicht gefunden." }, { status: 404 });
    }

    // BUG-001: Guard against state machine bypass — order must also be in the correct status.
    if (!canRespondToProofOrderStatus(order.status)) {
      return NextResponse.json(
        { error: "Für diesen Proof ist derzeit keine Rückmeldung möglich." },
        { status: 409 },
      );
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

    let newStatus: string;

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

      newStatus = "APPROVED_FOR_PRODUCTION";
    } else {
      // BUG-002: Align with token-based flow — use FILE_REVIEW (admin reviews before uploading next proof).
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
            status: "FILE_REVIEW",
            statusEvents: {
              create: {
                status: "FILE_REVIEW",
                note: `Änderungswunsch vom Kunden: ${note ?? "keine Angabe"}`,
              },
            },
          },
        }),
      ]);

      newStatus = "FILE_REVIEW";
    }

    // BUG-003: Notify admin of proof decision via ops notification email.
    const adminNotifyEmail = getServerEnv().ADMIN_NOTIFY_EMAIL;
    if (adminNotifyEmail) {
      const decisionLabel = action === "APPROVE" ? "Freigabe" : "Änderungswunsch";
      const template = proofDecisionOpsNotification({
        orderNumber: order.orderNumber,
        orderId: order.id,
        decision: decisionLabel,
      });

      try {
        await sendEmail({
          to: adminNotifyEmail,
          subject: template.subject,
          html: template.html,
          text: template.text,
        });
      } catch (error) {
        console.error("Ops-Benachrichtigung nach Proof-Entscheidung fehlgeschlagen:", error);
      }
    }

    return NextResponse.json({ ok: true, newStatus });
  } catch (error) {
    console.error("Proof-Response fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Anfrage konnte nicht verarbeitet werden." },
      { status: 500 },
    );
  }
}
