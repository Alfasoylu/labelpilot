"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

type MaterialKey = "OPAQUE_PP" | "TRANSPARENT_PP";
type Finishing = "MATT" | "GLAENZEND";
type ArtworkStatus = "artwork_ready" | "upload_after_order" | "needs_help";

type CustomSizeCheckoutFormProps = {
  materialKey: MaterialKey;
  form?: string;
  widthMm: number;
  heightMm: number;
  quantity: number;
  mengeProMotiv?: number;
  finishing: Finishing;
  cornerRadius?: number;
  weissunterdruck?: boolean;
  klebertyp?: string;
  tiefkuehlgeeignet?: boolean;
  farbigkeit?: number;
  anzahlSorten?: number;
  uvLack?: string;
  kerndurchmesser?: string;
  wickelrichtung?: string;
  printMethod?: "DIGITAL" | "FLEXO";
  netPrice: number;
  grossPrice: number;
  designService?: boolean;
  designFeeNet?: number;
  designFeeGross?: number;
  isHeavyShipment?: boolean;
  onBack: () => void;
};

function formatWickelrichtung(w: string): string {
  const map: Record<string, string> = {
    ABROLLUNG_1: "Abrollung 1 – von außen, Etikett oben",
    ABROLLUNG_2: "Abrollung 2 – von außen, Etikett unten",
    ABROLLUNG_3: "Abrollung 3 – von innen, Etikett oben",
    ABROLLUNG_4: "Abrollung 4 – von innen, Etikett unten",
  };
  return map[w] ?? "";
}

