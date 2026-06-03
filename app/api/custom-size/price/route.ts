import { NextResponse } from "next/server";
import { z } from "zod";

import {
  mapMaterialCostRecord,
  mapPricingSettingsRecord,
} from "@/lib/admin/pricing";
import { getPrismaClient } from "@/lib/db/prisma";
import { isCustomSizeEnabled } from "@/lib/pricing/custom-size-feature";
import {
  buildPublicCustomSizePriceResponse,
  customSizeRequestSchemaValues,
} from "@/lib/pricing/custom-size-public";

export const runtime = "nodejs";

const requestSchema = z.object({
  materialKey: z.enum(customSizeRequestSchemaValues),
  widthMm: z.coerce.number().int().positive(),
  heightMm: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
});

export async function POST(request: Request) {
  if (!isCustomSizeEnabled()) {
    return new NextResponse(null, { status: 404 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        message: "Bitte gueltige Material-, Format- und Mengendaten senden.",
      },
      { status: 400 },
    );
  }

  const parsed = requestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Bitte gueltige Material-, Format- und Mengendaten senden.",
      },
      { status: 400 },
    );
  }

  const prisma = getPrismaClient();
  const [materialRow, settingsRow] = prisma
    ? await Promise.all([
        prisma.pricingMaterialCost.findUnique({
          where: { materialKey: parsed.data.materialKey },
        }),
        prisma.pricingSettings.findUnique({
          where: { id: "default" },
        }),
      ])
    : [null, null];

  const result = buildPublicCustomSizePriceResponse({
    featureEnabled: true,
    request: parsed.data,
    params: mapMaterialCostRecord(materialRow),
    settings: mapPricingSettingsRecord(settingsRow),
  });

  return NextResponse.json(result.body, { status: result.status });
}
