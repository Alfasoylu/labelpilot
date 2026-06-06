"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

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
  netPriceLabel: string;
  addonSummary: string[];
  backHref: string;
  initialFinishing?: "MATT" | "GLAENZEND";
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
  netPriceLabel,
  addonSummary,
  backHref,
  initialFinishing,
}: CheckoutIntakeFormProps) {
  const configuratorChangeHref = `/de/pp-rollenetiketten?material=${
    material === "TRANSPARENT" ? "transparent" : "opaque"
  }&size=standard&quantity=${quantity}`;
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFinishing, setSelectedFinishing] = useState<"MATT" | "GLAENZEND">(initialFinishing ?? "MATT");
  const artworkSummary = addons.customerUploadsOwnData
    ? "druckfertige Daten werden nach der Zahlung hochgeladen"
    : addons.designService
      ? "Designservice ist für diesen Auftrag ausgewählt und wird serverseitig nach den Freiregeln geprüft"
      : "Druckdaten folgen nach der Bestellung; Designservice nur bei Auswahl oder wenn die Freiregel greift";

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
        finishing: String(formData.get("finishing") ?? "MATT") as "MATT" | "GLAENZEND",
        rollKern: String(formData.get("rollKern") ?? ""),
        abrollrichtung: String(formData.get("abrollrichtung") ?? ""),
        maxRollendurchmesser: String(formData.get("maxRollendurchmesser") ?? ""),
        maschineName: String(formData.get("maschineName") ?? ""),
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
          const msg =
            data?.error ??
            "Der Checkout ist im Moment nicht verfügbar. Bitte nutzen Sie das Angebotsformular.";
          setErrorMessage(msg);
          toast.error(msg);
          return;
        }

        window.location.assign(data.url);
      } catch {
        const msg =
          "Der Checkout ist im Moment nicht erreichbar. Bitte nutzen Sie das Angebotsformular.";
        setErrorMessage(msg);
        toast.error(msg);
      }
    });
  };

  return (
    <form action={handleSubmit} className="quote-form">
      <div>
        <h2>Bestelldaten prüfen und zur Zahlung weiter</h2>
        <p className="field-hint">
          Ihre Angaben werden vor Stripe serverseitig geprüft, als Bestellung erfasst und erst
          danach zur Zahlung weitergeleitet.
        </p>
      </div>

      <article className="surface-card">
        <h3>Bestellzusammenfassung</h3>
        <ul className="simple-list">
          <li>Produkt: {productName}</li>
          <li>Material: {material === "TRANSPARENT" ? "Transparentes PP" : "Opakes PP"}</li>
          <li>Oberfläche: {selectedFinishing === "GLAENZEND" ? "Glänzend" : "Matt (Standard)"}</li>
          <li>Größe: 100 × 200 mm (Standardformat)</li>
          <li>Paket: {packageLabel}</li>
          <li>Menge: {quantity.toLocaleString("de-DE")} Stück</li>
          <li>Preis: {netPriceLabel} · {priceLabel} (inkl. 19% MwSt)</li>
          <li>Land: Deutschland</li>
          <li>
            Proof: {addons.physicalProof ? "Digital + Physischer Andruck" : "Digital (inklusive)"}
          </li>
          <li>
            Druckdaten:
            {" "}
            {artworkSummary}
          </li>
        </ul>
        {material === "TRANSPARENT" ? (
          <p className="field-hint">
            <strong>Hinweis:</strong> Weißunterdruck (Deckweiß) ist nicht im Standardpreis
            enthalten. Falls benötigt, bitte zuerst{" "}
            <Link href="/de/angebot-anfordern?material=transparent" className="secondary-link">
              ein Angebot anfordern
            </Link>
            .
          </p>
        ) : null}
        <p className="field-hint">
          Lieferzeit: ca. 10–14 Werktage nach Ihrer Freigabe (Produktion + Versand nach
          Deutschland). Voraussichtlicher Zeitraum, keine bindende Garantie.
        </p>
        <p className="field-hint">
          <Link href={configuratorChangeHref} className="secondary-link">
            Auswahl im Konfigurator ändern
          </Link>
        </p>
        {addonSummary.length > 0 ? (
          <>
            <p className="field-hint">Ausgewählte Zusatzleistungen</p>
            <ul className="simple-list">
              {addonSummary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="field-hint">
            Keine kostenpflichtigen Zusatzleistungen ausgewählt. Standard-Datenprüfung und ein
            digitaler Proof bleiben inklusive.
          </p>
        )}
      </article>

      <div className="form-grid">
        <div className="form-group">
          <span className="form-group-title">Oberfläche / Finish</span>
        </div>
        <div className="field">
          <label htmlFor="finishing">Oberflächenfinish</label>
          <select
            id="finishing"
            name="finishing"
            value={selectedFinishing}
            onChange={(e) => setSelectedFinishing(e.target.value as "MATT" | "GLAENZEND")}
          >
            <option value="MATT">Matt (Standard)</option>
            <option value="GLAENZEND">Glänzend</option>
          </select>
        </div>
        <div className="field-full">
          <p className="field-hint">
            Kein Preisunterschied zwischen Matt und Glänzend. Sonderoberflächen (Soft-Touch,
            Folienlaminat, Hochglanzlaminat) sind nicht im Standardpreis enthalten und werden nur
            über ein individuelles Angebot beauftragt.
          </p>
        </div>

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
          <label htmlFor="streetAddress">Straße und Hausnummer</label>
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
          <span className="form-group-title">Rollenspezifikationen</span>
        </div>
        <div className="field">
          <label htmlFor="rollKern">Rollenkern (Innendurchmesser)</label>
          <select id="rollKern" name="rollKern" defaultValue="">
            <option value="">Keine Angabe</option>
            <option value="76 mm">76 mm (Standard)</option>
            <option value="40 mm">40 mm (Kleinspule)</option>
            <option value="Nicht sicher / Bitte beraten">Nicht sicher / Bitte beraten</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="abrollrichtung">Abrollrichtung</label>
          <select id="abrollrichtung" name="abrollrichtung" defaultValue="">
            <option value="">Keine Angabe (Standard)</option>
            <option value="Abrollung 1 – von außen, Etikett oben">Abrollung 1 – von außen, Etikett oben</option>
            <option value="Abrollung 2 – von außen, Etikett unten">Abrollung 2 – von außen, Etikett unten</option>
            <option value="Abrollung 3 – von innen, Etikett oben">Abrollung 3 – von innen, Etikett oben</option>
            <option value="Abrollung 4 – von innen, Etikett unten">Abrollung 4 – von innen, Etikett unten</option>
            <option value="Abrollung 5–8 / Sonstige">Abrollung 5–8 / Sonstige</option>
            <option value="Nicht sicher / Bitte beraten">Nicht sicher / Bitte beraten</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="maxRollendurchmesser">Max. Rollendurchmesser (optional)</label>
          <input
            id="maxRollendurchmesser"
            name="maxRollendurchmesser"
            placeholder="z. B. 200 mm"
          />
        </div>
        <div className="field">
          <label htmlFor="maschineName">Maschine / Etikettenspender (optional)</label>
          <input
            id="maschineName"
            name="maschineName"
            placeholder="z. B. HERMA 400, Zebra ZT411"
          />
        </div>

        <div className="form-group">
          <span className="form-group-title">Druckdatenstatus</span>
        </div>
        <div className="field-full">
          <label htmlFor="artworkStatus">Wie möchten Sie mit den Druckdaten fortfahren?</label>
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
          Zurück zum Produkt
        </Link>
        <Link href="/de/angebot-anfordern" className="secondary-link">
          Lieber Angebot anfordern
        </Link>
      </div>
    </form>
  );
}
