import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getPrismaClient } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/send";
import { getServerEnv } from "@/lib/env";
import { computeLeadScore } from "@/lib/leads/scoring";

export const runtime = "nodejs";

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

  // Escape customer-supplied strings before placing them into the operator email HTML.
  const esc = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const html = `
    <h2>Neue Auf-Rechnung-Anfrage</h2>
    <table cellpadding="6">
      <tr><td><strong>Firma</strong></td><td>${esc(d.firmenname)}</td></tr>
      <tr><td><strong>USt-IdNr.</strong></td><td>${d.ustId ? esc(d.ustId) : "–"}</td></tr>
      <tr><td><strong>Ansprechpartner</strong></td><td>${esc(d.ansprechpartner)}</td></tr>
      <tr><td><strong>E-Mail</strong></td><td>${esc(d.email)}</td></tr>
      <tr><td><strong>Telefon</strong></td><td>${d.telefon ? esc(d.telefon) : "–"}</td></tr>
      <tr><td><strong>Monatl. Bestellvolumen</strong></td><td>${d.bestellvolumen ? esc(d.bestellvolumen) : "–"}</td></tr>
      <tr><td><strong>Nachricht</strong></td><td>${d.nachricht ? esc(d.nachricht) : "–"}</td></tr>
    </table>
  `;
  const text = `Auf-Rechnung-Anfrage\nFirma: ${d.firmenname}\nUSt-IdNr.: ${d.ustId ?? "–"}\nAnsprechpartner: ${d.ansprechpartner}\nE-Mail: ${d.email}\nTelefon: ${d.telefon ?? "–"}\nBestellvolumen: ${d.bestellvolumen ?? "–"}\nNachricht: ${d.nachricht ?? "–"}`;

  // Persist the lead first so it is never lost if the operator email fails
  // (sendEmail never throws — it returns {ok:false} on misconfiguration/outage).
  let persisted = false;
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const { score, quality } = computeLeadScore({
        type: "BULK_ORDER_INTEREST",
        country: "DE",
        quantity: d.bestellvolumen,
        notes: d.nachricht,
      });
      await prisma.lead.create({
        data: {
          type: "BULK_ORDER_INTEREST",
          score,
          quality,
          email: d.email,
          companyName: d.firmenname,
          contactName: d.ansprechpartner,
          phone: d.telefon || null,
          quantity: d.bestellvolumen || null,
          notes: d.nachricht || null,
          sourceType: "auf_rechnung_form",
          sourcePage: "/de/auf-rechnung-beantragen",
        },
      });
      persisted = true;
    } catch (error) {
      console.error("Auf-Rechnung-Lead konnte nicht gespeichert werden:", error);
    }
  }

  const emailResult = await sendEmail({
    to: notifyTo,
    subject: `Auf-Rechnung-Anfrage: ${d.firmenname}`,
    html,
    text,
  });

  if (!emailResult.ok) {
    console.error(`Auf-Rechnung-Benachrichtigung fehlgeschlagen für ${d.firmenname}.`);
  }

  // Only fail the request if BOTH the DB write and the email were lost.
  if (!persisted && !emailResult.ok) {
    return NextResponse.json(
      { error: "Anfrage konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
