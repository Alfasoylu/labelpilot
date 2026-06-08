import {
  getArtworkStatusLabel,
  getOrderStatusLabel,
  getProofFileStatusLabel,
} from "@/lib/orders/artwork";

export type StatusTone =
  | "neutral"
  | "info"
  | "proof"
  | "success"
  | "warning"
  | "danger"
  | "accent";

export type StatusGroup =
  | "payment"
  | "review"
  | "proof"
  | "production"
  | "shipping"
  | "done"
  | "cancelled";

export interface StatusDescriptor {
  group: StatusGroup;
  tone: StatusTone;
  label: string;
}

const ORDER_TONE: Record<string, { group: StatusGroup; tone: StatusTone }> = {
  PENDING_PAYMENT: { group: "payment", tone: "warning" },
  PAYMENT_FAILED: { group: "payment", tone: "danger" },
  PAID: { group: "review", tone: "info" },
  FILE_REVIEW: { group: "review", tone: "info" },
  CORRECTION_REQUIRED: { group: "review", tone: "warning" },
  ON_HOLD: { group: "review", tone: "warning" },
  PROOF_REQUIRED: { group: "proof", tone: "proof" },
  WAITING_CUSTOMER_APPROVAL: { group: "proof", tone: "proof" },
  APPROVED_FOR_PRODUCTION: { group: "production", tone: "success" },
  IN_PRODUCTION: { group: "production", tone: "accent" },
  READY_TO_SHIP: { group: "shipping", tone: "accent" },
  SHIPPED: { group: "shipping", tone: "accent" },
  DELIVERED: { group: "done", tone: "success" },
  COMPLETED: { group: "done", tone: "success" },
  CANCELLED: { group: "cancelled", tone: "danger" },
};

export function describeOrderStatus(status: string): StatusDescriptor {
  const mapped = ORDER_TONE[status] ?? { group: "review" as StatusGroup, tone: "neutral" as StatusTone };
  return { ...mapped, label: getOrderStatusLabel(status) };
}

const ARTWORK_TONE: Record<string, StatusTone> = {
  AWAITING_ARTWORK: "warning",
  ARTWORK_UPLOADED: "info",
  ARTWORK_APPROVED: "success",
};

export function describeArtworkStatus(status: string | null): StatusDescriptor {
  const tone = (status && ARTWORK_TONE[status]) || "neutral";
  return {
    group: "review",
    tone,
    label: getArtworkStatusLabel(status as never),
  };
}

const PROOF_TONE: Record<string, StatusTone> = {
  NOT_REQUIRED: "neutral",
  PENDING_ADMIN_UPLOAD: "info",
  WAITING_CUSTOMER_APPROVAL: "proof",
  APPROVED: "success",
  CHANGES_REQUESTED: "warning",
  SUPERSEDED: "neutral",
};

export function describeProofStatus(status: string): StatusDescriptor {
  const tone = PROOF_TONE[status] ?? "neutral";
  return {
    group: "proof",
    tone,
    label: getProofFileStatusLabel(status as never),
  };
}

// ─── Order lifecycle timeline ────────────────────────────────────────────────

export type TimelineState = "done" | "current" | "upcoming" | "skipped" | "error";

export interface TimelineStep {
  key: string;
  label: string;
  state: TimelineState;
  hint?: string;
  tone?: StatusTone;
}

type StepDef = { key: string; label: string };

const TIMELINE_STEPS: StepDef[] = [
  { key: "ordered", label: "Bestellt" },
  { key: "filecheck", label: "Druckdaten-Prüfung" },
  { key: "approval", label: "Freigabe" },
  { key: "production", label: "Produktion" },
  { key: "shipping", label: "Versand" },
  { key: "delivered", label: "Zugestellt" },
];

// Maps each order status to the index (0–5) of the lifecycle step it represents.
const STATUS_INDEX: Record<string, number> = {
  PENDING_PAYMENT: 0,
  PAYMENT_FAILED: 0,
  PAID: 1,
  FILE_REVIEW: 1,
  CORRECTION_REQUIRED: 2,
  PROOF_REQUIRED: 2,
  WAITING_CUSTOMER_APPROVAL: 2,
  ON_HOLD: 1,
  APPROVED_FOR_PRODUCTION: 3,
  IN_PRODUCTION: 3,
  READY_TO_SHIP: 4,
  SHIPPED: 4,
  DELIVERED: 5,
  COMPLETED: 5,
};

export function buildOrderTimeline(input: { status: string }): TimelineStep[] {
  const { status } = input;
  const currentIndex = STATUS_INDEX[status] ?? 0;

  // Terminal failure states: mark reached steps done, the rest skipped, then a
  // terminal error step describing the failure.
  if (status === "CANCELLED" || status === "PAYMENT_FAILED") {
    const reachedTo = status === "PAYMENT_FAILED" ? -1 : currentIndex - 1;
    const steps: TimelineStep[] = TIMELINE_STEPS.map((step, i) => ({
      key: step.key,
      label: step.label,
      state: i <= reachedTo ? "done" : "skipped",
    }));
    steps.push({
      key: "abbruch",
      label: status === "PAYMENT_FAILED" ? "Zahlung fehlgeschlagen" : "Storniert",
      state: "error",
      tone: "danger",
    });
    return steps;
  }

  const isCorrectionLoop = status === "CORRECTION_REQUIRED";

  return TIMELINE_STEPS.map((step, i) => {
    if (isCorrectionLoop && i === 2) {
      return {
        key: step.key,
        label: step.label,
        state: "error" as TimelineState,
        tone: "warning" as StatusTone,
        hint: "Korrektur erforderlich",
      };
    }

    let state: TimelineState;
    if (i < currentIndex) state = "done";
    else if (i === currentIndex) state = "current";
    else state = "upcoming";

    const out: TimelineStep = { key: step.key, label: step.label, state };
    if (status === "ON_HOLD" && i === currentIndex) {
      out.hint = "Wartet auf Rückmeldung";
      out.tone = "warning";
    }
    return out;
  });
}
