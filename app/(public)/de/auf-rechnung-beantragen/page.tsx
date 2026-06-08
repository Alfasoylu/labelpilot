"use client";

import { useState } from "react";

export default function AufRechnungBeantragenPage() {
  const [form, setForm] = useState({
    firmenname: "",
    ustId: "",
    ansprechpartner: "",
    email: "",
    telefon: "",
    bestellvolumen: "",
    nachricht: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/auf-rechnung/beantragen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="page-container" style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 1rem 4rem" }}>
      <h1 className="page-title" style={{ marginBottom: "0.5rem" }}>Auf Rechnung bestellen</h1>
      <p className="page-lead" style={{ marginBottom: "2rem" }}>
        Geprüfte Geschäftskunden können auf Rechnung bestellen und zahlen 15 Tage nach Lieferung (Netto-15).
        Füllen Sie das Formular aus – wir prüfen Ihre Anfrage und melden uns innerhalb von 1–2 Werktagen.
      </p>

      {status === "ok" ? (
        <div className="form-success-box">
          <strong>Anfrage eingegangen.</strong> Wir prüfen Ihre Angaben und melden uns in Kürze per E-Mail.
        </div>
      ) : (
        <form onSubmit={(e) => void handleSubmit(e)} className="contact-form">
          <div className="form-row">
            <label className="form-label" htmlFor="firmenname">Firmenname *</label>
            <input
              id="firmenname"
              className="form-input"
              type="text"
              required
              value={form.firmenname}
              onChange={update("firmenname")}
              placeholder="Muster GmbH"
            />
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="ustId">USt-IdNr. / Steuernummer</label>
            <input
              id="ustId"
              className="form-input"
              type="text"
              value={form.ustId}
              onChange={update("ustId")}
              placeholder="DE123456789"
            />
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="ansprechpartner">Ansprechpartner *</label>
            <input
              id="ansprechpartner"
              className="form-input"
              type="text"
              required
              value={form.ansprechpartner}
              onChange={update("ansprechpartner")}
              placeholder="Max Mustermann"
            />
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="email">E-Mail *</label>
            <input
              id="email"
              className="form-input"
              type="email"
              required
              value={form.email}
              onChange={update("email")}
              placeholder="kontakt@firma.de"
            />
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="telefon">Telefon</label>
            <input
              id="telefon"
              className="form-input"
              type="tel"
              value={form.telefon}
              onChange={update("telefon")}
              placeholder="+49 30 123456"
            />
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="bestellvolumen">Erwartetes monatliches Bestellvolumen</label>
            <select
              id="bestellvolumen"
              className="form-input"
              value={form.bestellvolumen}
              onChange={update("bestellvolumen")}
            >
              <option value="">Bitte wählen</option>
              <option value="unter 500 €">unter 500 €</option>
              <option value="500–1.000 €">500–1.000 €</option>
              <option value="1.000–3.000 €">1.000–3.000 €</option>
              <option value="über 3.000 €">über 3.000 €</option>
            </select>
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="nachricht">Weitere Angaben</label>
            <textarea
              id="nachricht"
              className="form-input"
              rows={4}
              value={form.nachricht}
              onChange={update("nachricht")}
              placeholder="z. B. bisherige Bestellnummern, besondere Anforderungen …"
            />
          </div>

          {status === "error" && (
            <p className="form-error">Übertragungsfehler. Bitte versuchen Sie es erneut oder kontaktieren Sie uns per E-Mail.</p>
          )}

          <button
            type="submit"
            className="cta-button"
            disabled={status === "sending"}
            style={{ marginTop: "1rem" }}
          >
            {status === "sending" ? "Wird gesendet …" : "Anfrage absenden"}
          </button>

          <p style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "0.75rem" }}>
            * Pflichtfelder. Ihre Daten werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet.
          </p>
        </form>
      )}
    </div>
  );
}
