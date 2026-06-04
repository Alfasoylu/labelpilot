"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import type {
  CheckoutAddonInput,
  CheckoutArtworkInputStatus,
} from "@/lib/checkout/intake";

type CheckoutIntakeFormProps = {
  packageId: string;
  productSlug: "opake-pp-etiketten" | "transparente-pp-etiketten";
  material: "OPAQUE" | "TRANSPARENT";
  quantity: number;
  addons: CheckoutAddonInput;
  productName: string;
  packageLabel: string;
  priceLabel: string;
  addonSummary: string[];
  backHref: string;
};

export function CheckoutIntakeForm({
  packageId,
  productSlug,
  material,
  quantity,
  addons,
  productName,
  packageLabel,
  priceLabel,
  addonSummary,
  backHref,
}: CheckoutIntakeFormProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (formData: FormData) => {
    setErrorMessage("");

    startTransition(async () => {
      const payload = {
        packageId,
        productSlug,
        material,
        quantity,
        companyName: String(formData.get("companyName") ?? ""),
        contactName: String(formData.get("contactName") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        vatId: String(formData.get("vatId") ?? ""),
        notes: String(formData.get("notes") ?? ""),
        streetAddress: String(formData.get("streetAddress") ?? ""),
        addressLine2: String(formData.get("addressLine2") ?? ""),
        postalCode: String(formData.get("postalCode") ?? ""),
        city: String(formData.get("city") ?? ""),
        country: String(formData.get("country") ?? "DE"),
        artworkStatus: String(
          formData.get("artworkStatus") ?? "upload_after_order",
        ) as CheckoutArtworkInputStatus,
        addons,
      };

      try {
        const response = await fetch("/api/checkout/create-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = (await response.json().catch(() => null)) as
          | { url?: string; error?: string }
          | null;

        if (!response.ok || !data?.url) {
          setErrorMessage(
            data?.error ??
              "Der Checkout ist im Moment nicht verfuegbar. Bitte nutzen Sie das Angebotsformular.",
          );
          return;
        }

        window.location.assign(data.url);
      } catch {
        setErrorMessage(
          "Der Checkout ist im Moment nicht erreichbar. Bitte nutzen Sie das Angebotsformular.",
        );
      }
    });
  };

  return (
    <form action={handleSubmit} className="quote-form">
      <div>
        <h2>Bestelldaten pruefen und zur Zahlung weiter</h2>
        <p className="field-hint">
          Ihre Angaben werden vor Stripe serverseitig geprueft, als Bestellung erfasst und erst
          danach zur Zahlung weitergeleitet.
        </p>
      </div>

      <article className="surface-card">
        <h3>Bestellzusammenfassung</h3>
        <ul className="simple-list">
          <li>Produkt: {productName}</li>
          <li>Paket: {packageLabel}</li>
          <li>Menge: {quantity.toLocaleString("de-DE")} Stueck</li>
          <li>Preis: {priceLabel}</li>
          <li>Land: Deutschland</li>
          <li>
            Druckdaten:
            {" "}
            {addons.customerUploadsOwnData
              ? "druckfertige Daten werden nach der Zahlung hochgeladen"
              : "Designservice oder Datenklaerung im Auftrag enthalten"}
          </li>
        </ul>
        {addonSummary.length > 0 ? (
          <>
            <p className="field-hint">Ausgewaehlte Zusatzleistungen</p>
            <ul className="simple-list">
              {addonSummary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ) : null}
      </article>

      <div className="form-grid">
        <div className="form-group">
          <span className="form-group-title">Unternehmen</span>
        </div>
        <div className="field">
          <label htmlFor="companyName">Firmenname</label>
          <input id="companyName" name="companyName" required />
        </div>
        <div className="field">
          <label htmlFor="contactName">Ansprechpartner</label>
          <input id="contactName" name="contactName" required />
        </div>
        <div className="field">
          <label htmlFor="email">E-Mail</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="phone">Telefon</label>
          <input id="phone" name="phone" type="tel" required />
        </div>
        <div className="field">
          <label htmlFor="vatId">USt-IdNr. (optional)</label>
          <input id="vatId" name="vatId" />
        </div>

        <div className="form-group">
          <span className="form-group-title">Lieferadresse</span>
        </div>
        <div className="field-full">
          <label htmlFor="streetAddress">Strasse und Hausnummer</label>
          <input id="streetAddress" name="streetAddress" required />
        </div>
        <div className="field-full">
          <label htmlFor="addressLine2">Adresszusatz (optional)</label>
          <input id="addressLine2" name="addressLine2" />
        </div>
        <div className="field">
          <label htmlFor="postalCode">PLZ</label>
          <input id="postalCode" name="postalCode" required />
        </div>
        <div className="field">
          <label htmlFor="city">Ort</label>
          <input id="city" name="city" required />
        </div>
        <div className="field">
          <label htmlFor="country">Land</label>
          <select id="country" name="country" defaultValue="DE">
            <option value="DE">Deutschland (DE)</option>
          </select>
        </div>

        <div className="form-group">
          <span className="form-group-title">Druckdatenstatus</span>
        </div>
        <div className="field-full">
          <label htmlFor="artworkStatus">Wie moechten Sie mit den Druckdaten fortfahren?</label>
          <select
            id="artworkStatus"
            name="artworkStatus"
            defaultValue="upload_after_order"
          >
            <option value="artwork_ready">
              Druckdaten sind bereit und werden direkt nach der Zahlung hochgeladen
            </option>
            <option value="upload_after_order">
              Druckdaten folgen nach der Bestellung
            </option>
            <option value="needs_help">
              Ich brauche Hilfe bei Datei oder Gestaltung
            </option>
          </select>
        </div>
        <div className="field-full">
          <label htmlFor="notes">Hinweise (optional)</label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Lieferhinweise, interne Referenz, Druckdatenhinweise oder Fragen."
          />
        </div>
      </div>

      {errorMessage ? <p className="form-status error">{errorMessage}</p> : null}

      <div className="inline-actions">
        <button type="submit" className="cta-button" disabled={isPending}>
          {isPending ? "Weiter zu Stripe..." : "Zur Zahlung weiter"}
        </button>
        <Link href={backHref} className="secondary-link">
          Zurueck zum Produkt
        </Link>
        <Link href="/de/angebot-anfordern" className="secondary-link">
          Lieber Angebot anfordern
        </Link>
      </div>
    </form>
  );
}
