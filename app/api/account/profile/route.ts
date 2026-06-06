import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseUserFromRequest } from "@/lib/account/auth";
import { ensureCustomerForSupabaseUser } from "@/lib/account/customers";
import { getPrismaClient } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const patchSchema = z.object({
  contactName: z.string().trim().min(0).max(120).optional(),
  companyName: z.string().trim().min(0).max(160).optional(),
  phone: z.string().trim().min(0).max(60).optional(),
});

export async function GET(request: Request): Promise<Response> {
  const auth = await getSupabaseUserFromRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "Nicht verfügbar." }, { status: 503 });

  try {
    const customer = await ensureCustomerForSupabaseUser(prisma, auth.user);
    return NextResponse.json({
      email: customer.email,
      contactName: customer.contactName ?? null,
      companyName: customer.companyName ?? null,
      phone: customer.phone ?? null,
    });
  } catch (error) {
    console.error("Profil-GET fehlgeschlagen:", error);
    return NextResponse.json({ error: "Profil konnte nicht geladen werden." }, { status: 500 });
  }
}

export async function PATCH(request: Request): Promise<Response> {
  const auth = await getSupabaseUserFromRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "Nicht verfügbar." }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });

  try {
    const customer = await ensureCustomerForSupabaseUser(prisma, auth.user);

    const updated = await prisma.customer.update({
      where: { id: customer.id },
      data: {
        ...(parsed.data.contactName !== undefined && {
          contactName: parsed.data.contactName || null,
        }),
        ...(parsed.data.companyName !== undefined && {
          companyName: parsed.data.companyName || null,
        }),
        ...(parsed.data.phone !== undefined && {
          phone: parsed.data.phone || null,
        }),
      },
      select: {
        email: true,
        contactName: true,
        companyName: true,
        phone: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Profil-PATCH fehlgeschlagen:", error);
    return NextResponse.json({ error: "Profil konnte nicht gespeichert werden." }, { status: 500 });
  }
}
