"use server";

import { z } from "zod";

import { getPrismaClient } from "@/lib/db/prisma";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { getServerEnv } from "@/lib/env";
import { computeLeadScore } from "@/lib/leads/scoring";

function isValidIsoCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

const optionalIsoDateString = z
  .string()
  .trim()
  .optional()
  .refine((value) => {
    if (!value) {
      return true;
    }

    return isValidIsoCalendarDate(value);
  }, "Bitte geben Sie einen gültigen Liefertermin ein.");

const sampleBoxRequestSchema = z.object({
  companyName: z.string().trim().min(1, "Bitte geben Sie den Firmennamen ein."),
  contactName: z.string().trim().optional(),
  email: z.string().trim().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  phone: z.string().trim().optional(),
  country: z.string().trim().min(1),
  website: z.string().trim().optional(),
  industry: z.string().trim().optional(),
  productType: z.string().trim().min(1, "Bitte wählen Sie ein Interesse aus."),
  quantity: z.string().trim().min(1, "Bitte wählen Sie eine Menge aus."),
  recurringNeed: z.string().trim().optional(),
  targetDeliveryDate: optionalIsoDateString,
  notes: z.string().trim().optional(),
  shippingAddress: z.string().trim().min(1, "Bitte geben Sie Lieferadresse oder PLZ an."),
  utmSource: z.string().trim().optional(),
  utmMedium: z.string().trim().optional(),
  utmCampaign: z.string().trim().optional(),
  utmTerm: z.string().trim().optional(),
  utmContent: z.string().trim().optional(),
  referrer: z.string().trim().optional(),
  landingPage: z.string().trim().optional(),
  sourcePage: z.string().trim().optional(),
  consent: z.string().refine((value) => value === "yes", {
    message: "Bitte akzeptieren Sie die Datenschutzhinweise.",
  }),
});

export type SampleBoxFormState = {
  status: "idle" | "success" | "warning" | "error";
  message: string;
};

export async function submitSampleBoxRequest(
  _previousState: SampleBoxFormState,
  formData: FormData,
): Promise<SampleBoxFormState> {
  const parsed = sampleBoxRequestSchema.safeParse({
    companyName: formData.get("companyName"),
    contactName: formData.get("contactName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    country: formData.get("country"),
    website: formData.get("website"),
    industry: formData.get("industry"),
    productType: formData.get("productType"),
    quantity: formData.get("quantity"),
    recurringNeed: formData.get("recurringNeed"),
    targetDeliveryDate: formData.get("targetDeliveryDate"),
    notes: formData.get("notes"),
    shippingAddress: formData.get("shippingAddress"),
    utmSource: formData.get("utmSource"),
    utmMedium: formData.get("utmMedium"),
    utmCampaign: formData.get("utmCampaign"),
    utmTerm: formData.get("utmTerm"),
    utmContent: formData.get("utmContent"),
    referrer: formData.get("referrer"),
    landingPage: formData.get("landingPage"),
    sourcePage: formData.get("sourcePage"),
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
  const targetDeliveryDate = values.targetDeliveryDate
    ? new Date(values.targetDeliveryDate)
    : null;
  const { score, quality } = computeLeadScore({
    type: "SAMPLE_BOX_REQUEST",
    country: values.country,
    industry: values.industry,
    quantity: values.quantity,
    recurringNeed: values.recurringNeed,
    website: values.website,
    notes: `${values.productType}\n${values.shippingAddress}\n${values.notes ?? ""}`,
  });

  if (prisma) {
    try {
      await prisma.lead.create({
        data: {
          type: "SAMPLE_BOX_REQUEST",
          status: "NEW",
          score,
          quality,
          email: values.email,
          companyName: values.companyName,
          contactName: values.contactName || null,
          phone: values.phone || null,
          country: values.country,
          website: values.website || null,
          industry: values.industry || null,
          productType: values.productType,
          quantity: values.quantity,
          recurringNeed: values.recurringNeed || null,
          targetDeliveryDate,
          notes: [
            `Lieferadresse/PLZ: ${values.shippingAddress}`,
            values.notes || null,
          ]
            .filter(Boolean)
            .join("\n"),
          sourceType: "public_sample_box_form",
          sourcePage: values.sourcePage || "/de/musterbox",
          landingPage: values.landingPage || "/de/musterbox",
          utmSource: values.utmSource || null,
          utmMedium: values.utmMedium || null,
          utmCampaign: values.utmCampaign || null,
          utmTerm: values.utmTerm || null,
          utmContent: values.utmContent || null,
          referrer: values.referrer || null,
        },
      });
    } catch (error) {
      console.error("[sample-box-request] DB write failed:", error);
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
    subject: "Neue Musterbox-Anfrage über Labelpilot.de",
    text:
      `Neue Musterbox-Anfrage von ${values.companyName}. Interesse: ${values.productType}. Menge: ${values.quantity}.`,
    html: `
      <p>Neue Musterbox-Anfrage von <strong>${values.companyName}</strong>.</p>
      <p><strong>Ansprechpartner:</strong> ${values.contactName || "Nicht angegeben"}</p>
      <p><strong>E-Mail:</strong> ${values.email}</p>
      <p><strong>Telefon:</strong> ${values.phone || "Nicht angegeben"}</p>
      <p><strong>Land:</strong> ${values.country}</p>
      <p><strong>Website / Shop:</strong> ${values.website || "Nicht angegeben"}</p>
      <p><strong>Branche:</strong> ${values.industry || "Nicht angegeben"}</p>
      <p><strong>Interesse:</strong> ${values.productType}</p>
      <p><strong>Voraussichtliche Menge:</strong> ${values.quantity}</p>
      <p><strong>Wiederkehrender Bedarf:</strong> ${values.recurringNeed || "Nicht angegeben"}</p>
      <p><strong>Lieferadresse / PLZ:</strong> ${values.shippingAddress}</p>
      <p><strong>Notizen:</strong> ${values.notes || "Keine"}</p>
      <p><strong>Lead Score:</strong> ${score} (${quality})</p>
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
      "Vielen Dank. Wir prüfen Ihre Anfrage und melden uns mit dem nächsten Schritt zur Musterbox.",
  };
}
