import { NextResponse } from "next/server";
import { z } from "zod";

import { getPrismaClient } from "@/lib/db/prisma";
import { safeRedirect } from "@/lib/http/safe-redirect";
import { VALID_ADMIN_STATUSES } from "@/lib/orders/admin-statuses";

export const runtime = "nodejs";

const bodySchema = z.object({
  status: z.enum(VALID_ADMIN_STATUSES),
  note: z.string().trim().max(500).optional(),
  redirectTo: z.string().optional(),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
): Promise<Response> {
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "Nicht verfügbar." }, { status: 503 });

  const { orderId } = await context.params;

  const contentType = request.headers.get("content-type") ?? "";
  let rawData: Record<string, unknown>;

  if (contentType.includes("application/json")) {
    rawData = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  } else {
    const formData = await request.formData().catch(() => new FormData());
    rawData = Object.fromEntries(formData) as Record<string, unknown>;
  }

  const parsed = bodySchema.safeParse(rawData);
  if (!parsed.success) {
    const redirectTo = safeRedirect(
      typeof rawData.redirectTo === "string" ? rawData.redirectTo : undefined,
      "/admin/orders",
    );
    return NextResponse.redirect(
      new URL(`${redirectTo}?error=Ungültige+Eingabe`, request.url),
    );
  }

  const { status, note } = parsed.data;
  const redirectTo = safeRedirect(parsed.data.redirectTo, "/admin/orders");

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        statusEvents: {
          create: {
            status,
            note: note ?? `Status manuell gesetzt: ${status}`,
          },
        },
      },
    });

    if (request.headers.get("accept")?.includes("application/json")) {
      return NextResponse.json({ ok: true, newStatus: status });
    }

    return NextResponse.redirect(
      new URL(`${redirectTo}?message=Status+aktualisiert`, request.url),
    );
  } catch (error) {
    console.error("Admin-Status-Update fehlgeschlagen:", error);
    if (request.headers.get("accept")?.includes("application/json")) {
      return NextResponse.json({ error: "Update fehlgeschlagen." }, { status: 500 });
    }
    return NextResponse.redirect(
      new URL(`${redirectTo}?error=Update+fehlgeschlagen`, request.url),
    );
  }
}
