import { getPublicEnv } from "@/lib/env";

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
