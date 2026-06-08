import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getPrismaClient } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// First-party behavioural event. Only sent by the client AFTER the visitor
// grants analytics consent (the client tracker checks the consent cookie).
// We store a coarse country (from the edge geo header) and a coarse device
// class — never the raw IP address.
const schema = z.object({
  visitorId: z.string().trim().min(1).max(64),
  eventType: z.string().trim().min(1).max(60),
  path: z.string().trim().max(300).optional(),
  referrer: z.string().trim().max(300).optional(),
  utmSource: z.string().trim().max(120).optional(),
  utmMedium: z.string().trim().max(120).optional(),
  utmCampaign: z.string().trim().max(120).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

function deviceClass(userAgent: string | null): string {
  if (!userAgent) return "unknown";
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) return "tablet";
  if (/mobi|android|iphone/.test(ua)) return "mobile";
  return "desktop";
}

export async function POST(request: Request) {
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ ok: false }, { status: 200 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  const d = parsed.data;
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    null;

  try {
    await prisma.visitorEvent.create({
      data: {
        visitorId: d.visitorId,
        eventType: d.eventType,
        path: d.path || null,
        referrer: d.referrer || null,
        utmSource: d.utmSource || null,
        utmMedium: d.utmMedium || null,
        utmCampaign: d.utmCampaign || null,
        country: country?.slice(0, 8) ?? null,
        device: deviceClass(request.headers.get("user-agent")),
        ...(d.metadata ? { metadata: d.metadata as Prisma.InputJsonValue } : {}),
      },
    });
  } catch (error) {
    console.error("Visitor-Event fehlgeschlagen:", error);
  }

  return NextResponse.json({ ok: true });
}
