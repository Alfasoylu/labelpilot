export type OrderStatusValue =
  | "DRAFT"
  | "QUOTE_REQUESTED"
  | "PENDING_PAYMENT"
  | "PAID"
  | "PAYMENT_FAILED"
  | "FILE_REVIEW"
  | "CORRECTION_REQUIRED"
  | "ON_HOLD"
  | "PROOF_REQUIRED"
  | "WAITING_CUSTOMER_APPROVAL"
  | "APPROVED_FOR_PRODUCTION"
  | "IN_PRODUCTION"
  | "READY_TO_SHIP"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUND_REQUESTED"
  | "REPRINT_REQUIRED";

const MAIN_TRANSITIONS: Record<OrderStatusValue, readonly OrderStatusValue[]> = {
  DRAFT: ["PENDING_PAYMENT"],
  QUOTE_REQUESTED: [],
  PENDING_PAYMENT: ["PAID"],
  PAID: ["FILE_REVIEW"],
  PAYMENT_FAILED: [],
  FILE_REVIEW: ["PROOF_REQUIRED", "APPROVED_FOR_PRODUCTION"],
  CORRECTION_REQUIRED: [],
  ON_HOLD: [],
  PROOF_REQUIRED: ["WAITING_CUSTOMER_APPROVAL"],
  WAITING_CUSTOMER_APPROVAL: ["APPROVED_FOR_PRODUCTION"],
  APPROVED_FOR_PRODUCTION: ["IN_PRODUCTION"],
  IN_PRODUCTION: ["READY_TO_SHIP"],
  READY_TO_SHIP: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
  REFUND_REQUESTED: [],
  REPRINT_REQUIRED: ["IN_PRODUCTION", "COMPLETED"],
};

const EXCEPTION_TRANSITIONS: Record<OrderStatusValue, readonly OrderStatusValue[]> = {
  DRAFT: [],
  QUOTE_REQUESTED: [],
  PENDING_PAYMENT: ["CANCELLED", "PAYMENT_FAILED"],
  PAID: ["CANCELLED", "REFUND_REQUESTED", "CORRECTION_REQUIRED", "PROOF_REQUIRED"],
  PAYMENT_FAILED: ["PENDING_PAYMENT", "CANCELLED"],
  FILE_REVIEW: ["REFUND_REQUESTED", "CORRECTION_REQUIRED", "WAITING_CUSTOMER_APPROVAL"],
  CORRECTION_REQUIRED: ["FILE_REVIEW", "PROOF_REQUIRED", "WAITING_CUSTOMER_APPROVAL", "ON_HOLD"],
  ON_HOLD: ["FILE_REVIEW", "CORRECTION_REQUIRED"],
  PROOF_REQUIRED: ["FILE_REVIEW", "WAITING_CUSTOMER_APPROVAL", "CORRECTION_REQUIRED"],
  WAITING_CUSTOMER_APPROVAL: ["CANCELLED", "FILE_REVIEW"],
  APPROVED_FOR_PRODUCTION: [],
  IN_PRODUCTION: ["REPRINT_REQUIRED"],
  READY_TO_SHIP: [],
  SHIPPED: ["REPRINT_REQUIRED"],
  DELIVERED: ["REPRINT_REQUIRED"],
  COMPLETED: [],
  CANCELLED: [],
  REFUND_REQUESTED: [],
  REPRINT_REQUIRED: [],
};

export function canTransitionOrderStatus(
  from: OrderStatusValue,
  to: OrderStatusValue,
) {
  if (from === to) {
    return true;
  }

  return (
    MAIN_TRANSITIONS[from].includes(to) ||
    EXCEPTION_TRANSITIONS[from].includes(to)
  );
}

export function canReviewArtworkOrderStatus(status: OrderStatusValue) {
  return ["PAID", "FILE_REVIEW", "CORRECTION_REQUIRED", "PROOF_REQUIRED"].includes(
    status,
  );
}

export function canUploadProofForOrderStatus(status: OrderStatusValue) {
  return ["FILE_REVIEW", "PROOF_REQUIRED", "CORRECTION_REQUIRED"].includes(status);
}

export function canRespondToProofOrderStatus(status: OrderStatusValue) {
  return status === "WAITING_CUSTOMER_APPROVAL";
}

export function canApplyStripePaymentSuccess(status: OrderStatusValue) {
  return ["PENDING_PAYMENT", "PAYMENT_FAILED"].includes(status);
}

export function canApplyStripePaymentFailure(status: OrderStatusValue) {
  return ["PENDING_PAYMENT", "PAYMENT_FAILED"].includes(status);
}
