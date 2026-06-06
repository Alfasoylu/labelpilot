import { getPublicEnv } from "@/lib/env";
import { getQuoteSourceLabel, QUOTE_SOURCE_WUNSCHFORMAT } from "@/lib/quotes/source";

type TemplateResult = {
  subject: string;
  html: string;
  text: string;
};

function formatEuroCents(amountCents: number) {
  return (
    (amountCents / 100).toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " EUR"
  );
}

function formatMaterialLabel(material: string) {
  return material === "TRANSPARENT" ? "Transparentes PP" : "Opakes PP";
}

function formatFinishingLabel(finishing: string | null | undefined) {
  return finishing === "GLAENZEND" ? "Glänzend" : "Matt";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getOrderLink(orderId: string, uploadToken: string) {
  const baseUrl = getPublicEnv().NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  return `${baseUrl}/de/auftrag/${orderId}/druckdaten?token=${encodeURIComponent(uploadToken)}`;
}

function renderShell(input: {
  heading: string;
  intro: string;
  actionLabel?: string;
  actionHref?: string;
  bodyHtml: string;
}) {
  const buttonHtml =
    input.actionLabel && input.actionHref
      ? `<p style="margin:24px 0;"><a href="${escapeHtml(input.actionHref)}" style="display:inline-block;padding:12px 18px;border-radius:10px;background:#11100E;color:#FFFFFF;text-decoration:none;font-weight:600;">${escapeHtml(input.actionLabel)}</a></p>`
      : "";

  return `<!doctype html>
<html lang="de">
  <body style="margin:0;padding:24px;background:#F7F2E8;color:#2A2926;font-family:Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#FFFDF8;border:1px solid #E5DED2;border-radius:18px;padding:32px;">
      <p style="margin:0 0 8px 0;color:#B08A45;font-size:14px;font-weight:600;letter-spacing:0.04em;">Labelpilot.de</p>
      <h1 style="margin:0 0 16px 0;font-size:28px;line-height:1.2;color:#11100E;">${escapeHtml(input.heading)}</h1>
      <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;">${escapeHtml(input.intro)}</p>
      ${buttonHtml}
      <div style="font-size:15px;line-height:1.7;">${input.bodyHtml}</div>
    </div>
  </body>
</html>`;
}

export function orderConfirmation(input: {
  orderId: string;
  orderNumber: string;
  uploadToken: string;
  material: string;
  quantity: number;
  finishing?: string | null;
  widthMm?: number | null;
  heightMm?: number | null;
  amountCents: number;
  currency: string;
  physicalProofCents?: number | null;
  addonsTotalCents?: number | null;
  companyName?: string | null;
  customerName?: string | null;
  streetAddress?: string | null;
  addressLine2?: string | null;
  postalCode?: string | null;
  city?: string | null;
  country?: string | null;
}): TemplateResult {
  const orderLink = getOrderLink(input.orderId, input.uploadToken);
  const subject = `Ihre Bestellung ${input.orderNumber} ist eingegangen`;

  const hasAddons =
    input.addonsTotalCents != null && input.addonsTotalCents > 0;
  const baseAmountCents = hasAddons
    ? input.amountCents - (input.addonsTotalCents ?? 0)
    : null;

  const addressParts = [
    input.companyName || null,
    input.customerName || null,
    input.streetAddress || null,
    input.addressLine2 || null,
    input.postalCode && input.city
      ? `${input.postalCode} ${input.city}`
      : input.city || input.postalCode || null,
    input.country || null,
  ].filter((x): x is string => x !== null && x.trim() !== "");

  // --- plain text ---
  const summaryLines = [
    `Material: ${formatMaterialLabel(input.material)}`,
    `Menge: ${input.quantity.toLocaleString("de-DE")} Stück`,
    `Oberfläche: ${formatFinishingLabel(input.finishing)}`,
    `Format: ${input.widthMm && input.heightMm ? `${input.widthMm} × ${input.heightMm} mm (Wunschformat)` : "Standardformat"}`,
  ];

  const priceLines: string[] = [];
  if (baseAmountCents !== null) {
    priceLines.push(`Basispreis: ${formatEuroCents(baseAmountCents)} brutto`);
  }
  if (input.physicalProofCents != null && input.physicalProofCents > 0) {
    priceLines.push(
      `Physischer Andruck: ${formatEuroCents(input.physicalProofCents)} brutto`,
    );
  }
  priceLines.push(
    `Gesamtbetrag: ${formatEuroCents(input.amountCents)} brutto inkl. 19% MwSt.`,
  );

  const text = [
    `Vielen Dank für Ihre Bestellung ${input.orderNumber}.`,
    "",
    "Bestellzusammenfassung:",
    ...summaryLines,
    "",
    "Preis:",
    ...priceLines,
    ...(addressParts.length > 0
      ? ["", "Lieferadresse:", ...addressParts]
      : []),
    "",
    "Druckdaten-Upload-Link (bitte aufbewahren):",
    orderLink,
    "",
    "Über diesen Link erreichen Sie den Upload und später auch den Proof.",
  ].join("\n");

  // --- HTML ---
  const summaryHtml = [
    `<p style="margin:2px 0;"><strong>Material:</strong> ${escapeHtml(formatMaterialLabel(input.material))}</p>`,
    `<p style="margin:2px 0;"><strong>Menge:</strong> ${escapeHtml(input.quantity.toLocaleString("de-DE"))} Stück</p>`,
    `<p style="margin:2px 0;"><strong>Oberfläche:</strong> ${escapeHtml(formatFinishingLabel(input.finishing))}</p>`,
    `<p style="margin:2px 0;"><strong>Format:</strong> ${escapeHtml(input.widthMm && input.heightMm ? `${input.widthMm} × ${input.heightMm} mm (Wunschformat)` : "Standardformat")}</p>`,
  ].join("");

  const priceHtmlParts: string[] = [];
  if (baseAmountCents !== null) {
    priceHtmlParts.push(
      `<p style="margin:2px 0;"><strong>Basispreis:</strong> ${escapeHtml(formatEuroCents(baseAmountCents))} brutto</p>`,
    );
  }
  if (input.physicalProofCents != null && input.physicalProofCents > 0) {
    priceHtmlParts.push(
      `<p style="margin:2px 0;"><strong>Physischer Andruck:</strong> ${escapeHtml(formatEuroCents(input.physicalProofCents))} brutto</p>`,
    );
  }
  priceHtmlParts.push(
    `<p style="margin:2px 0;"><strong>Gesamtbetrag: ${escapeHtml(formatEuroCents(input.amountCents))} brutto inkl. 19% MwSt.</strong></p>`,
  );

  const addressHtml =
    addressParts.length > 0
      ? `<h3 style="margin:16px 0 8px 0;font-size:15px;color:#11100E;">Lieferadresse</h3>${addressParts.map((line) => `<p style="margin:2px 0;">${escapeHtml(line)}</p>`).join("")}`
      : "";

  return {
    subject,
    text,
    html: renderShell({
      heading: "Vielen Dank für Ihre Bestellung.",
      intro: `Ihre Bestellung ${input.orderNumber} wurde erfasst.`,
      actionLabel: "Druckdaten hochladen",
      actionHref: orderLink,
      bodyHtml: `
        <h3 style="margin:0 0 8px 0;font-size:15px;color:#11100E;">Bestellzusammenfassung</h3>
        ${summaryHtml}
        <h3 style="margin:16px 0 8px 0;font-size:15px;color:#11100E;">Preis</h3>
        ${priceHtmlParts.join("")}
        ${addressHtml}
        <p style="margin:16px 0 0 0;color:#6B6560;font-size:14px;">Bitte bewahren Sie Ihren Upload-Link auf. Über ihn erreichen Sie den Upload und später auch den Proof.</p>
      `,
    }),
  };
}

export function correctionRequested(input: {
  orderId: string;
  orderNumber: string;
  uploadToken: string;
  adminNote: string;
}): TemplateResult {
  const orderLink = getOrderLink(input.orderId, input.uploadToken);
  const subject = `Korrektur erforderlich für ${input.orderNumber}`;
  const escapedNote = escapeHtml(input.adminNote);
  const text = [
    `Für Ihre Bestellung ${input.orderNumber} benötigen wir eine korrigierte Druckdatei.`,
    "",
    `Hinweis: ${input.adminNote}`,
    "",
    "Bitte laden Sie die korrigierte Datei über diesen Link hoch:",
    orderLink,
  ].join("\n");

  return {
    subject,
    text,
    html: renderShell({
      heading: "Ihre Druckdatei braucht eine Korrektur.",
      intro: `Für die Bestellung ${input.orderNumber} benötigen wir eine aktualisierte Datei.`,
      actionLabel: "Korrigierte Datei hochladen",
      actionHref: orderLink,
      bodyHtml: `
        <p style="margin:0 0 16px 0;"><strong>Hinweis:</strong> ${escapedNote}</p>
        <p style="margin:0;">Bitte laden Sie die korrigierte Datei über den Link oben hoch.</p>
      `,
    }),
  };
}

export function proofReady(input: {
  orderId: string;
  orderNumber: string;
  uploadToken: string;
}): TemplateResult {
  const orderLink = getOrderLink(input.orderId, input.uploadToken);
  const subject = `Proof bereit für ${input.orderNumber}`;
  const text = [
    `Für Ihre Bestellung ${input.orderNumber} steht ein Proof zur Freigabe bereit.`,
    "",
    "Bitte prüfen Sie den Proof über diesen Link und geben Sie ihn frei oder senden Sie einen Änderungswunsch:",
    orderLink,
  ].join("\n");

  return {
    subject,
    text,
    html: renderShell({
      heading: "Ihr Proof steht bereit.",
      intro: `Für die Bestellung ${input.orderNumber} können Sie jetzt den Proof prüfen.`,
      actionLabel: "Proof ansehen",
      actionHref: orderLink,
      bodyHtml: `
        <p style="margin:0;">Bitte prüfen Sie den Proof über den Link oben und geben Sie ihn frei oder senden Sie einen Änderungswunsch.</p>
      `,
    }),
  };
}

export function artworkApproved(input: {
  orderId: string;
  orderNumber: string;
  uploadToken: string;
}): TemplateResult {
  const orderLink = getOrderLink(input.orderId, input.uploadToken);
  const subject = `Druckdaten freigegeben – Bestellung ${input.orderNumber}`;
  const text = [
    `Ihre Druckdaten für die Bestellung ${input.orderNumber} wurden freigegeben.`,
    "",
    "Wir starten jetzt mit der Produktion. Es ist keine weitere Aktion von Ihrer Seite erforderlich.",
    "",
    "Den aktuellen Status Ihrer Bestellung sehen Sie hier:",
    orderLink,
  ].join("\n");

  return {
    subject,
    text,
    html: renderShell({
      heading: "Ihre Druckdaten wurden freigegeben.",
      intro: `Die Druckdaten für die Bestellung ${input.orderNumber} wurden freigegeben.`,
      actionLabel: "Auftragsstatus ansehen",
      actionHref: orderLink,
      bodyHtml: `
        <p style="margin:0;">Wir starten jetzt mit der Produktion. Es ist keine weitere Aktion von Ihrer Seite erforderlich.</p>
      `,
    }),
  };
}

export function proofApproved(input: {
  orderNumber: string;
}): TemplateResult {
  const subject = `Proof freigegeben für ${input.orderNumber}`;
  const text = [
    `Vielen Dank. Der Proof für Ihre Bestellung ${input.orderNumber} wurde freigegeben.`,
    "",
    "Es ist keine weitere Aktion nötig. Wir bereiten den nächsten Produktionsschritt vor.",
  ].join("\n");

  return {
    subject,
    text,
    html: renderShell({
      heading: "Proof erfolgreich freigegeben.",
      intro: `Vielen Dank. Der Proof für die Bestellung ${input.orderNumber} wurde bestätigt.`,
      bodyHtml: `
        <p style="margin:0;">Es ist keine weitere Aktion nötig. Wir bereiten den nächsten Produktionsschritt vor.</p>
      `,
    }),
  };
}

export function shippedOrderCustomer(input: {
  orderId: string;
  orderNumber: string;
  uploadToken: string;
  shippingCarrier?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
}): TemplateResult {
  const orderLink = getOrderLink(input.orderId, input.uploadToken);
  const subject = `Ihre Bestellung ${input.orderNumber} wurde versendet`;
  const text = [
    `Ihre Bestellung ${input.orderNumber} wurde versendet.`,
    "",
    input.shippingCarrier ? `Versanddienstleister: ${input.shippingCarrier}` : "",
    input.trackingNumber ? `Trackingnummer: ${input.trackingNumber}` : "",
    input.trackingUrl ? `Tracking-Link: ${input.trackingUrl}` : "",
    "",
    `Bestellstatus: ${orderLink}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject,
    text,
    html: renderShell({
      heading: "Ihre Bestellung wurde versendet.",
      intro: `Die Bestellung ${input.orderNumber} ist auf dem Weg.`,
      actionLabel: input.trackingUrl ? "Sendung verfolgen" : "Bestellstatus ansehen",
      actionHref: input.trackingUrl || orderLink,
      bodyHtml: `
        <p style="margin:0 0 8px 0;"><strong>Versanddienstleister:</strong> ${escapeHtml(input.shippingCarrier || "Wird separat bestätigt")}</p>
        <p style="margin:0 0 8px 0;"><strong>Trackingnummer:</strong> ${escapeHtml(input.trackingNumber || "Noch nicht verfügbar")}</p>
        <p style="margin:0;">Den aktuellen Status Ihrer Bestellung finden Sie auch über Ihren Bestelllink.</p>
      `,
    }),
  };
}

export function artworkUploadedOpsNotification(input: {
  orderNumber: string;
  customerEmail: string;
  orderId: string;
}): TemplateResult {
  const baseUrl = getPublicEnv().NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const adminOrderLink = `${baseUrl}/admin/orders/${input.orderId}`;
  const subject = `Neue Druckdaten für ${input.orderNumber}`;
  const text = [
    `Für die Bestellung ${input.orderNumber} wurden neue Druckdaten hochgeladen.`,
    `Kunden-E-Mail: ${input.customerEmail}`,
    "",
    `Admin-Link: ${adminOrderLink}`,
  ].join("\n");

  return {
    subject,
    text,
    html: renderShell({
      heading: "Neue Druckdaten eingegangen.",
      intro: `Für die Bestellung ${input.orderNumber} liegt eine neue Datei vor.`,
      actionLabel: "Bestellung im Admin öffnen",
      actionHref: adminOrderLink,
      bodyHtml: `
        <p style="margin:0;">Kunden-E-Mail: ${escapeHtml(input.customerEmail)}</p>
      `,
    }),
  };
}

export function quoteRequestReceivedCustomer(input: {
  companyName: string;
  productType?: string | null;
  quantity?: string | null;
}): TemplateResult {
  const subject = "Ihre Anfrage ist eingegangen – Labelpilot.de";
  const text = [
    "Vielen Dank für Ihre Anfrage.",
    "",
    "Wir prüfen Ihre Angaben zu Material, Größe, Menge und Verpackung und melden uns mit dem nächsten Schritt für Ihr Etikettenangebot.",
    "",
    `Firma: ${input.companyName}`,
    `Produkttyp: ${input.productType || "Nicht angegeben"}`,
    `Menge: ${input.quantity || "Nicht angegeben"}`,
  ].join("\n");

  return {
    subject,
    text,
    html: renderShell({
      heading: "Ihre Anfrage ist eingegangen.",
      intro:
        "Wir prüfen Ihre Angaben zu Material, Größe, Menge und Verpackung und melden uns mit dem nächsten Schritt.",
      bodyHtml: `
        <p style="margin:0 0 16px 0;"><strong>Firma:</strong> ${escapeHtml(input.companyName)}</p>
        <p style="margin:0 0 8px 0;"><strong>Produkttyp:</strong> ${escapeHtml(input.productType || "Nicht angegeben")}</p>
        <p style="margin:0;"><strong>Menge:</strong> ${escapeHtml(input.quantity || "Nicht angegeben")}</p>
      `,
    }),
  };
}

export function quoteRequestOpsNotification(input: {
  companyName: string;
  email: string;
  industry?: string | null;
  productType?: string | null;
  quantity?: string | null;
  recurringNeed?: string | null;
  source?: string | null;
  sourcePage?: string | null;
}): TemplateResult {
  const sourceLabel = getQuoteSourceLabel(input.source);
  const highlightedSourceLabel =
    input.source === QUOTE_SOURCE_WUNSCHFORMAT ? "WUNSCHFORMAT" : sourceLabel;
  const subject = "Neue B2B-Angebotsanfrage – Labelpilot.de";
  const text = [
    `Firma: ${input.companyName}`,
    `E-Mail: ${input.email}`,
    `Branche: ${input.industry || "Nicht angegeben"}`,
    `Produkttyp: ${input.productType || "Nicht angegeben"}`,
    `Menge: ${input.quantity || "Nicht angegeben"}`,
    `Wiederkehrender Bedarf: ${input.recurringNeed || "Nicht angegeben"}`,
    `Quelle: ${highlightedSourceLabel}`,
    `Herkunftsseite: ${input.sourcePage || "Nicht angegeben"}`,
  ].join("\n");

  return {
    subject,
    text,
    html: renderShell({
      heading: "Neue B2B-Angebotsanfrage.",
      intro: "Eine neue Angebotsanfrage wurde gespeichert.",
      bodyHtml: `
        <p style="margin:0 0 8px 0;"><strong>Firma:</strong> ${escapeHtml(input.companyName)}</p>
        <p style="margin:0 0 8px 0;"><strong>E-Mail:</strong> ${escapeHtml(input.email)}</p>
        <p style="margin:0 0 8px 0;"><strong>Branche:</strong> ${escapeHtml(input.industry || "Nicht angegeben")}</p>
        <p style="margin:0 0 8px 0;"><strong>Produkttyp:</strong> ${escapeHtml(input.productType || "Nicht angegeben")}</p>
        <p style="margin:0 0 8px 0;"><strong>Menge:</strong> ${escapeHtml(input.quantity || "Nicht angegeben")}</p>
        <p style="margin:0 0 8px 0;"><strong>Wiederkehrender Bedarf:</strong> ${escapeHtml(input.recurringNeed || "Nicht angegeben")}</p>
        <p style="margin:0 0 8px 0;"><strong>Quelle:</strong> <strong>${escapeHtml(highlightedSourceLabel)}</strong></p>
        <p style="margin:0;"><strong>Herkunftsseite:</strong> ${escapeHtml(input.sourcePage || "Nicht angegeben")}</p>
      `,
    }),
  };
}

export function quoteNeedsMoreInfoCustomer(input: {
  companyName: string;
  adminNote?: string | null;
}): TemplateResult {
  const subject = "Weitere Informationen benötigt – Labelpilot.de";
  const text = [
    `Vielen Dank, ${input.companyName}.`,
    "",
    "Für die Bearbeitung Ihrer Anfrage benötigen wir noch weitere Informationen.",
    input.adminNote ? `Hinweis: ${input.adminNote}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject,
    text,
    html: renderShell({
      heading: "Wir brauchen noch eine kurze Rückmeldung.",
      intro: "Für die Bearbeitung Ihrer Anfrage benötigen wir noch weitere Informationen.",
      bodyHtml: input.adminNote
        ? `<p style="margin:0;"><strong>Hinweis:</strong> ${escapeHtml(input.adminNote)}</p>`
        : `<p style="margin:0;">Bitte antworten Sie direkt auf diese E-Mail mit den fehlenden Angaben.</p>`,
    }),
  };
}

export function reorderReminder(input: {
  orderNumber: string;
  orderId: string;
  companyName?: string | null;
  quantity: number;
  material: string;
  clickToken: string;
}): TemplateResult {
  const baseUrl = getPublicEnv().NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const reorderLink = `${baseUrl}/de/kalkulator?reorder=${encodeURIComponent(input.orderId)}&ct=${encodeURIComponent(input.clickToken)}`;
  const subject = `Ihr Etiketten-Vorrat geht zur Neige – ${input.orderNumber}`;

  const text = [
    input.companyName ? `Guten Tag, ${input.companyName},` : "Guten Tag,",
    "",
    `Laut unserer Schätzung geht Ihr Vorrat aus der Bestellung ${input.orderNumber} bald zur Neige.`,
    `Material: ${formatMaterialLabel(input.material)} | Menge: ${input.quantity.toLocaleString("de-DE")} Stück`,
    "",
    "Jetzt nachbestellen:",
    reorderLink,
    "",
    "Sie können dieselbe Konfiguration wiederverwenden oder anpassen.",
  ].join("\n");

  return {
    subject,
    text,
    html: renderShell({
      heading: "Ihr Etiketten-Vorrat geht zur Neige.",
      intro: `Die Etiketten aus der Bestellung ${input.orderNumber} werden voraussichtlich bald aufgebraucht sein.`,
      actionLabel: "Jetzt nachbestellen",
      actionHref: reorderLink,
      bodyHtml: `
        <p style="margin:0 0 8px 0;"><strong>Material:</strong> ${escapeHtml(formatMaterialLabel(input.material))}</p>
        <p style="margin:0 0 16px 0;"><strong>Menge damals:</strong> ${escapeHtml(input.quantity.toLocaleString("de-DE"))} Stück</p>
        <p style="margin:0;color:#6B6560;font-size:14px;">Sie können dieselbe Konfiguration direkt wiederverwenden oder die Menge anpassen.</p>
      `,
    }),
  };
}

export function quoteSentCustomer(input: {
  companyName: string;
  adminNote?: string | null;
}): TemplateResult {
  const subject = "Ihr Angebot ist vorbereitet – Labelpilot.de";
  const text = [
    `Vielen Dank, ${input.companyName}.`,
    "",
    "Ihr Angebot wurde vorbereitet.",
    input.adminNote ? `Hinweis: ${input.adminNote}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject,
    text,
    html: renderShell({
      heading: "Ihr Angebot ist vorbereitet.",
      intro: "Wir haben Ihre Anfrage geprüft und das Angebot vorbereitet.",
      bodyHtml: input.adminNote
        ? `<p style="margin:0;"><strong>Hinweis:</strong> ${escapeHtml(input.adminNote)}</p>`
        : `<p style="margin:0;">Bitte antworten Sie direkt auf diese E-Mail, falls Rückfragen offen sind.</p>`,
    }),
  };
}
