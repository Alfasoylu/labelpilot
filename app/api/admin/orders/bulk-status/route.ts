import { NextResponse } from "next/server";
import { z } from "zod";

import { getPrismaClient } from "@/lib/db/prisma";
import { VALID_ADMIN_STATUSES } from "@/lib/orders/admin-statuses";

export const runtime = "nodejs";

const bodySchema = z.object({
  orderIds: z.array(z.string().cuid()).min(1).max(100),
  status: z.enum(VALID_ADMIN_STATUSES),
  note: z.string().trim().max(200).optional(),
});

export async function POST(request: Request): Promise<Response> {
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "Nicht verfügbar." }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  const { orderIds, status, note } = parsed.data;

  try {
    await prisma.$transaction(
      orderIds.map((id) =>
        prisma.order.update({
          where: { id },
          data: {
            status,
            statusEvents: {
              create: {
                status,
                note: note ?? `Bulk-Update: Status auf ${status} gesetzt.`,
              },
            },
          },
        }),
      ),
    );

    return NextResponse.json({ ok: true, updated: orderIds.length });
  } catch (error) {
    console.error("Bulk-Status-Update fehlgeschlagen:", error);
    return NextResponse.json({ error: "Update fehlgeschlagen." }, { status: 500 });
  }
}
