"use client";

import { useState, useTransition } from "react";

type Props = {
  orderId: string;
  proofFileId: string;
  accessToken: string;
  onSuccess: () => void;
};

export function ProofApprovalForm({ orderId, proofFileId, accessToken, onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"idle" | "approve_confirm" | "changes_form">("idle");
  const [note, setNote] = useState("");
  const [done, setDone] = useState<"approved" | "changes" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function submit(action: "APPROVE" | "REQUEST_CHANGES") {
    setErrorMsg("");
    const res = await fetch(`/api/account/orders/${orderId}/proof-response`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ proofFileId, action, note: note || undefined }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok || !data.ok) {
      setErrorMsg(data.error ?? "Anfrage fehlgeschlagen.");
      return;
    }
    setDone(action === "APPROVE" ? "approved" : "changes");
    onSuccess();
  }

  if (done === "approved") {
    return (
      <p className="form-status success">
        Druckfreigabe erteilt – Ihre Bestellung wird in Produktion gegeben.
      </p>
    );
  }

  if (done === "changes") {
    return (
      <p className="form-status success">
        Änderungswunsch übermittelt – wir melden uns mit einem neuen Proof.
      </p>
    );
  }

  return (
    <div className="section-stack">
      {errorMsg ? <p className="form-status error" role="alert">{errorMsg}</p> : null}

      {mode === "idle" && (
        <div className="inline-actions">
          <button
            type="button"
            className="cta-button"
            disabled={isPending}
            onClick={() => setMode("approve_confirm")}
          >
            Druckfreigabe erteilen
          </button>
          <button
            type="button"
            className="secondary-link"
            disabled={isPending}
            onClick={() => setMode("changes_form")}
          >
            Änderungen anfragen
          </button>
        </div>
      )}

      {mode === "approve_confirm" && (
        <div className="section-stack">
          <p className="field-hint">
            Mit der Freigabe bestätigen Sie, dass der Korrekturabzug korrekt ist und zur
            Produktion freigegeben werden kann. Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
          <div className="inline-actions">
            <button
              type="button"
              className="cta-button"
              disabled={isPending}
              onClick={() => startTransition(() => submit("APPROVE"))}
            >
              {isPending ? "Wird gesendet ..." : "Ja, Druckfreigabe erteilen"}
            </button>
            <button
              type="button"
              className="secondary-link"
              disabled={isPending}
              onClick={() => setMode("idle")}
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {mode === "changes_form" && (
        <div className="section-stack">
          <label htmlFor="proof-note">Was soll geändert werden?</label>
          <textarea
            id="proof-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Bitte beschreiben Sie die gewünschten Änderungen ..."
          />
          <div className="inline-actions">
            <button
              type="button"
              className="cta-button"
              disabled={isPending}
              onClick={() => startTransition(() => submit("REQUEST_CHANGES"))}
            >
              {isPending ? "Wird gesendet ..." : "Änderungswunsch senden"}
            </button>
            <button
              type="button"
              className="secondary-link"
              disabled={isPending}
              onClick={() => setMode("idle")}
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
