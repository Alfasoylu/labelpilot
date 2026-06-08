import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseUserFromRequest } from "@/lib/account/auth";
import { ensureCustomerForSupabaseUser } from "@/lib/account/customers";
import { getPrismaClient } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/send";
import { getServerEnv } from "@/lib/env";
import { validateArtworkFile } from "@/lib/file-validation/artwork";
import { uploadSupportAttachment } from "@/lib/storage/artwork";

const MAX_ATTACHMENTS = 3;

type SupportAttachment = {
  path: string;
  name: string;
  size: number;
  type: string;
};

function publicAttachments(attachments: unknown): { name: string; size: number }[] {
  if (!Array.isArray(attachments)) return [];
  return attachments
    .filter((a): a is SupportAttachment => Boolean(a) && typeof a === "object" && "name" in a)
    .map((a) => ({ name: String(a.name), size: Number(a.size) || 0 }));
}

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
        attachments: true,
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
        attachments: publicAttachments(r.attachments),
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

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = createSchema.safeParse({
    type: form.get("type") ?? undefined,
    orderId: (form.get("orderId") as string) || undefined,
    subject: form.get("subject") ?? "",
    message: form.get("message") ?? "",
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Bitte füllen Sie alle Pflichtfelder aus." }, { status: 400 });
  }

  const d = parsed.data;

  // Validate optional attachments (designs/files) before creating the ticket.
  const rawFiles = form
    .getAll("attachment")
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, MAX_ATTACHMENTS);
  const validatedFiles: { file: File; sanitizedFileName: string }[] = [];
  for (const file of rawFiles) {
    const result = validateArtworkFile(file);
    if (!result.ok) {
      return NextResponse.json(
        { error: `Anhang „${file.name}“: ${result.message}` },
        { status: 400 },
      );
    }
    validatedFiles.push({ file, sanitizedFileName: result.sanitizedFileName });
  }

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

    // Upload attachments (best-effort) and persist their metadata on the ticket.
    let storedAttachments: SupportAttachment[] = [];
    if (validatedFiles.length > 0) {
      try {
        storedAttachments = await Promise.all(
          validatedFiles.map(async ({ file, sanitizedFileName }) => ({
            path: await uploadSupportAttachment(created.id, file, sanitizedFileName),
            name: file.name.slice(0, 200),
            size: file.size,
            type: file.type || "application/octet-stream",
          })),
        );
        await prisma.supportRequest.update({
          where: { id: created.id },
          data: { attachments: storedAttachments },
        });
      } catch (uploadError) {
        console.error("Support-Anhang-Upload fehlgeschlagen:", uploadError);
        storedAttachments = [];
      }
    }

    // Notify the operator (best-effort; failure must not block the request).
    const env = getServerEnv();
    const notifyTo = env.EMAIL_REPLY_TO ?? "info@labelpilot.de";
    const sender = customer.companyName ?? customer.contactName ?? customer.email;
    const orderNumber = created.order?.orderNumber ?? null;
    const orderLine = orderNumber ? `\nBestellung: ${orderNumber}` : "";
    const attachLine = storedAttachments.length > 0 ? `\nAnhänge: ${storedAttachments.length}` : "";
    const text = `Neue Support-Anfrage (${TYPE_LABELS[d.type]})\n\nVon: ${sender} <${customer.email}>${orderLine}${attachLine}\nBetreff: ${d.subject}\n\n${d.message}`;
    const html = [
      `<h2>Neue Support-Anfrage</h2>`,
      `<p><strong>Typ:</strong> ${TYPE_LABELS[d.type]}</p>`,
      `<p><strong>Von:</strong> ${escapeHtml(sender)} &lt;${escapeHtml(customer.email)}&gt;</p>`,
      orderNumber ? `<p><strong>Bestellung:</strong> ${escapeHtml(orderNumber)}</p>` : "",
      storedAttachments.length > 0
        ? `<p><strong>Anhänge:</strong> ${storedAttachments.map((a) => escapeHtml(a.name)).join(", ")}</p>`
        : "",
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
        attachments: storedAttachments.map((a) => ({ name: a.name, size: a.size })),
      },
    });
  } catch (error) {
    console.error("Support-POST fehlgeschlagen:", error);
    return NextResponse.json({ error: "Anfrage konnte nicht gesendet werden." }, { status: 500 });
  }
}
