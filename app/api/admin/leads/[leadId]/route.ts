import { NextResponse } from "next/server";
import { z } from "zod";

import { getPrismaClient } from "@/lib/db/prisma";

const leadUpdateSchema = z.object({
  status: z.enum([
    "NEW",
    "QUALIFYING",
    "QUALIFIED",
    "SAMPLE_SENT",
    "QUOTE_NEEDED",
    "QUOTE_SENT",
    "FOLLOW_UP",
    "WON",
    "LOST",
    "DISQUALIFIED",
  ]),
  nextFollowUpAt: z
    .union([z.literal(""), z.string().trim()])
    .transform((value) => (value === "" ? null : value)),
  followUpReason: z.string().trim().optional(),
});

function buildRedirectUrl(request: Request, leadId: string, search: Record<string, string>) {
  const url = new URL(`/admin/leads/${leadId}`, request.url);
  for (const [key, value] of Object.entries(search)) {
    url.searchParams.set(key, value);
  }
  return url;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ leadId: string }> },
) {
  const prisma = getPrismaClient();
  const { leadId } = await context.params;

  if (!prisma) {
    return NextResponse.redirect(
      buildRedirectUrl(request, leadId, {
        error: "Datenbankverbindung fehlt.",
      }),
      { status: 303 },
    );
  }

  const formData = await request.formData();
  const returnToValue = formData.get("returnTo");
  const returnTo =
    typeof returnToValue === "string" && returnToValue.startsWith("/admin/leads")
      ? returnToValue
      : null;
  const parsed = leadUpdateSchema.safeParse({
    status: formData.get("status"),
    nextFollowUpAt: formData.get("nextFollowUpAt"),
    followUpReason: formData.get("followUpReason"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(
      buildRedirectUrl(request, leadId, {
        error: "Bitte prüfen Sie die Lead-Angaben.",
        ...(returnTo ? { returnTo } : {}),
      }),
      { status: 303 },
    );
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      status: parsed.data.status,
      nextFollowUpAt: parsed.data.nextFollowUpAt
        ? new Date(parsed.data.nextFollowUpAt)
        : null,
      followUpReason: parsed.data.followUpReason || null,
    },
  });

  return NextResponse.redirect(
    buildRedirectUrl(request, leadId, {
      message: "Lead gespeichert.",
      ...(returnTo ? { returnTo } : {}),
    }),
    { status: 303 },
  );
}
