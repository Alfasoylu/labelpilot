import { NextResponse } from "next/server";
import { z } from "zod";

import {
  getDefaultPricingMaterial,
  getDefaultPricingSettings,
  mapMaterialCostRecord,
  mapPricingSettingsRecord,
} from "@/lib/admin/pricing";
import { getPrismaClient } from "@/lib/db/prisma";
import { computeCustomSizePrice } from "@/lib/pricing/custom-size";

const testSchema = z.object({
  materialKey: z.enum(["OPAQUE_PP", "TRANSPARENT_PP"]),
  widthMm: z.coerce.number().int().positive(),
  heightMm: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
  colorCount: z.coerce.number().int().min(1).max(12).default(4),
  anzahlSorten: z.coerce.number().int().min(1).max(20).default(1),
});

function buildRedirectUrl(request: Request, search: Record<string, string>) {
  const url = new URL("/admin/settings/pricing", request.url);
  for (const [key, value] of Object.entries(search)) {
    url.searchParams.set(key, value);
  }
  return url;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = testSchema.safeParse({
    materialKey: formData.get("materialKey"),
    widthMm: formData.get("widthMm"),
    heightMm: formData.get("heightMm"),
    quantity: formData.get("quantity"),
    colorCount: formData.get("colorCount"),
    anzahlSorten: formData.get("anzahlSorten"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(
      buildRedirectUrl(request, {
        error: "Bitte gültige Testwerte eingeben.",
      }),
      { status: 303 },
    );
  }

  const prisma = getPrismaClient();
  const materialKey = parsed.data.materialKey;
  const materialRow = prisma
    ? await prisma.pricingMaterialCost.findUnique({ where: { materialKey } })
    : null;
  const settingsRow = prisma
    ? await prisma.pricingSettings.findUnique({ where: { id: "default" } })
    : null;

  const params = mapMaterialCostRecord(materialRow) ?? getDefaultPricingMaterial(materialKey);
  const settings = mapPricingSettingsRecord(settingsRow) ?? getDefaultPricingSettings();

  const result = computeCustomSizePrice({
    materialKey,
    widthMm: parsed.data.widthMm,
    heightMm: parsed.data.heightMm,
    quantity: parsed.data.quantity,
    colorCount: parsed.data.colorCount,
    anzahlSorten: parsed.data.anzahlSorten,
    params,
    settings,
  });

  return NextResponse.redirect(
    buildRedirectUrl(request, {
      calcMatKey: materialKey,
      calcWidthMm: parsed.data.widthMm.toString(),
      calcHeightMm: parsed.data.heightMm.toString(),
      calcQuantity: parsed.data.quantity.toString(),
      calcColorCount: parsed.data.colorCount.toString(),
      calcSorten: parsed.data.anzahlSorten.toString(),
      calcQuoteRequired: String(result.quoteRequired),
      calcMethod: result.method,
      calcNet: result.netPrice.toFixed(2),
      calcGross: result.grossPrice.toFixed(2),
      calcMaterialCost: result.breakdown.materialCost.toFixed(2),
      calcInk: result.breakdown.inkCost.toFixed(2),
      calcPlate: result.breakdown.plateCost.toFixed(2),
      calcDigital: result.breakdown.digitalPrintingCost.toFixed(2),
      calcMultiplier: result.breakdown.multiplier.toString(),
      calcProduction: result.breakdown.productionCost.toFixed(2),
      calcLabelArea: result.breakdown.labelAreaM2.toFixed(4),
      calcTotalArea: result.breakdown.totalAreaM2.toFixed(4),
    }),
    { status: 303 },
  );
}
