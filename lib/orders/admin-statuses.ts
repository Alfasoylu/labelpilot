/**
 * Shared list of order statuses that admins are allowed to set directly.
 *
 * Explicitly excluded (intentional):
 *   - DRAFT              — internal pre-checkout state; not customer-visible
 *   - QUOTE_REQUESTED    — managed by the quote flow, not by manual admin status change
 *   - PAYMENT_FAILED     — set exclusively by the Stripe webhook; admins should not
 *                          manually trigger this state
 *
 * PENDING_PAYMENT is included so admins can revert an order back to the
 * awaiting-payment state when needed (e.g. after a manual payment arrangement).
 *
 * This constant is the single source of truth for both the single-order status
 * route and the bulk-status route so they stay in sync.
 */
export const VALID_ADMIN_STATUSES = [
  "PENDING_PAYMENT",
  "PAID",
  "FILE_REVIEW",
  "CORRECTION_REQUIRED",
  "ON_HOLD",
  "PROOF_REQUIRED",
  "WAITING_CUSTOMER_APPROVAL",
  "APPROVED_FOR_PRODUCTION",
  "IN_PRODUCTION",
  "READY_TO_SHIP",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "REFUND_REQUESTED",
  "REPRINT_REQUIRED",
] as const;

export type ValidAdminStatus = (typeof VALID_ADMIN_STATUSES)[number];
