import { NextResponse } from "next/server";
import { z } from "zod";

import { getPrismaClient } from "@/lib/db/prisma";

const updateSchema = z.object({
  status: z.enum(["OPEN", "IN_REVIEW", "RESOLVED"]),
  adminNote: z.string().trim().max(4000).optional(),
});

function buildRedirectUrl(request: Request, id: string, search: Record<string, string>) {
  const url = new URL(`/admin/support/${id}`, request.url);
  for (const [key, value] of Object.entries(search)) {
    url.searchParams.set(key, value);
  }
  return url;
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const prisma = getPrismaClient();
  const { id } = await context.params;

  if (!prisma) {
    return NextResponse.redirect(
      buildRedirectUrl(request, id, { error: "Datenbankverbindung fehlt." }),
      { status: 303 },
    );
  }

  const formData = await request.formData();
  const parsed = updateSchema.safeParse({
    status: formData.get("status"),
    adminNote: formData.get("adminNote"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(
      buildRedirectUrl(request, id, { error: "Bitte prüfen Sie die Angaben." }),
      { status: 303 },
    );
  }

  try {
    await prisma.supportRequest.update({
      where: { id },
      data: {
        status: parsed.data.status,
        adminNote: parsed.data.adminNote || null,
      },
    });
  } catch {
    return NextResponse.redirect(
      buildRedirectUrl(request, id, { error: "Anfrage konnte nicht aktualisiert werden." }),
      { status: 303 },
    );
  }

  return NextResponse.redirect(
    buildRedirectUrl(request, id, { message: "Anfrage gespeichert." }),
    { status: 303 },
  );
}