function formatEur(amount: number) {
  return amount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function getMaterialLabel(key: MaterialKey) {
  return key === "OPAQUE_PP" ? "Opak PP" : "Transparent PP";
}

export function CustomSizeCheckoutForm({
  materialKey,
  form = "RECHTECKIG",
  widthMm,
  heightMm,
  quantity,
  mengeProMotiv,
  finishing,
  cornerRadius = 2,
  weissunterdruck = false,
  klebertyp = "PERMANENT",
  tiefkuehlgeeignet = false,
  farbigkeit = 4,
  anzahlSorten = 1,
  uvLack = "KEIN",
  kerndurchmesser = "76",
  wickelrichtung = "BELIEBIG",
  printMethod = "DIGITAL",
  netPrice,
  grossPrice,
  designService = false,
  designFeeNet = 0,
  designFeeGross = 0,
  isHeavyShipment = false,
  onBack,
}: CustomSizeCheckoutFormProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  // CHK-004: Prevent double-submit with a ref guard that is more reliable than isPending alone.
  const submittedRef = useRef(false);
  const totalNet = netPrice + designFeeNet;
  const totalGross = grossPrice + designFeeGross;
  const vatAmount = totalGross - totalNet;

  const handleSubmit = (formData: FormData) => {
    // CHK-004: Guard against double-submit before the transition starts or during slow redirects.
    if (submittedRef.current) {
      return;
    }
    submittedRef.current = true;
    setErrorMessage("");
    startTransition(async () => {
      const payload = {
        materialKey,
        form,
        widthMm,
        heightMm,
        quantity,
        finishing,
        cornerRadius,
        weissunterdruck,
        klebertyp,
        tiefkuehlgeeignet,
        farbigkeit,
        anzahlSorten,
        uvLack,
        designService,
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
        country: "DE",
        rollKern: kerndurchmesser ? `${kerndurchmesser} mm` : "",
        abrollrichtung: wickelrichtung !== "BELIEBIG" ? formatWickelrichtung(wickelrichtung) : "",
        maxRollendurchmesser: String(formData.get("maxRollendurchmesser") ?? ""),
        maschineName: String(formData.get("maschineName") ?? ""),
        artworkStatus: String(formData.get("artworkStatus") ?? "upload_after_order") as ArtworkStatus,
      };

      try {
        const response = await fetch("/api/checkout/create-custom-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;

        if (!response.ok || !data?.url) {
          const msg = data?.error ?? "Der Checkout ist nicht verfügbar. Bitte nutzen Sie das Angebotsformular.";
          setErrorMessage(msg);
          toast.error(msg);
          submittedRef.current = false; // allow retry on error
          return;
        }
        window.location.assign(data.url);
      } catch {
        const msg = "Der Checkout ist nicht erreichbar. Bitte nutzen Sie das Angebotsformular.";
        setErrorMessage(msg);
        toast.error(msg);
        submittedRef.current = false; // allow retry on error
      }
    });
  };

  return (
    <form action={handleSubmit} className="quote-form">
      <div>
        <h2>Bestelldaten eingeben</h2>
        <p className="field-hint">
          Ihre Angaben werden vor der Weiterleitung zu Stripe serverseitig geprüft und als
          Bestellung erfasst.
        </p>
      </div>

      <article className="surface-card">
        <h3>Bestellzusammenfassung</h3>
        <ul className="simple-list">
          <li>Format: {widthMm} × {heightMm} mm (Wunschformat)</li>
          {form === "OVAL" && <li>Form: Oval / Rund</li>}
          <li>Material: {getMaterialLabel(materialKey)}</li>
          <li>Kleber: {klebertyp === "PERMANENT" ? "Permanent haftend" : "Wiederablösbar"}</li>
          <li>Oberfläche: {finishing === "GLAENZEND" ? "Glänzend" : "Matt"}</li>
          <li>Farbigkeit: {farbigkeit}-farbig{farbigkeit === 4 ? " (CMYK)" : ""}{weissunterdruck ? " + Weißunterdruck" : ""}</li>
          <li>Kerndurchmesser: {kerndurchmesser} mm</li>
          {wickelrichtung !== "BELIEBIG" && <li>Wickelrichtung: {formatWickelrichtung(wickelrichtung)}</li>}
          {uvLack !== "KEIN" && <li>UV-Schutzlack: Glänzend</li>}
          {tiefkuehlgeeignet && <li>Tiefkühlgeeignet: Ja</li>}
          <li>Druckmethode: {printMethod === "DIGITAL" ? "Digitaldruck" : "Flexodruck"}</li>
          {anzahlSorten > 1 && mengeProMotiv ? (
            <>
              <li>Verschiedene Motive: {anzahlSorten}</li>
              <li>Menge pro Motiv: {mengeProMotiv.toLocaleString("de-DE")} Stück</li>
              <li>Menge gesamt: {quantity.toLocaleString("de-DE")} Stück</li>
            </>
          ) : (
            <li>Menge: {quantity.toLocaleString("de-DE")} Stück</li>
          )}
          {designService && (
            <li>
              Designservice: {designFeeNet > 0 ? `${formatEur(designFeeNet)} netto` : "im Bestellwert inbegriffen"}
            </li>
          )}
          <li>Gesamt Netto: {formatEur(totalNet)}</li>
          <li>MwSt. 19 %: {formatEur(vatAmount)}</li>
          <li>
            <strong>Gesamt brutto: {formatEur(totalGross)} inkl. 19 % MwSt.</strong>
          </li>
          <li>Versand nach Deutschland: inklusive</li>
        </ul>
        <p className="field-hint">
          Lieferzeit: ca. {isHeavyShipment ? "21–28" : "10–14"} Werktage nach Ihrer Druckdaten-Freigabe
          (Produktion + Versand nach Deutschland). Voraussichtlicher Zeitraum, keine bindende Garantie.
        </p>
      </article>

      <div className="form-grid">
        <div className="form-group">
          <span className="form-group-title">Unternehmen</span>
        </div>
        <div className="field">
          <label htmlFor="cs-companyName">Firmenname</label>
          <input id="cs-companyName" name="companyName" required />
        </div>
        <div className="field">
          <label htmlFor="cs-contactName">Ansprechpartner</label>
          <input id="cs-contactName" name="contactName" required />
        </div>
        <div className="field">
          <label htmlFor="cs-email">E-Mail</label>
          <input id="cs-email" name="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="cs-phone">Telefon</label>
          <input id="cs-phone" name="phone" type="tel" required />
        </div>
        <div className="field">
          <label htmlFor="cs-vatId">USt-IdNr. (optional)</label>
          <input id="cs-vatId" name="vatId" />
        </div>

        <div className="form-group">
          <span className="form-group-title">Lieferadresse</span>
        </div>
        <div className="field-full">
          <label htmlFor="cs-streetAddress">Straße und Hausnummer</label>
          <input id="cs-streetAddress" name="streetAddress" required />
        </div>
        <div className="field-full">
          <label htmlFor="cs-addressLine2">Adresszusatz (optional)</label>
          <input id="cs-addressLine2" name="addressLine2" />
        </div>
        <div className="field">
          <label htmlFor="cs-postalCode">PLZ</label>
          <input id="cs-postalCode" name="postalCode" required />
        </div>
        <div className="field">
          <label htmlFor="cs-city">Ort</label>
          <input id="cs-city" name="city" required />
        </div>

        <div className="form-group">
          <span className="form-group-title">Rollenspezifikationen</span>
        </div>
        <div className="field">
          <label htmlFor="cs-maxRollendurchmesser">Max. Rollendurchmesser (optional)</label>
          <input id="cs-maxRollendurchmesser" name="maxRollendurchmesser" placeholder="z. B. 200 mm" />
        </div>
        <div className="field">
          <label htmlFor="cs-maschineName">Maschine / Etikettenspender (optional)</label>
          <input id="cs-maschineName" name="maschineName" placeholder="z. B. HERMA 400, Zebra ZT411" />
        </div>

        <div className="form-group">
          <span className="form-group-title">Druckdatenstatus</span>
        </div>
        <div className="field-full">
          <label htmlFor="cs-artworkStatus">Wie möchten Sie mit den Druckdaten fortfahren?</label>
          <select id="cs-artworkStatus" name="artworkStatus" defaultValue="upload_after_order">
            <option value="artwork_ready">
              Druckdaten sind bereit – werden direkt nach der Zahlung hochgeladen
            </option>
            <option value="upload_after_order">Druckdaten folgen nach der Bestellung</option>
            <option value="needs_help">Ich brauche Hilfe bei Datei oder Gestaltung</option>
          </select>
        </div>
        <div className="field-full">
          <label htmlFor="cs-notes">Hinweise (optional)</label>
          <textarea
            id="cs-notes"
            name="notes"
            rows={4}
            placeholder="Lieferhinweise, interne Referenz, Druckdatenhinweise oder Fragen."
          />
        </div>
      </div>

      {errorMessage ? <p className="form-status error" role="alert">{errorMessage}</p> : null}

      <p className="field-hint">
        Mit Klick auf &bdquo;Zur Zahlung weiter&ldquo; bestellen Sie kostenpflichtig. Es gelten
        unsere{" "}
        <a href="/de/agb" target="_blank" rel="noreferrer" className="secondary-link">AGB</a>; Hinweise
        zum Datenschutz finden Sie in der{" "}
        <a href="/de/datenschutz" target="_blank" rel="noreferrer" className="secondary-link">Datenschutzerklärung</a>.
      </p>

      <div className="inline-actions">
        <button type="submit" className="cta-button" disabled={isPending}>
          {isPending ? "Weiter zu Stripe..." : "Zur Zahlung weiter"}
        </button>
        <button type="button" className="secondary-link" onClick={onBack}>
          Zurück zum Kalkulator
        </button>
      </div>
    </form>
  );
}
