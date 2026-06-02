"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type ProofFileItem = {
  id: string;
  fileName: string;
  sizeBytes: number;
  status: string;
  statusLabel: string;
  downloadHref: string;
  createdAtLabel: string;
  customerChangeRequestNote?: string | null;
};

type ProofApprovalPanelProps = {
  orderId: string;
  token: string;
  canRespond: boolean;
  requirementsText: string;
  initialProofs: ProofFileItem[];
};

type DecisionState =
  | { type: "idle"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function ProofApprovalPanel({
  orderId,
  token,
  canRespond,
  requirementsText,
  initialProofs,
}: ProofApprovalPanelProps) {
  const router = useRouter();
  const [proofs, setProofs] = useState(initialProofs);
  const [decisionState, setDecisionState] = useState<DecisionState>({
    type: "idle",
    message: "",
  });
  const [isPending, setIsPending] = useState(false);

  const activeProof = proofs.find(
    (proof) => proof.status === "WAITING_CUSTOMER_APPROVAL",
  );

  async function submitDecision(decision: "approve" | "request_changes", note = "") {
    if (!activeProof) {
      return;
    }

    setIsPending(true);
    setDecisionState({ type: "idle", message: "" });

    try {
      const response = await fetch(
        `/api/orders/${orderId}/proofs/${activeProof.id}/decision`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            decision,
            note,
          }),
        },
      );

      const payload = (await response.json()) as
        | {
            error?: string;
            message?: string;
            proofStatusLabel?: string;
          }
        | undefined;

      if (!response.ok || !payload?.message) {
        setDecisionState({
          type: "error",
          message:
            payload?.error ??
            "Rueckmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.",
        });
        return;
      }

      setProofs((current) =>
        current.map((proof) =>
          proof.id === activeProof.id
            ? {
                ...proof,
                status:
                  decision === "approve" ? "APPROVED" : "CHANGES_REQUESTED",
                statusLabel: payload.proofStatusLabel ?? proof.statusLabel,
                customerChangeRequestNote:
                  decision === "request_changes" ? note : proof.customerChangeRequestNote,
              }
            : proof,
        ),
      );
      setDecisionState({
        type: "success",
        message: payload.message,
      });
      router.refresh();
    } catch {
      setDecisionState({
        type: "error",
        message: "Rueckmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.",
      });
    } finally {
      setIsPending(false);
    }
  }

  async function onApprove() {
    await submitDecision("approve");
  }

  async function onRequestChanges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const noteInput = form.elements.namedItem("changeNote") as HTMLTextAreaElement | null;
    const note = noteInput?.value.trim() ?? "";

    if (!note) {
      setDecisionState({
        type: "error",
        message: "Bitte beschreiben Sie den Aenderungswunsch.",
      });
      return;
    }

    await submitDecision("request_changes", note);
    form.reset();
  }

  return (
    <article className="surface-card">
      <h2>Proof und Freigabe</h2>
      <p className="field-hint">{requirementsText}</p>

      {proofs.length === 0 ? (
        <p className="price-note">Noch kein Proof hochgeladen.</p>
      ) : (
        <div className="section-stack">
          {proofs.map((proof) => (
            <div key={proof.id} className="section-card">
              <h3>{proof.fileName}</h3>
              <p className="price-note">
                {proof.statusLabel} · {proof.createdAtLabel} · {formatFileSize(proof.sizeBytes)}
              </p>
              {proof.customerChangeRequestNote ? (
                <p className="field-hint">Aenderungswunsch: {proof.customerChangeRequestNote}</p>
              ) : null}
              <a href={proof.downloadHref} className="secondary-link">
                Proof herunterladen
              </a>
            </div>
          ))}
        </div>
      )}

      {canRespond && activeProof ? (
        <div className="section-stack">
          <div className="inline-actions">
            <button
              type="button"
              className="cta-button"
              disabled={isPending}
              onClick={onApprove}
            >
              {isPending ? "Antwort wird gesendet..." : "Proof freigeben"}
            </button>
          </div>

          <form className="quote-form" onSubmit={onRequestChanges}>
            <div className="form-grid">
              <div className="field-full">
                <label htmlFor="changeNote">Aenderungswunsch</label>
                <textarea
                  id="changeNote"
                  name="changeNote"
                  rows={4}
                  placeholder="Bitte beschreiben Sie die benoetigte Anpassung."
                  disabled={isPending}
                />
              </div>
            </div>
            <div className="inline-actions">
              <button type="submit" className="cta-button" disabled={isPending}>
                Aenderung anfragen
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {decisionState.message ? (
        <p className={`form-status ${decisionState.type === "error" ? "error" : "success"}`}>
          {decisionState.message}
        </p>
      ) : null}
    </article>
  );
}

function formatFileSize(sizeBytes: number) {
  if (sizeBytes >= 1024 * 1024) {
    return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(sizeBytes / 1024))} KB`;
}
