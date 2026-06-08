import { NextResponse } from "next/server";

import { getPrismaClient } from "@/lib/db/prisma";

function buildRedirect(request: Request, fallback: string, value: FormDataEntryValue | null) {
  const target = typeof value === "string" && value.startsWith("/admin/reorder") ? value : fallback;
  return new URL(target, request.url);
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const prisma = getPrismaClient();
  const { id } = await context.params;

  if (!prisma) {
    return NextResponse.redirect(
      new URL("/admin/reorder?error=Datenbankverbindung+fehlt", request.url),
      { status: 303 },
    );
  }

  const formData = await request.formData();
  const isEnabled = formData.get("isEnabled") === "true";
  const redirectTo = buildRedirect(request, "/admin/reorder?message=Prognose+aktualisiert", formData.get("redirectTo"));

  try {
    await prisma.refillPrediction.update({
      where: { id },
      data: { isEnabled },
    });
  } catch {
    return NextResponse.redirect(
      new URL("/admin/reorder?error=Aktualisierung+fehlgeschlagen", request.url),
      { status: 303 },
    );
  }

  return NextResponse.redirect(redirectTo, { status: 303 });
}
