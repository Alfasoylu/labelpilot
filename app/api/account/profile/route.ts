import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseUserFromRequest } from "@/lib/account/auth";
import { ensureCustomerForSupabaseUser } from "@/lib/account/customers";
import { getPrismaClient } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const notificationPrefsSchema = z.object({
  proofReady: z.boolean(),
  shipped: z.boolean(),
  reorderReminder: z.boolean(),
  quoteUpdates: z.boolean(),
});

const patchSchema = z.object({
  contactName: z.string().trim().min(0).max(120).optional(),
  companyName: z.string().trim().min(0).max(160).optional(),
  phone: z.string().trim().min(0).max(60).optional(),
  street: z.string().trim().min(0).max(160).optional(),
  addressLine2: z.string().trim().min(0).max(160).optional(),
  postalCode: z.string().trim().min(0).max(20).optional(),
  city: z.string().trim().min(0).max(120).optional(),
  country: z.string().trim().min(0).max(60).optional(),
  vatId: z.string().trim().min(0).max(40).optional(),
  billingCompanyName: z.string().trim().min(0).max(160).optional(),
  billingStreet: z.string().trim().min(0).max(160).optional(),
  billingAddressLine2: z.string().trim().min(0).max(160).optional(),
  billingPostalCode: z.string().trim().min(0).max(20).optional(),
  billingCity: z.string().trim().min(0).max(120).optional(),
  billingCountry: z.string().trim().min(0).max(60).optional(),
  notificationPrefs: notificationPrefsSchema.optional(),
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
      street: customer.street ?? null,
      addressLine2: customer.addressLine2 ?? null,
      postalCode: customer.postalCode ?? null,
      city: customer.city ?? null,
      country: customer.country ?? null,
      vatId: customer.vatId ?? null,
      billingCompanyName: customer.billingCompanyName ?? null,
      billingStreet: customer.billingStreet ?? null,
      billingAddressLine2: customer.billingAddressLine2 ?? null,
      billingPostalCode: customer.billingPostalCode ?? null,
      billingCity: customer.billingCity ?? null,
      billingCountry: customer.billingCountry ?? null,
      notificationPrefs: customer.notificationPrefs ?? null,
      paymentTermsApproved: customer.paymentTermsApproved,
      paymentTermsNetDays: customer.paymentTermsNetDays ?? null,
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

    const d = parsed.data;
    const updated = await prisma.customer.update({
      where: { id: customer.id },
      data: {
        ...(d.contactName !== undefined && { contactName: d.contactName || null }),
        ...(d.companyName !== undefined && { companyName: d.companyName || null }),
        ...(d.phone !== undefined && { phone: d.phone || null }),
        ...(d.street !== undefined && { street: d.street || null }),
        ...(d.addressLine2 !== undefined && { addressLine2: d.addressLine2 || null }),
        ...(d.postalCode !== undefined && { postalCode: d.postalCode || null }),
        ...(d.city !== undefined && { city: d.city || null }),
        ...(d.country !== undefined && { country: d.country || null }),
        ...(d.vatId !== undefined && { vatId: d.vatId || null }),
        ...(d.billingCompanyName !== undefined && { billingCompanyName: d.billingCompanyName || null }),
        ...(d.billingStreet !== undefined && { billingStreet: d.billingStreet || null }),
        ...(d.billingAddressLine2 !== undefined && { billingAddressLine2: d.billingAddressLine2 || null }),
        ...(d.billingPostalCode !== undefined && { billingPostalCode: d.billingPostalCode || null }),
        ...(d.billingCity !== undefined && { billingCity: d.billingCity || null }),
        ...(d.billingCountry !== undefined && { billingCountry: d.billingCountry || null }),
        ...(d.notificationPrefs !== undefined && { notificationPrefs: d.notificationPrefs }),
      },
      select: {
        email: true,
        contactName: true,
        companyName: true,
        phone: true,
        street: true,
        addressLine2: true,
        postalCode: true,
        city: true,
        country: true,
        vatId: true,
        billingCompanyName: true,
        billingStreet: true,
        billingAddressLine2: true,
        billingPostalCode: true,
        billingCity: true,
        billingCountry: true,
        notificationPrefs: true,
        paymentTermsApproved: true,
        paymentTermsNetDays: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Profil-PATCH fehlgeschlagen:", error);
    return NextResponse.json({ error: "Profil konnte nicht gespeichert werden." }, { status: 500 });
  }
}
