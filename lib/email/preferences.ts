import type { PrismaClient } from "@prisma/client";

export type NotificationPrefKey = "proofReady" | "shipped" | "reorderReminder" | "quoteUpdates";

/**
 * Returns true unless the customer has EXPLICITLY disabled this notification category.
 * Missing prefs object or non-boolean value => send (safe default — existing customers
 * with no preferences keep receiving all mail).
 */
export function prefsAllow(prefs: unknown, key: NotificationPrefKey): boolean {
  if (!prefs || typeof prefs !== "object") return true;
  return (prefs as Record<string, unknown>)[key] === false ? false : true;
}

/**
 * Loads the order's customer notification preferences and reports whether the given
 * optional email category may be sent. Always sends when there is no linked customer.
 */
export async function customerAllowsEmail(
  prisma: PrismaClient,
  orderId: string,
  key: NotificationPrefKey,
): Promise<boolean> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { customer: { select: { notificationPrefs: true } } },
  });
  return prefsAllow(order?.customer?.notificationPrefs, key);
}
