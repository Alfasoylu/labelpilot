import { NextResponse } from "next/server";

import { getPrismaClient } from "@/lib/db/prisma";
import { prefsAllow } from "@/lib/email/preferences";
import { sendEmail } from "@/lib/email/send";
import { reorderReminder } from "@/lib/email/templates/lifecycle";
import { getServerEnv, isReorderReminderEnabled } from "@/lib/env";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
  const env = getServerEnv();
  const authHeader = request.headers.get("authorization");

  if (!env.APP_SECRET || authHeader !== `Bearer ${env.APP_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isReorderReminderEnabled()) {
    return NextResponse.json({ skipped: true, reason: "feature_disabled" });
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const now = new Date();

  const reminders = await prisma.reorderReminder.findMany({
    where: {
      status: "DRAFT",
      isEnabled: true,
      scheduledFor: { lte: now },
    },
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          customerEmail: true,
          companyName: true,
          quantity: true,
          material: true,
          customer: { select: { notificationPrefs: true } },
        },
      },
    },
    take: 50,
  });

  let sent = 0;
  let failed = 0;

  let skipped = 0;

  for (const reminder of reminders) {
    const { order } = reminder;

    if (!order.customerEmail) {
      await prisma.reorderReminder.update({
        where: { id: reminder.id },
        data: { status: "FAILED", sentAt: now },
      });
      failed++;
      continue;
    }

    // Respect the customer's notification preference for reorder reminders.
    if (!prefsAllow(order.customer?.notificationPrefs, "reorderReminder")) {
      await prisma.reorderReminder.update({
        where: { id: reminder.id },
        data: { status: "DISMISSED", sentAt: now },
      });
      skipped++;
      continue;
    }

    const clickToken = reminder.clickToken ?? reminder.id;
    const template = reorderReminder({
      orderId: order.id,
      orderNumber: order.orderNumber,
      companyName: order.companyName,
      quantity: order.quantity,
      material: order.material,
      clickToken,
    });

    const result = await sendEmail({
      to: order.customerEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    await prisma.reorderReminder.update({
      where: { id: reminder.id },
      data: {
        status: result.ok ? "SENT" : "FAILED",
        sentAt: now,
      },
    });

    if (result.ok) sent++;
    else failed++;
  }

  return NextResponse.json({ processed: reminders.length, sent, failed, skipped });
}
