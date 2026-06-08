import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseUserFromRequest } from "@/lib/account/auth";
import { ensureCustomerForSupabaseUser } from "@/lib/account/customers";
import { getPrismaClient } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/send";
import { getServerEnv } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPPORT_TYPES = ["GENERAL", "REPRINT", "BILLING", "DELIVERY"] as const;

const createSchema = z.object({
  type: z.enum(SUPPORT_TYPES).default("GENERAL"),
  orderId: z.string().trim().min(1).max(40).optional(),
  subject: z.string().trim().min(3).max(160),
  message: z.string().trim().min(5).max(2000),
});

const TYPE_LABELS: Record<(typeof SUPPORT_TYPES)[number], string> = {
  GENERAL: "Allgemeine Anfrage",
  REPRINT: "Nachdruck / Reklamation",
  BILLING: "Rechnung & Zahlung",
  DELIVERY: "Lieferung & Versand",
};

// Customer-supplied strings are escaped before being placed into the operator email HTML.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function GET(request: Request) {
  const auth = await getSupabaseUserFromRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "Nicht verfügbar." }, { status: 503 });

  try {
    const customer = await ensureCustomerForSupabaseUser(prisma, auth.user);
    const requests = await prisma.supportRequest.findMany({
      where: { customerId: customer.id },
      select: {
        id: true,
        type: true,
        subject: true,
        message: true,
        status: true,
        createdAt: true,
        order: { select: { orderNumber: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      requests: requests.map((r) => ({
        id: r.id,
        type: r.type,
        subject: r.subject,
        message: r.message,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
        orderNumber: r.order?.orderNumber ?? null,
      })),
    });
  } catch (error) {
    console.error("Support-GET fehlgeschlagen:", error);
    return NextResponse.json({ error: "Anfragen konnten nicht geladen werden." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await getSupabaseUserFromRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "Nicht verfügbar." }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Bitte füllen Sie alle Pflichtfelder aus." }, { status: 400 });
  }

  const d = parsed.data;

  try {
    const customer = await ensureCustomerForSupabaseUser(prisma, auth.user);

    // If an order is referenced, verify it belongs to this customer.
    let orderId: string | null = null;
    if (d.orderId) {
      const order = await prisma.order.findFirst({
        where: { id: d.orderId, customerId: customer.id },
        select: { id: true },
      });
      if (!order) {
        return NextResponse.json({ error: "Bestellung wurde nicht gefunden." }, { status: 404 });
      }
      orderId = order.id;
    }

    const created = await prisma.supportRequest.create({
      data: {
        customerId: customer.id,
        orderId,
        type: d.type,
        subject: d.subject,
        message: d.message,
      },
      select: {
        id: true,
        type: true,
        subject: true,
        message: true,
        status: true,
        createdAt: true,
        order: { select: { orderNumber: true } },
      },
    });

    // Notify the operator (best-effort; failure must not block the request).
    const env = getServerEnv();
    const notifyTo = env.EMAIL_REPLY_TO ?? "info@labelpilot.de";
    const sender = customer.companyName ?? customer.contactName ?? customer.email;
    const orderNumber = created.order?.orderNumber ?? null;
    const orderLine = orderNumber ? `\nBestellung: ${orderNumber}` : "";
    const text = `Neue Support-Anfrage (${TYPE_LABELS[d.type]})\n\nVon: ${sender} <${customer.email}>${orderLine}\nBetreff: ${d.subject}\n\n${d.message}`;
    const html = [
      `<h2>Neue Support-Anfrage</h2>`,
      `<p><strong>Typ:</strong> ${TYPE_LABELS[d.type]}</p>`,
      `<p><strong>Von:</strong> ${escapeHtml(sender)} &lt;${escapeHtml(customer.email)}&gt;</p>`,
      orderNumber ? `<p><strong>Bestellung:</strong> ${escapeHtml(orderNumber)}</p>` : "",
      `<p><strong>Betreff:</strong> ${escapeHtml(d.subject)}</p>`,
      `<p>${escapeHtml(d.message).replace(/\n/g, "<br>")}</p>`,
    ].join("");
    void sendEmail({
      to: notifyTo,
      subject: `Support-Anfrage: ${d.subject}`,
      html,
      text,
    }).catch((e) => console.error("Support-Mail fehlgeschlagen:", e));

    return NextResponse.json({
      request: {
        id: created.id,
        type: created.type,
        subject: created.subject,
        message: created.message,
        status: created.status,
        createdAt: created.createdAt.toISOString(),
        orderNumber: created.order?.orderNumber ?? null,
      },
    });
  } catch (error) {
    console.error("Support-POST fehlgeschlagen:", error);
    return NextResponse.json({ error: "Anfrage konnte nicht gesendet werden." }, { status: 500 });
  }
}
