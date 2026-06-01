"use server";

import { z } from "zod";

import { getPrismaClient } from "@/lib/db/prisma";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { getServerEnv } from "@/lib/env";

const quoteRequestSchema = z.object({
  companyName: z.string().trim().min(1, "Bitte geben Sie den Firmennamen ein."),
  contactName: z.string().trim().optional(),
  email: z.string().trim().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  phone: z.string().trim().optional(),
  country: z.string().trim().min(1),
  industry: z.string().trim().optional(),
  productType: z.string().trim().optional(),
  labelSize: z.string().trim().optional(),
  material: z.string().trim().optional(),
  quantity: z.string().trim().min(1, "Bitte wählen Sie eine Menge aus."),
  recurringNeed: z.string().trim().optional(),
  hasArtwork: z.enum(["ja", "nein", "teilweise"]),
  targetDeliveryDate: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  consent: z.string().refine((value) => value === "yes", {
    message: "Bitte akzeptieren Sie die Datenschutzhinweise.",
  }),
});

export type QuoteFormState = {
  status: "idle" | "success" | "warning" | "error";
  message: string;
};

export async function submitQuoteRequest(
  _previousState: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormState> {
  const parsed = quoteRequestSchema.safeParse({
    companyName: formData.get("companyName"),
    contactName: formData.get("contactName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    country: formData.get("country"),
    industry: formData.get("industry"),
    productType: formData.get("productType"),
    labelSize: formData.get("labelSize"),
    material: formData.get("material"),
    quantity: formData.get("quantity"),
    recurringNeed: formData.get("recurringNeed"),
    hasArtwork: formData.get("hasArtwork"),
    targetDeliveryDate: formData.get("targetDeliveryDate"),
    notes: formData.get("notes"),
    consent: formData.get("consent"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Bitte prüfen Sie Ihre Angaben.",
    };
  }

  const values = parsed.data;
  const prisma = getPrismaClient();
  const warnings: string[] = [];
  const artworkValue =
    values.hasArtwork === "ja" ? true : values.hasArtwork === "nein" ? false : null;
  const targetDeliveryDate = values.targetDeliveryDate
    ? new Date(values.targetDeliveryDate)
    : null;

  if (prisma) {
    try {
      await prisma.lead.create({
        data: {
          type: "QUOTE_REQUEST",
          email: values.email,
          companyName: values.companyName,
          contactName: values.contactName || null,
          phone: values.phone || null,
          country: values.country,
          industry: values.industry || null,
          productType: values.productType || null,
          labelSize: values.labelSize || null,
          material: values.material || null,
          quantity: values.quantity,
          recurringNeed: values.recurringNeed || null,
          hasArtwork: artworkValue,
          targetDeliveryDate,
          notes: values.notes || null,
          sourceType: "public_quote_form",
          sourcePage: "/de/angebot-anfordern",
          landingPage: "/de/angebot-anfordern",
        },
      });

      await prisma.quoteRequest.create({
        data: {
          email: values.email,
          companyName: values.companyName,
          contactName: values.contactName || null,
          phone: values.phone || null,
          country: values.country,
          industry: values.industry || null,
          productType: values.productType || null,
          labelSize: values.labelSize || null,
          material: values.material || null,
          quantity: values.quantity,
          recurringNeed: values.recurringNeed || null,
          hasArtwork: artworkValue,
          targetDeliveryDate,
          notes: values.notes || null,
          sourcePage: "/de/angebot-anfordern",
        },
      });
    } catch (error) {
      console.error("[quote-request] DB write failed:", error);
      warnings.push(
        "Die Anfrage konnte aktuell nicht in der Datenbank gespeichert werden.",
      );
    }
  } else {
    warnings.push("Die Datenbank ist aktuell noch nicht konfiguriert.");
  }

  const adminInbox = getServerEnv().EMAIL_REPLY_TO;
  const emailResult = await sendTransactionalEmail({
    to: adminInbox || values.email,
    subject: "Neue Angebotsanfrage über Labelpilot.de",
    text:
      `Neue Angebotsanfrage von ${values.companyName}. Produkttyp: ${values.productType || "Nicht angegeben"}. Menge: ${values.quantity}.`,
    html: `
      <p>Neue Angebotsanfrage von <strong>${values.companyName}</strong>.</p>
      <p><strong>Ansprechpartner:</strong> ${values.contactName || "Nicht angegeben"}</p>
      <p><strong>E-Mail:</strong> ${values.email}</p>
      <p><strong>Telefon:</strong> ${values.phone || "Nicht angegeben"}</p>
      <p><strong>Land:</strong> ${values.country}</p>
      <p><strong>Branche:</strong> ${values.industry || "Nicht angegeben"}</p>
      <p><strong>Produkttyp:</strong> ${values.productType || "Nicht angegeben"}</p>
      <p><strong>Größe:</strong> ${values.labelSize || "Nicht angegeben"}</p>
      <p><strong>Material:</strong> ${values.material || "Nicht angegeben"}</p>
      <p><strong>Menge:</strong> ${values.quantity}</p>
      <p><strong>Wiederkehrender Bedarf:</strong> ${values.recurringNeed || "Nicht angegeben"}</p>
      <p><strong>Druckdatei vorhanden:</strong> ${values.hasArtwork}</p>
      <p><strong>Notizen:</strong> ${values.notes || "Keine"}</p>
    `,
  });

  if (!emailResult.ok) {
    warnings.push("Die E-Mail-Benachrichtigung ist aktuell noch nicht konfiguriert.");
  }

  if (warnings.length) {
    return {
      status: "warning",
      message: `Anfrage erfasst, aber nicht alle Systeme waren aktiv: ${warnings.join(" ")}`,
    };
  }

  return {
    status: "success",
    message:
      "Vielen Dank für Ihre Anfrage. Wir prüfen Ihre Angaben zu Material, Größe, Menge und Verpackung und melden uns mit dem nächsten Schritt.",
  };
}
