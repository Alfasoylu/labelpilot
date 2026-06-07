import { NextResponse } from "next/server";
import { z } from "zod";

import { getPrismaClient } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createSchema = z.object({
  orderId: z.string().cuid(),
  scheduledFor: z.string().min(1),
  refillPredictionId: z.string().cuid().optional().or(z.literal("")),
  channel: z.enum(["EMAIL", "MANUAL"]).default("EMAIL"),
  note: z.string().trim().max(500).optional().or(z.literal("")),
  redirectTo: z.string().optional(),
});

export async function GET(): Promise<Response> {
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "Nicht verfügbar." }, { status: 503 });

  try {
    const reminders = await prisma.reorderReminder.findMany({
      where: { status: { in: ["DRAFT", "PENDING", "SENT"] } },
      include: {
        order: {
          select: {
            orderNumber: true,
            customerEmail: true,
            quantity: true,
            material: true,
            customer: {
              select: { companyName: true },
            },
          },
        },
      },
      orderBy: { scheduledFor: "asc" },
      take: 100,
    });

    return NextResponse.json(reminders);
  } catch (error) {
    console.error("Reminder-GET fehlgeschlagen:", error);
    return NextResponse.json({ error: "Daten konnten nicht geladen werden." }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<Response> {
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "Nicht verfügbar." }, { status: 503 });

  const contentType = request.headers.get("content-type") ?? "";
  let rawData: unknown;

  if (contentType.includes("application/json")) {
    rawData = await request.json().catch(() => ({}));
  } else {
    const formData = await request.formData().catch(() => new FormData());
    rawData = Object.fromEntries(formData);
  }

  const parsed = createSchema.safeParse(rawData);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  const { orderId, scheduledFor, refillPredictionId, channel, redirectTo } = parsed.data;

  try {
    const reminder = await prisma.reorderReminder.create({
      data: {
        orderId,
        scheduledFor: new Date(scheduledFor),
        refillPredictionId: refillPredictionId || undefined,
        channel,
        status: "PENDING",
        isEnabled: true,
      },
      select: { id: true, orderId: true, scheduledFor: true, channel: true, status: true },
    });

    if (redirectTo) {
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    return NextResponse.json(reminder, { status: 201 });
  } catch (error) {
    console.error("Reminder-POST fehlgeschlagen:", error);
    return NextResponse.json({ error: "Erinnerung konnte nicht erstellt werden." }, { status: 500 });
  }
}
