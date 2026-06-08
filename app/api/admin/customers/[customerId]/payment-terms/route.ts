import { NextResponse } from "next/server";
import { z } from "zod";

import { getPrismaClient } from "@/lib/db/prisma";

const schema = z.object({
  paymentTermsApproved: z.enum(["true", "false"]),
  paymentTermsNetDays: z
    .union([z.literal(""), z.string().trim()])
    .transform((v) => (v === "" ? null : Number.parseInt(v, 10)))
    .refine((v) => v === null || (Number.isInteger(v) && v >= 0 && v <= 120), {
      message: "Ungültiges Zahlungsziel.",
    }),
});

function buildRedirectUrl(request: Request, customerId: string, search: Record<string, string>) {
  const url = new URL(`/admin/customers/${customerId}`, request.url);
  for (const [key, value] of Object.entries(search)) {
    url.searchParams.set(key, value);
  }
  return url;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ customerId: string }> },
) {
  const prisma = getPrismaClient();
  const { customerId } = await context.params;

  if (!prisma) {
    return NextResponse.redirect(
      buildRedirectUrl(request, customerId, { error: "Datenbankverbindung fehlt." }),
      { status: 303 },
    );
  }

  const formData = await request.formData();
  const parsed = schema.safeParse({
    paymentTermsApproved: formData.get("paymentTermsApproved"),
    paymentTermsNetDays: formData.get("paymentTermsNetDays"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(
      buildRedirectUrl(request, customerId, { error: "Bitte prüfen Sie die Angaben." }),
      { status: 303 },
    );
  }

  const approved = parsed.data.paymentTermsApproved === "true";

  try {
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        paymentTermsApproved: approved,
        // Default to Net-15 when approving without an explicit value.
        paymentTermsNetDays: approved ? parsed.data.paymentTermsNetDays ?? 15 : parsed.data.paymentTermsNetDays,
      },
    });
  } catch {
    return NextResponse.redirect(
      buildRedirectUrl(request, customerId, { error: "Speichern fehlgeschlagen." }),
      { status: 303 },
    );
  }

  return NextResponse.redirect(
    buildRedirectUrl(request, customerId, { message: "Zahlungskonditionen gespeichert." }),
    { status: 303 },
  );
}
