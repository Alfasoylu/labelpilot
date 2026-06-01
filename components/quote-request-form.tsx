"use client";

import { useActionState } from "react";

import {
  submitQuoteRequest,
  type QuoteFormState,
} from "@/lib/actions/quote-request";

const initialState: QuoteFormState = {
  status: "idle",
  message: "",
};

const countries = ["Deutschland", "Österreich", "Schweiz", "Andere"];
const industries = [
  "Lebensmittel",
  "Getränke",
  "Supplemente",
  "Kosmetik",
  "Private Label",
  "Andere",
];
const productTypes = [
  "PP-Rollenetiketten",
  "Transparente PP-Etiketten",
  "Opake PP-Etiketten",
  "Thermo-Versandetiketten",
  "Noch unsicher",
];
const sizes = ["100×200 mm", "100×150 mm", "100×100 mm", "Andere"];
const materials = ["Opakes PP", "Transparentes PP", "Thermo", "Noch unsicher"];
const quantities = ["1.000", "2.000", "5.000", "10.000", "20.000+"];

export function QuoteRequestForm() {
  const [state, formAction, pending] = useActionState(
    submitQuoteRequest,
    initialState,
  );

  return (
    <form action={formAction} className="quote-form">
      <h2>B2B-Angebot anfordern</h2>
      <p className="field-hint">
        Je genauer Ihre Angaben zu Material, Größe, Menge und Verpackung sind,
        desto schneller kann der nächste Schritt vorbereitet werden.
      </p>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="companyName">Firmenname</label>
          <input id="companyName" name="companyName" required />
        </div>
        <div className="field">
          <label htmlFor="contactName">Ansprechpartner</label>
          <input id="contactName" name="contactName" />
        </div>
        <div className="field">
          <label htmlFor="email">E-Mail</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="phone">Telefon</label>
          <input id="phone" name="phone" type="tel" />
        </div>
        <div className="field">
          <label htmlFor="country">Land</label>
          <select id="country" name="country" defaultValue="Deutschland">
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="industry">Branche</label>
          <select id="industry" name="industry" defaultValue="Lebensmittel">
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="productType">Produkttyp</label>
          <select id="productType" name="productType" defaultValue="PP-Rollenetiketten">
            {productTypes.map((productType) => (
              <option key={productType} value={productType}>
                {productType}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="labelSize">Etikettengröße</label>
          <select id="labelSize" name="labelSize" defaultValue="100×200 mm">
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="material">Material</label>
          <select id="material" name="material" defaultValue="Opakes PP">
            {materials.map((material) => (
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="quantity">Menge</label>
          <select id="quantity" name="quantity" defaultValue="5.000">
            {quantities.map((quantity) => (
              <option key={quantity} value={quantity}>
                {quantity}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="recurringNeed">Wiederkehrender Bedarf</label>
          <select id="recurringNeed" name="recurringNeed" defaultValue="Ja, regelmäßig">
            <option value="Ja, regelmäßig">Ja, regelmäßig</option>
            <option value="Gelegentlich">Gelegentlich</option>
            <option value="Noch offen">Noch offen</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="hasArtwork">Druckdatei vorhanden?</label>
          <select id="hasArtwork" name="hasArtwork" defaultValue="ja">
            <option value="ja">Ja</option>
            <option value="nein">Nein</option>
            <option value="teilweise">Teilweise</option>
          </select>
        </div>
        <div className="field-full">
          <label htmlFor="targetDeliveryDate">Ziel-Liefertermin</label>
          <input id="targetDeliveryDate" name="targetDeliveryDate" type="date" />
        </div>
        <div className="field-full">
          <label htmlFor="notes">Notizen</label>
          <textarea
            id="notes"
            name="notes"
            placeholder="Verpackung, Anwendung, Rollenanzahl, gewünschte Optik oder offene Fragen."
          />
        </div>
        <div className="field-full checkbox-field">
          <input id="consent" name="consent" type="checkbox" value="yes" required />
          <label htmlFor="consent">
            Ich habe die Datenschutzerklärung gelesen und stimme zu, dass
            meine Angaben zur Bearbeitung meiner Anfrage verwendet werden.
          </label>
        </div>
      </div>

      <div className="inline-actions">
        <button type="submit" className="cta-button" disabled={pending}>
          {pending ? "Anfrage wird gesendet..." : "Angebot anfordern"}
        </button>
      </div>

      {state.message ? (
        <p className={`form-status ${state.status}`}>{state.message}</p>
      ) : null}

      <p className="field-hint">
        Druckdateien können Sie später senden. Für ein erstes Angebot reichen
        Angaben zu Material, Größe, Menge und Verpackung.
      </p>
    </form>
  );
}
