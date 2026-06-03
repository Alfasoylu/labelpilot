"use server";

import { z } from "zod";

import { getPrismaClient } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/send";
import {
  quoteRequestOpsNotification,
  quoteRequestReceivedCustomer,
} from "@/lib/email/templates/lifecycle";
import { getServerEnv } from "@/lib/env";
import { computeLeadScore } from "@/lib/leads/scoring";
import {
  normalizeQuoteSource,
  QUOTE_SOURCE_WUNSCHFORMAT,
} from "@/lib/quotes/source";

const quoteRequestSchema = z.object({
  companyName: z.string().trim().min(1, "Bitte geben Sie den Firmennamen ein."),
  contactName: z.string().trim().optional(),
  email: z.string().trim().email("Bitte geben Sie eine gueltige E-Mail-Adresse ein."),
  phone: z.string().trim().optional(),
  country: z.string().trim().min(1),
  website: z.string().trim().optional(),
  industry: z.string().trim().optional(),
  productType: z.string().trim().optional(),
  labelSize: z.string().trim().optional(),
  material: z.string().trim().optional(),
  quantity: z.string().trim().min(1, "Bitte waehlen Sie eine Menge aus."),
  recurringNeed: z.string().trim().optional(),
  hasArtwork: z.enum(["ja", "nein", "teilweise"]),
  targetDeliveryDate: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  source: z.string().trim().optional(),
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
    website: formData.get("website"),
    industry: formData.get("industry"),
    productType: formData.get("productType"),
    labelSize: formData.get("labelSize"),
    material: formData.get("material"),
    quantity: formData.get("quantity"),
    recurringNeed: formData.get("recurringNeed"),
    hasArtwork: formData.get("hasArtwork"),
    targetDeliveryDate: formData.get("targetDeliveryDate"),
    notes: formData.get("notes"),
    source: formData.get("source"),
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
      message: parsed.error.issues[0]?.message ?? "Bitte pruefen Sie Ihre Angaben.",
    };
  }

  const values = parsed.data;
  const prisma = getPrismaClient();
  const warnings: string[] = [];
  const normalizedSource = normalizeQuoteSource(values.source);
  const artworkValue =
    values.hasArtwork === "ja" ? true : values.hasArtwork === "nein" ? false : null;
  const targetDeliveryDate = values.targetDeliveryDate
    ? new Date(values.targetDeliveryDate)
    : null;
  const { score, quality } = computeLeadScore({
    type: "QUOTE_REQUEST",
    country: values.country,
    industry: values.industry,
    quantity: values.quantity,
    recurringNeed: values.recurringNeed,
    website: values.website,
    hasArtwork: artworkValue,
    notes: values.notes,
  });
  const sourcePage =
    normalizedSource === QUOTE_SOURCE_WUNSCHFORMAT
      ? "/de/wunschformat"
      : values.sourcePage || "/de/angebot-anfordern";
  const leadSourceType =
    normalizedSource === QUOTE_SOURCE_WUNSCHFORMAT
      ? QUOTE_SOURCE_WUNSCHFORMAT
      : "public_quote_form";

  if (prisma) {
    try {
      await prisma.lead.create({
        data: {
          type: "QUOTE_REQUEST",
          score,
          quality,
          email: values.email,
          companyName: values.companyName,
          contactName: values.contactName || null,
          phone: values.phone || null,
          country: values.country,
          website: values.website || null,
          industry: values.industry || null,
          productType: values.productType || null,
          labelSize: values.labelSize || null,
          material: values.material || null,
          quantity: values.quantity,
          recurringNeed: values.recurringNeed || null,
          hasArtwork: artworkValue,
          targetDeliveryDate,
          notes: values.notes || null,
          sourceType: leadSourceType,
          sourcePage,
          landingPage: values.landingPage || "/de/angebot-anfordern",
          utmSource: values.utmSource || null,
          utmMedium: values.utmMedium || null,
          utmCampaign: values.utmCampaign || null,
          utmTerm: values.utmTerm || null,
          utmContent: values.utmContent || null,
          referrer: values.referrer || null,
        },
      });

      const quoteRequestData = {
        email: values.email,
        companyName: values.companyName,
        contactName: values.contactName || null,
        phone: values.phone || null,
        country: values.country,
        website: values.website || null,
        industry: values.industry || null,
        productType: values.productType || null,
        labelSize: values.labelSize || null,
        material: values.material || null,
        quantity: values.quantity,
        recurringNeed: values.recurringNeed || null,
        hasArtwork: artworkValue,
        targetDeliveryDate,
        notes: values.notes || null,
        source: normalizedSource,
        sourcePage,
      };

      await prisma.quoteRequest.create({
        data: quoteRequestData as never,
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

  const customerTemplate = quoteRequestReceivedCustomer({
    companyName: values.companyName,
    productType: values.productType,
    quantity: values.quantity,
  });
  const customerEmailResult = await sendEmail({
    to: values.email,
    subject: customerTemplate.subject,
    html: customerTemplate.html,
    text: customerTemplate.text,
  });

  const adminInbox = getServerEnv().ADMIN_NOTIFY_EMAIL || getServerEnv().EMAIL_REPLY_TO;
  const opsTemplate = quoteRequestOpsNotification({
    companyName: values.companyName,
    email: values.email,
    industry: values.industry,
    productType: values.productType,
    quantity: values.quantity,
    recurringNeed: values.recurringNeed,
    sourcePage,
  });
  const adminEmailResult = adminInbox
    ? await sendEmail({
        to: adminInbox,
        subject: opsTemplate.subject,
        html: opsTemplate.html,
        text: opsTemplate.text,
      })
    : { ok: true };

  if (!customerEmailResult.ok || !adminEmailResult.ok) {
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
      "Vielen Dank. Ihre Anfrage ist eingegangen. Wir pruefen Ihre Angaben und melden uns mit dem naechsten Schritt.",
  };
}
