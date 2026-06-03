import { NextResponse } from "next/server";
import { z } from "zod";

import { getPrismaClient } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/send";
import {
  quoteNeedsMoreInfoCustomer,
  quoteSentCustomer,
} from "@/lib/email/templates/lifecycle";

const quoteUpdateSchema = z.object({
  status: z.enum([
    "NEW",
    "UNDER_REVIEW",
    "NEEDS_MORE_INFO",
    "QUOTE_SENT",
    "ACCEPTED",
    "REJECTED",
    "EXPIRED",
    "CONVERTED_TO_ORDER",
  ]),
  adminNote: z.string().trim().optional(),
});

function buildRedirectUrl(request: Request, quoteId: string, search: Record<string, string>) {
  const url = new URL(`/admin/quotes/${quoteId}`, request.url);
  for (const [key, value] of Object.entries(search)) {
    url.searchParams.set(key, value);
  }
  return url;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ quoteId: string }> },
) {
  const prisma = getPrismaClient();
  const { quoteId } = await context.params;

  if (!prisma) {
    return NextResponse.redirect(
      buildRedirectUrl(request, quoteId, {
        error: "Datenbankverbindung fehlt.",
      }),
      { status: 303 },
    );
  }

  const formData = await request.formData();
  const parsed = quoteUpdateSchema.safeParse({
    status: formData.get("status"),
    adminNote: formData.get("adminNote"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(
      buildRedirectUrl(request, quoteId, {
        error: "Bitte pruefen Sie die Quote-Angaben.",
      }),
      { status: 303 },
    );
  }

  const existing = await prisma.quoteRequest.findUnique({
    where: { id: quoteId },
  });

  if (!existing) {
    return NextResponse.redirect(
      buildRedirectUrl(request, quoteId, {
        error: "Angebotsanfrage nicht gefunden.",
      }),
      { status: 303 },
    );
  }

  const updated = await prisma.quoteRequest.update({
    where: { id: quoteId },
    data: {
      status: parsed.data.status,
      adminNote: parsed.data.adminNote || null,
    },
  });

  if (updated.status === "NEEDS_MORE_INFO") {
    const template = quoteNeedsMoreInfoCustomer({
      companyName: updated.companyName,
      adminNote: updated.adminNote,
    });
    await sendEmail({
      to: updated.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  if (updated.status === "QUOTE_SENT") {
    const template = quoteSentCustomer({
      companyName: updated.companyName,
      adminNote: updated.adminNote,
    });
    await sendEmail({
      to: updated.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  return NextResponse.redirect(
    buildRedirectUrl(request, quoteId, {
      message: "Angebotsanfrage gespeichert.",
    }),
    { status: 303 },
  );
}
