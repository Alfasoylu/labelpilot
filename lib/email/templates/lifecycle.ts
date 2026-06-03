import { getPublicEnv } from "@/lib/env";
import { getQuoteSourceLabel, QUOTE_SOURCE_WUNSCHFORMAT } from "@/lib/quotes/source";

type TemplateResult = {
  subject: string;
  html: string;
  text: string;
};

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
      ? `<p style="margin:24px 0;"><a href="${escapeHtml(input.actionHref)}" style="display:inline-block;padding:12px 18px;border-radius:10px;background:#2563EB;color:#FFFFFF;text-decoration:none;font-weight:600;">${escapeHtml(input.actionLabel)}</a></p>`
      : "";

  return `<!doctype html>
<html lang="de">
  <body style="margin:0;padding:24px;background:#F8FAFC;color:#0B1220;font-family:Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:18px;padding:32px;">
      <p style="margin:0 0 8px 0;color:#64748B;font-size:14px;">Labelpilot.de</p>
      <h1 style="margin:0 0 16px 0;font-size:28px;line-height:1.2;">${escapeHtml(input.heading)}</h1>
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
}): TemplateResult {
  const orderLink = getOrderLink(input.orderId, input.uploadToken);
  const subject = `Ihre Bestellung ${input.orderNumber} ist eingegangen`;
  const text = [
    `Vielen Dank fuer Ihre Bestellung ${input.orderNumber}.`,
    "",
    "Bitte laden Sie jetzt Ihre Druckdaten hoch oder speichern Sie den Link fuer spaeter:",
    orderLink,
    "",
    "Bitte bewahren Sie diesen Link gut auf. Ueber ihn erreichen Sie den Upload und spaeter auch den Proof.",
  ].join("\n");

  return {
    subject,
    text,
    html: renderShell({
      heading: "Vielen Dank fuer Ihre Bestellung.",
      intro: `Ihre Bestellung ${input.orderNumber} wurde erfasst.`,
      actionLabel: "Druckdaten hochladen",
      actionHref: orderLink,
      bodyHtml: `
        <p style="margin:0 0 16px 0;">Bitte laden Sie jetzt Ihre Druckdaten hoch oder speichern Sie den Link fuer spaeter.</p>
        <p style="margin:0;">Bitte bewahren Sie diesen Link gut auf. Ueber ihn erreichen Sie den Upload und spaeter auch den Proof.</p>
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
  const subject = `Korrektur erforderlich fuer ${input.orderNumber}`;
  const escapedNote = escapeHtml(input.adminNote);
  const text = [
    `Fuer Ihre Bestellung ${input.orderNumber} benoetigen wir eine korrigierte Druckdatei.`,
    "",
    `Hinweis: ${input.adminNote}`,
    "",
    "Bitte laden Sie die korrigierte Datei ueber diesen Link hoch:",
    orderLink,
  ].join("\n");

  return {
    subject,
    text,
    html: renderShell({
      heading: "Ihre Druckdatei braucht eine Korrektur.",
      intro: `Fuer die Bestellung ${input.orderNumber} benoetigen wir eine aktualisierte Datei.`,
      actionLabel: "Korrigierte Datei hochladen",
      actionHref: orderLink,
      bodyHtml: `
        <p style="margin:0 0 16px 0;"><strong>Hinweis:</strong> ${escapedNote}</p>
        <p style="margin:0;">Bitte laden Sie die korrigierte Datei ueber den Link oben hoch.</p>
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
  const subject = `Proof bereit fuer ${input.orderNumber}`;
  const text = [
    `Fuer Ihre Bestellung ${input.orderNumber} steht ein Proof zur Freigabe bereit.`,
    "",
    "Bitte pruefen Sie den Proof ueber diesen Link und geben Sie ihn frei oder senden Sie einen Aenderungswunsch:",
    orderLink,
  ].join("\n");

  return {
    subject,
    text,
    html: renderShell({
      heading: "Ihr Proof steht bereit.",
      intro: `Fuer die Bestellung ${input.orderNumber} koennen Sie jetzt den Proof pruefen.`,
      actionLabel: "Proof ansehen",
      actionHref: orderLink,
      bodyHtml: `
        <p style="margin:0;">Bitte pruefen Sie den Proof ueber den Link oben und geben Sie ihn frei oder senden Sie einen Aenderungswunsch.</p>
      `,
    }),
  };
}

export function proofApproved(input: {
  orderNumber: string;
}): TemplateResult {
  const subject = `Proof freigegeben fuer ${input.orderNumber}`;
  const text = [
    `Vielen Dank. Der Proof fuer Ihre Bestellung ${input.orderNumber} wurde freigegeben.`,
    "",
    "Es ist keine weitere Aktion noetig. Wir bereiten den naechsten Produktionsschritt vor.",
  ].join("\n");

  return {
    subject,
    text,
    html: renderShell({
      heading: "Proof erfolgreich freigegeben.",
      intro: `Vielen Dank. Der Proof fuer die Bestellung ${input.orderNumber} wurde bestaetigt.`,
      bodyHtml: `
        <p style="margin:0;">Es ist keine weitere Aktion noetig. Wir bereiten den naechsten Produktionsschritt vor.</p>
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
        <p style="margin:0 0 8px 0;"><strong>Versanddienstleister:</strong> ${escapeHtml(input.shippingCarrier || "Wird separat bestaetigt")}</p>
        <p style="margin:0 0 8px 0;"><strong>Trackingnummer:</strong> ${escapeHtml(input.trackingNumber || "Noch nicht verfuegbar")}</p>
        <p style="margin:0;">Den aktuellen Status Ihrer Bestellung finden Sie auch ueber Ihren Bestelllink.</p>
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
  const subject = `Neue Druckdaten fuer ${input.orderNumber}`;
  const text = [
    `Fuer die Bestellung ${input.orderNumber} wurden neue Druckdaten hochgeladen.`,
    `Kunden-E-Mail: ${input.customerEmail}`,
    "",
    `Admin-Link: ${adminOrderLink}`,
  ].join("\n");

  return {
    subject,
    text,
    html: renderShell({
      heading: "Neue Druckdaten eingegangen.",
      intro: `Fuer die Bestellung ${input.orderNumber} liegt eine neue Datei vor.`,
      actionLabel: "Bestellung im Admin oeffnen",
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
    "Vielen Dank fuer Ihre Anfrage.",
    "",
    "Wir pruefen Ihre Angaben zu Material, Groesse, Menge und Verpackung und melden uns mit dem naechsten Schritt fuer Ihr Etikettenangebot.",
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
        "Wir pruefen Ihre Angaben zu Material, Groesse, Menge und Verpackung und melden uns mit dem naechsten Schritt.",
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
  const subject = "Weitere Informationen benoetigt – Labelpilot.de";
  const text = [
    `Vielen Dank, ${input.companyName}.`,
    "",
    "Fuer die Bearbeitung Ihrer Anfrage benoetigen wir noch weitere Informationen.",
    input.adminNote ? `Hinweis: ${input.adminNote}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject,
    text,
    html: renderShell({
      heading: "Wir brauchen noch eine kurze Rueckmeldung.",
      intro: "Fuer die Bearbeitung Ihrer Anfrage benoetigen wir noch weitere Informationen.",
      bodyHtml: input.adminNote
        ? `<p style="margin:0;"><strong>Hinweis:</strong> ${escapeHtml(input.adminNote)}</p>`
        : `<p style="margin:0;">Bitte antworten Sie direkt auf diese E-Mail mit den fehlenden Angaben.</p>`,
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
      intro: "Wir haben Ihre Anfrage geprueft und das Angebot vorbereitet.",
      bodyHtml: input.adminNote
        ? `<p style="margin:0;"><strong>Hinweis:</strong> ${escapeHtml(input.adminNote)}</p>`
        : `<p style="margin:0;">Bitte antworten Sie direkt auf diese E-Mail, falls Rueckfragen offen sind.</p>`,
    }),
  };
}
