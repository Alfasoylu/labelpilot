import { NextResponse } from "next/server";
import { z } from "zod";

import { getPrismaClient } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  analytics: z.boolean(),
  marketing: z.boolean(),
  visitorId: z.string().trim().max(64).optional(),
});

// Records the visitor's consent choice for accountability (DSGVO Art. 7(1)).
export async function POST(request: Request) {
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ ok: false }, { status: 200 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  try {
    await prisma.consentRecord.create({
      data: {
        analytics: parsed.data.analytics,
        marketing: parsed.data.marketing,
        visitorId: parsed.data.visitorId || null,
        userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
      },
    });
  } catch (error) {
    console.error("Consent-Log fehlgeschlagen:", error);
    // Logging is best-effort; the cookie is the source of truth for the visitor.
  }

  return NextResponse.json({ ok: true });
}
