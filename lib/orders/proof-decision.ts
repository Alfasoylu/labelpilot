import {
  canRespondToProofOrderStatus,
  type OrderStatusValue,
} from "./status.ts";

export type ProofDecisionPayload = {
  token?: string;
  decision?: "approve" | "request_changes";
  note?: string;
};

export type ProofDecisionSnapshot = {
  orderExists: boolean;
  uploadToken: string | null;
  proofMatchesOrder: boolean;
  proofStatus: string | null;
  orderStatus: OrderStatusValue;
};

export type ProofDecisionValidationResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

export function validateProofDecisionRequest(
  payload: ProofDecisionPayload,
  snapshot?: ProofDecisionSnapshot,
): ProofDecisionValidationResult {
  if (!payload.token) {
    return {
      ok: false,
      status: 403,
      error: "Sie haben keinen Zugriff auf diese Bestellung.",
    };
  }

  if (payload.decision !== "approve" && payload.decision !== "request_changes") {
    return {
      ok: false,
      status: 400,
      error: "Ungültige Rückmeldung.",
    };
  }

  if (payload.decision === "request_changes" && !payload.note?.trim()) {
    return {
      ok: false,
      status: 400,
      error: "Bitte beschreiben Sie den Änderungswunsch.",
    };
  }

  if (!snapshot?.orderExists || payload.token !== snapshot.uploadToken || !snapshot.proofMatchesOrder) {
    return {
      ok: false,
      status: 403,
      error: "Sie haben keinen Zugriff auf diese Bestellung.",
    };
  }

  if (!canRespondToProofOrderStatus(snapshot.orderStatus)) {
    return {
      ok: false,
      status: 409,
      error: "Für diesen Proof ist derzeit keine Rückmeldung möglich.",
    };
  }

  if (snapshot.proofStatus !== "WAITING_CUSTOMER_APPROVAL") {
    return {
      ok: false,
      status: 409,
      error: "Für diesen Proof ist derzeit keine Rückmeldung möglich.",
    };
  }

  return { ok: true };
}
