import { NextResponse } from "next/server";
import { z } from "zod";

import { getPrismaClient } from "@/lib/db/prisma";
import { getAdminActorFromRequest } from "@/lib/security/admin-basic-auth";

const noteSchema = z.object({
  noteType: z.enum(["INTERNAL", "CUSTOMER_VISIBLE", "PRODUCTION", "SHIPPING", "PAYMENT", "REPRINT"]),
  isCustomerVisible: z.union([z.literal("yes"), z.literal("no")]).default("no"),
  body: z.string().trim().min(1, "Bitte geben Sie eine Notiz ein."),
});

function buildRedirectUrl(request: Request, orderId: string, search: Record<string, string>) {
  const url = new URL(`/admin/orders/${orderId}`, request.url);
  for (const [key, value] of Object.entries(search)) {
    url.searchParams.set(key, value);
  }
  return url;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  const prisma = getPrismaClient();
  const { orderId } = await context.params;

  if (!prisma) {
    return NextResponse.redirect(
      buildRedirectUrl(request, orderId, { error: "Datenbankverbindung fehlt." }),
      { status: 303 },
    );
  }

  const formData = await request.formData();
  const parsed = noteSchema.safeParse({
    noteType: formData.get("noteType"),
    isCustomerVisible: formData.get("isCustomerVisible") === "yes" ? "yes" : "no",
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(
      buildRedirectUrl(request, orderId, {
        error: parsed.error.issues[0]?.message ?? "Bitte prüfen Sie die Notiz.",
      }),
      { status: 303 },
    );
  }

  await prisma.orderAdminNote.create({
    data: {
      orderId,
      noteType: parsed.data.noteType,
      isCustomerVisible: parsed.data.isCustomerVisible === "yes",
      actor: getAdminActorFromRequest(request),
      body: parsed.data.body,
    },
  });

  return NextResponse.redirect(
    buildRedirectUrl(request, orderId, { message: "Notiz gespeichert." }),
    { status: 303 },
  );
}
