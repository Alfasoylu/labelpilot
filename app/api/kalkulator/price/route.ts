import { NextResponse } from "next/server";
import { z } from "zod";

import {
  getDefaultPricingMaterial,
  getDefaultPricingSettings,
  mapMaterialCostRecord,
  mapPricingSettingsRecord,
} from "@/lib/admin/pricing";
import { getPrismaClient } from "@/lib/db/prisma";
import { buildPublicCustomSizePriceResponse } from "@/lib/pricing/custom-size-public";

export const runtime = "nodejs";

const requestSchema = z.object({
  materialKey: z.enum(["OPAQUE_PP", "TRANSPARENT_PP"]),
  widthMm: z.coerce.number().int().positive(),
  heightMm: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
  colorCount: z.coerce.number().int().min(1).max(12),
  anzahlSorten: z.coerce.number().int().min(1).max(20).default(1),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ungültige Parameter." }, { status: 400 });
  }

  const prisma = getPrismaClient();
  const [materialRow, settingsRow] = prisma
    ? await Promise.all([
        prisma.pricingMaterialCost.findUnique({ where: { materialKey: parsed.data.materialKey } }),
        prisma.pricingSettings.findUnique({ where: { id: "default" } }),
      ])
    : [null, null];

  const params = mapMaterialCostRecord(materialRow) ?? getDefaultPricingMaterial(parsed.data.materialKey);
  const settings = mapPricingSettingsRecord(settingsRow) ?? getDefaultPricingSettings();

  let result;
  try {
    result = buildPublicCustomSizePriceResponse({
      featureEnabled: true,
      request: parsed.data,
      params,
      settings,
    });
  } catch (error) {
    console.error("[kalkulator-price] computation failed:", error);
    return NextResponse.json({ message: "Preisberechnung nicht verfügbar." }, { status: 503 });
  }

  return NextResponse.json(result.body, { status: result.status });
}
