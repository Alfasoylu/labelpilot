"use client";

import { useActionState, useEffect, useRef } from "react";

import { SourceTrackingFields } from "@/components/source-tracking-fields";
import { trackLeadEvent } from "@/lib/analytics/browser";
import {
  submitSampleBoxRequest,
  type SampleBoxFormState,
} from "@/lib/actions/sample-box-request";

const initialState: SampleBoxFormState = {
  status: "idle",
  message: "",
};

const countries = ["Deutschland", "Oesterreich", "Schweiz", "Andere"];
const industries = [
  "Lebensmittel",
  "Getraenke",
  "Supplemente",
  "Kaffee / Tee",
  "Gewuerze",
  "Honig / Marmelade",
  "Kosmetik",
  "Andere",
];
const interests = [
  "Opake PP-Etiketten",
  "Transparente PP-Etiketten",
  "Thermoetiketten",
  "Thermo-Versandetiketten",
  "Noch unsicher",
];
const quantities = ["1.000", "2.000", "5.000", "10.000", "20.000+", "Noch unsicher"];

export function SampleBoxRequestForm() {
  const [state, formAction, pending] = useActionState(
    submitSampleBoxRequest,
    initialState,
  );
  const trackedRef = useRef(false);

  useEffect(() => {
    if ((state.status === "success" || state.status === "warning") && !trackedRef.current) {
      trackLeadEvent("sample_box_submit", {
        status: state.status,
      });
      trackedRef.current = true;
    }

    if (state.status === "idle" || state.status === "error") {
      trackedRef.current = false;
    }
  }, [state.status]);

  return (
    <form action={formAction} className="quote-form">
      <SourceTrackingFields />

      <div>
        <h2>Musterbox anfragen</h2>
        <p className="field-hint">
          Die Anfrage dient der Qualifizierung. Materialvergleich, Menge und Einsatzfall
          helfen bei der Entscheidung, ob die Musterbox der richtige naechste Schritt ist.
        </p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <span className="form-group-title">Unternehmen</span>
        </div>
        <div className="field">
          <label htmlFor="sample-companyName">Firmenname</label>
          <input id="sample-companyName" name="companyName" required />
        </div>
        <div className="field">
          <label htmlFor="sample-contactName">Ansprechpartner</label>
          <input id="sample-contactName" name="contactName" />
        </div>
        <div className="field">
          <label htmlFor="sample-email">E-Mail</label>
          <input id="sample-email" name="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="sample-phone">Telefon</label>
          <input id="sample-phone" name="phone" type="tel" />
        </div>
        <div className="field">
          <label htmlFor="sample-country">Land</label>
          <select id="sample-country" name="country" defaultValue="Deutschland">
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sample-website">Website / Shop</label>
          <input id="sample-website" name="website" type="url" />
        </div>
        <div className="field">
          <label htmlFor="sample-industry">Branche</label>
          <select id="sample-industry" name="industry" defaultValue="Lebensmittel">
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <span className="form-group-title">Musterinteresse</span>
        </div>
        <div className="field">
          <label htmlFor="sample-productType">Welche Etiketten interessieren Sie?</label>
          <select
            id="sample-productType"
            name="productType"
            defaultValue="Opake PP-Etiketten"
          >
            {interests.map((interest) => (
              <option key={interest} value={interest}>
                {interest}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sample-quantity">Voraussichtliche Menge</label>
          <select id="sample-quantity" name="quantity" defaultValue="5.000">
            {quantities.map((quantity) => (
              <option key={quantity} value={quantity}>
                {quantity}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sample-recurringNeed">Wiederkehrender Bedarf</label>
          <select
            id="sample-recurringNeed"
            name="recurringNeed"
            defaultValue="Ja, regelmaessig"
          >
            <option value="Ja, regelmaessig">Ja, regelmaessig</option>
            <option value="Vielleicht">Vielleicht</option>
            <option value="Nein, einmalig">Nein, einmalig</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="sample-targetDeliveryDate">Wann benoetigen Sie Etiketten?</label>
          <input id="sample-targetDeliveryDate" name="targetDeliveryDate" type="date" />
        </div>
        <div className="field-full">
          <label htmlFor="sample-shippingAddress">Lieferadresse oder PLZ</label>
          <textarea
            id="sample-shippingAddress"
            name="shippingAddress"
            rows={3}
            required
            placeholder="Strasse, Ort oder mindestens PLZ fuer die Qualifizierung."
          />
        </div>

        <div className="form-group">
          <span className="form-group-title">Nachricht</span>
        </div>
        <div className="field-full">
          <label htmlFor="sample-notes">Notizen</label>
          <textarea
            id="sample-notes"
            name="notes"
            placeholder="Verpackungsart, Produktkontext oder offene Fragen."
          />
        </div>
        <div className="field-full checkbox-field">
          <input id="sample-consent" name="consent" type="checkbox" value="yes" required />
          <label htmlFor="sample-consent">
            Ich habe die Datenschutzerklärung gelesen und stimme zu, dass
            meine Angaben zur Bearbeitung meiner Anfrage verwendet werden.
          </label>
        </div>
      </div>

      <div className="inline-actions">
        <button type="submit" className="cta-button" disabled={pending}>
          {pending ? "Anfrage wird gesendet..." : "Musterbox anfragen"}
        </button>
      </div>

      {state.message ? (
        <p className={`form-status ${state.status}`}>{state.message}</p>
      ) : null}
    </form>
  );
}
