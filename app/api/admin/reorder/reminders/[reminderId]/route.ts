import { NextResponse } from "next/server";
import { z } from "zod";

import { getPrismaClient } from "@/lib/db/prisma";

export const runtime = "nodejs";

const bodySchema = z.object({
  status: z.enum(["PENDING", "SENT", "DISMISSED"]),
  redirectTo: z.string().optional(),
});

async function handleUpdate(
  request: Request,
  reminderId: string,
): Promise<Response> {
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

  const parsed = bodySchema.safeParse(rawData);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  const { status, redirectTo } = parsed.data;

  try {
    const updated = await prisma.reorderReminder.update({
      where: { id: reminderId },
      data: {
        status,
        ...(status === "SENT" ? { sentAt: new Date() } : {}),
      },
      select: { id: true, status: true },
    });

    if (redirectTo) {
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Reminder-Update fehlgeschlagen:", error);
    return NextResponse.json({ error: "Update fehlgeschlagen." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ reminderId: string }> },
): Promise<Response> {
  const { reminderId } = await context.params;
  return handleUpdate(request, reminderId);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ reminderId: string }> },
): Promise<Response> {
  const { reminderId } = await context.params;
  return handleUpdate(request, reminderId);
}
