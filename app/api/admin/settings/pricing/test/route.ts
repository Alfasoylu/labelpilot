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
    ? await prisma.pricingMaterialCost.findUnique({
        where: { materialKey },
      })
    : null;
  const settingsRow = prisma
    ? await prisma.pricingSettings.findUnique({
        where: { id: "default" },
      })
    : null;

  const params = mapMaterialCostRecord(materialRow) ?? getDefaultPricingMaterial(materialKey);
  const settings = mapPricingSettingsRecord(settingsRow) ?? getDefaultPricingSettings();

  const result = computeCustomSizePrice({
    materialKey,
    widthMm: parsed.data.widthMm,
    heightMm: parsed.data.heightMm,
    quantity: parsed.data.quantity,
    params,
    settings,
  });

  return NextResponse.redirect(
    buildRedirectUrl(request, {
      calcMaterial: materialKey,
      calcWidthMm: parsed.data.widthMm.toString(),
      calcHeightMm: parsed.data.heightMm.toString(),
      calcQuantity: parsed.data.quantity.toString(),
      calcQuoteRequired: String(result.quoteRequired),
      calcMethod: result.method,
      calcNet: result.netPrice.toFixed(2),
      calcGross: result.grossPrice.toFixed(2),
      calcDigital: result.breakdown.digitalCost.toFixed(2),
      calcFlexo: result.breakdown.flexoCost.toFixed(2),
      calcProduction: result.breakdown.productionCost.toFixed(2),
      calcLabelArea: result.breakdown.labelAreaM2.toFixed(4),
      calcTotalArea: result.breakdown.totalAreaM2.toFixed(4),
    }),
    { status: 303 },
  );
}
