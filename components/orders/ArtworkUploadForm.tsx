"use client";

import { useState, type FormEvent } from "react";

type ArtworkFileItem = {
  id: string;
  fileName: string;
  sizeBytes: number;
  statusLabel: string;
  downloadHref: string;
  createdAtLabel: string;
};

type ArtworkUploadFormProps = {
  orderId: string;
  token: string;
  canUpload: boolean;
  requirementsText: string;
  initialFiles: ArtworkFileItem[];
};

type UploadState =
  | { type: "idle"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function ArtworkUploadForm({
  orderId,
  token,
  canUpload,
  requirementsText,
  initialFiles,
}: ArtworkUploadFormProps) {
  const [files, setFiles] = useState(initialFiles);
  const [uploadState, setUploadState] = useState<UploadState>({
    type: "idle",
    message: "",
  });
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (!file) {
      setUploadState({
        type: "error",
        message: "Bitte laden Sie eine Druckdatei hoch oder senden Sie diese später.",
      });
      return;
    }

    setIsPending(true);
    setUploadState({ type: "idle", message: "" });

    const formData = new FormData();
    formData.set("token", token);
    formData.set("file", file);

    try {
      const response = await fetch(`/api/orders/${orderId}/artwork`, {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as
        | {
            error?: string;
            file?: ArtworkFileItem;
            message?: string;
          }
        | undefined;

      if (!response.ok || !payload?.file) {
        setUploadState({
          type: "error",
          message:
            payload?.error ??
            "Upload fehlgeschlagen. Bitte versuchen Sie es erneut.",
        });
        return;
      }

      setFiles((current) => [payload.file!, ...current]);
      setUploadState({
        type: "success",
        message:
          payload.message ?? "Datei erfolgreich hochgeladen. Die Datei wird geprüft.",
      });
      form.reset();
    } catch {
      setUploadState({
        type: "error",
        message: "Upload fehlgeschlagen. Bitte versuchen Sie es erneut.",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="section-stack">
      <form className="quote-form" onSubmit={onSubmit}>
        <div>
          <h2>Druckdaten hochladen</h2>
          <p className="field-hint">
            Laden Sie Ihre Druckdatei hoch. Bevor wir produzieren, prüfen wir die Datei
            technisch und melden uns, falls etwas fehlt.
          </p>
          <p className="field-hint">{requirementsText}</p>
        </div>

        <div className="form-grid">
          <div className="field-full">
            <label htmlFor="file">Datei</label>
            <input
              id="file"
              name="file"
              type="file"
              accept=".pdf,.ai,.eps,.svg,.png,.jpg,.jpeg,.zip"
              disabled={!canUpload || isPending}
            />
          </div>
        </div>

        <div className="inline-actions">
          <button type="submit" className="cta-button" disabled={!canUpload || isPending}>
            {isPending ? "Datei wird hochgeladen..." : "Druckdaten hochladen"}
          </button>
        </div>

        {uploadState.message ? (
          <p className={`form-status ${uploadState.type === "error" ? "error" : "success"}`}>
            {uploadState.message}
          </p>
        ) : null}

        {!canUpload ? (
          <p className="field-hint">
            Für diese Bestellung können aktuell keine neuen Druckdaten hochgeladen werden.
          </p>
        ) : null}
      </form>

      <article className="surface-card">
        <h2>Hochgeladene Dateien</h2>
        {files.length === 0 ? (
          <p className="price-note">Noch keine Druckdatei hochgeladen.</p>
        ) : (
          <div className="section-stack">
            {files.map((file) => (
              <div key={file.id} className="section-card">
                <h3>{file.fileName}</h3>
                <p className="price-note">
                  {file.statusLabel} · {file.createdAtLabel} · {formatFileSize(file.sizeBytes)}
                </p>
                <a href={file.downloadHref} className="secondary-link">
                  Datei herunterladen
                </a>
              </div>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}

function formatFileSize(sizeBytes: number) {
  if (sizeBytes >= 1024 * 1024) {
    return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(sizeBytes / 1024))} KB`;
}
