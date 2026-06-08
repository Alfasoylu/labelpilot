import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { sendEmail } from "@/lib/email/send";
import { getServerEnv } from "@/lib/env";

const schema = z.object({
  firmenname: z.string().min(2).max(120).trim(),
  ustId: z.string().max(30).trim().optional(),
  ansprechpartner: z.string().min(2).max(100).trim(),
  email: z.string().email().max(200).trim(),
  telefon: z.string().max(30).trim().optional(),
  bestellvolumen: z.string().max(80).trim().optional(),
  nachricht: z.string().max(800).trim().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Eingabe" }, { status: 400 });
  }

  const d = parsed.data;
  const env = getServerEnv();
  const notifyTo = env.EMAIL_REPLY_TO ?? "info@labelpilot.de";

  const html = `
    <h2>Neue Auf-Rechnung-Anfrage</h2>
    <table cellpadding="6">
      <tr><td><strong>Firma</strong></td><td>${d.firmenname}</td></tr>
      <tr><td><strong>USt-IdNr.</strong></td><td>${d.ustId ?? "–"}</td></tr>
      <tr><td><strong>Ansprechpartner</strong></td><td>${d.ansprechpartner}</td></tr>
      <tr><td><strong>E-Mail</strong></td><td>${d.email}</td></tr>
      <tr><td><strong>Telefon</strong></td><td>${d.telefon ?? "–"}</td></tr>
      <tr><td><strong>Monatl. Bestellvolumen</strong></td><td>${d.bestellvolumen ?? "–"}</td></tr>
      <tr><td><strong>Nachricht</strong></td><td>${d.nachricht ?? "–"}</td></tr>
    </table>
  `;
  const text = `Auf-Rechnung-Anfrage\nFirma: ${d.firmenname}\nUSt-IdNr.: ${d.ustId ?? "–"}\nAnsprechpartner: ${d.ansprechpartner}\nE-Mail: ${d.email}\nTelefon: ${d.telefon ?? "–"}\nBestellvolumen: ${d.bestellvolumen ?? "–"}\nNachricht: ${d.nachricht ?? "–"}`;

  await sendEmail({
    to: notifyTo,
    subject: `Auf-Rechnung-Anfrage: ${d.firmenname}`,
    html,
    text,
  });

  return NextResponse.json({ ok: true });
}
