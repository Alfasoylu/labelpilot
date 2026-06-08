import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  buildPricingAudits,
  PRICING_MATERIAL_KEYS,
} from "@/lib/admin/pricing";
import { getPrismaClient } from "@/lib/db/prisma";
import { getAdminActorFromRequest } from "@/lib/security/admin-basic-auth";

const materialSchema = z.object({
  materialKey: z.enum(["OPAQUE_PP", "TRANSPARENT_PP"]),
  materialCostPerM2: z.coerce.number().positive(),
  mattMaterialCostPerM2: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number().positive().optional(),
  ),
  wasteFactorPct: z.coerce.number().min(0).max(95),
  minOrderValueNet: z.coerce.number().positive(),
});

const settingsSchema = z.object({
  vatPct: z.coerce.number().min(0).max(100),
  roundingStepNet: z.coerce.number().positive(),
  customMaxWidthMm: z.coerce.number().int().positive(),
  customMaxHeightMm: z.coerce.number().int().positive(),
  customMaxQuantity: z.coerce.number().int().positive(),
  designServiceNet: z.coerce.number().positive(),
  designServiceFreeThresholdNet: z.coerce.number().positive(),
  physicalProofNet: z.coerce.number().positive(),
  expressNet: z.coerce.number().positive(),
  extraDesignNet: z.coerce.number().positive(),
  platePerColorCostNet: z.coerce.number().positive(),
  inkCostPerM2PerColorNet: z.coerce.number().positive(),
  digitalCostPerM2Net: z.coerce.number().positive(),
  digitalSellingPricePerM2Net: z.coerce.number().positive(),
  markupTier1Multiplier: z.coerce.number().min(1),
  markupTier1MaxQty: z.coerce.number().int().positive(),
  markupTier2Multiplier: z.coerce.number().min(1),
  markupTier2MaxQty: z.coerce.number().int().positive(),
  markupTier3Multiplier: z.coerce.number().min(1),
  labelWeightPerM2Grams: z.coerce.number().positive(),
  shippingTier1MaxKg: z.coerce.number().positive(),
  shippingTier1RateEur: z.coerce.number().min(0),
  shippingTier2MaxKg: z.coerce.number().positive(),
  shippingTier2RateEur: z.coerce.number().min(0),
  shippingTier3RateEur: z.coerce.number().min(0),
  shippingMinCostEur: z.coerce.number().min(0),
  shippingHeavyThresholdKg: z.coerce.number().positive(),
});

function buildRedirectUrl(request: Request, search: Record<string, string>) {
  const url = new URL("/admin/settings/pricing", request.url);
  for (const [key, value] of Object.entries(search)) {
    url.searchParams.set(key, value);
  }
  return url;
}

function getMaterialPayload(formData: FormData, materialKey: "OPAQUE_PP" | "TRANSPARENT_PP") {
  return {
    materialKey,
    materialCostPerM2: formData.get(`${materialKey}.materialCostPerM2`),
    mattMaterialCostPerM2: formData.get(`${materialKey}.mattMaterialCostPerM2`),
    wasteFactorPct: formData.get(`${materialKey}.wasteFactorPct`),
    minOrderValueNet: formData.get(`${materialKey}.minOrderValueNet`),
  };
}

export async function POST(request: Request) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return NextResponse.redirect(
      buildRedirectUrl(request, {
        error: "Datenbankverbindung fehlt.",
      }),
      { status: 303 },
    );
  }

  const actor = getAdminActorFromRequest(request);
  const formData = await request.formData();

  const settingsResult = settingsSchema.safeParse({
    vatPct: formData.get("settings.vatPct"),
    roundingStepNet: formData.get("settings.roundingStepNet"),
    customMaxWidthMm: formData.get("settings.customMaxWidthMm"),
    customMaxHeightMm: formData.get("settings.customMaxHeightMm"),
    customMaxQuantity: formData.get("settings.customMaxQuantity"),
    designServiceNet: formData.get("settings.designServiceNet"),
    designServiceFreeThresholdNet: formData.get("settings.designServiceFreeThresholdNet"),
    physicalProofNet: formData.get("settings.physicalProofNet"),
    expressNet: formData.get("settings.expressNet"),
    extraDesignNet: formData.get("settings.extraDesignNet"),
    platePerColorCostNet: formData.get("settings.platePerColorCostNet"),
    inkCostPerM2PerColorNet: formData.get("settings.inkCostPerM2PerColorNet"),
    digitalCostPerM2Net: formData.get("settings.digitalCostPerM2Net"),
    digitalSellingPricePerM2Net: formData.get("settings.digitalSellingPricePerM2Net"),
    markupTier1Multiplier: formData.get("settings.markupTier1Multiplier"),
    markupTier1MaxQty: formData.get("settings.markupTier1MaxQty"),
    markupTier2Multiplier: formData.get("settings.markupTier2Multiplier"),
    markupTier2MaxQty: formData.get("settings.markupTier2MaxQty"),
    markupTier3Multiplier: formData.get("settings.markupTier3Multiplier"),
    labelWeightPerM2Grams: formData.get("settings.labelWeightPerM2Grams"),
    shippingTier1MaxKg: formData.get("settings.shippingTier1MaxKg"),
    shippingTier1RateEur: formData.get("settings.shippingTier1RateEur"),
    shippingTier2MaxKg: formData.get("settings.shippingTier2MaxKg"),
    shippingTier2RateEur: formData.get("settings.shippingTier2RateEur"),
    shippingTier3RateEur: formData.get("settings.shippingTier3RateEur"),
    shippingMinCostEur: formData.get("settings.shippingMinCostEur"),
    shippingHeavyThresholdKg: formData.get("settings.shippingHeavyThresholdKg"),
  });

  const materialResults = PRICING_MATERIAL_KEYS.map((materialKey) =>
    materialSchema.safeParse(getMaterialPayload(formData, materialKey)),
  );

  if (!settingsResult.success || materialResults.some((result) => !result.success)) {
    const firstIssue =
      settingsResult.success
        ? materialResults.find((result) => !result.success)?.error.issues[0]?.message
        : settingsResult.error.issues[0]?.message;

    return NextResponse.redirect(
      buildRedirectUrl(request, {
        error: firstIssue ?? "Bitte alle Preisparameter gültig ausfuellen.",
      }),
      { status: 303 },
    );
  }

  const settingsData = settingsResult.data;
  const materialData = materialResults.map((result) => {
    if (!result.success) {
      throw new Error("Validated material payload expected.");
    }

    return result.data;
  });

  const [previousSettings, previousMaterials] = (await Promise.all([
    prisma.pricingSettings.findUnique({ where: { id: "default" } }),
    prisma.pricingMaterialCost.findMany({
      where: { materialKey: { in: [...PRICING_MATERIAL_KEYS] } },
    }),
  ])) as [
    {
      vatPct?: { toString(): string } | null;
      roundingStepNet?: { toString(): string } | null;
      customMaxWidthMm?: number | null;
      customMaxHeightMm?: number | null;
      customMaxQuantity?: number | null;
      designServiceNet?: { toString(): string } | null;
      designServiceFreeThresholdNet?: { toString(): string } | null;
      physicalProofNet?: { toString(): string } | null;
      expressNet?: { toString(): string } | null;
      extraDesignNet?: { toString(): string } | null;
      platePerColorCostNet?: { toString(): string } | null;
      inkCostPerM2PerColorNet?: { toString(): string } | null;
      digitalCostPerM2Net?: { toString(): string } | null;
      digitalSellingPricePerM2Net?: { toString(): string } | null;
      markupTier1Multiplier?: { toString(): string } | null;
      markupTier1MaxQty?: number | null;
      markupTier2Multiplier?: { toString(): string } | null;
      markupTier2MaxQty?: number | null;
      markupTier3Multiplier?: { toString(): string } | null;
      labelWeightPerM2Grams?: { toString(): string } | null;
      shippingTier1MaxKg?: { toString(): string } | null;
      shippingTier1RateEur?: { toString(): string } | null;
      shippingTier2MaxKg?: { toString(): string } | null;
      shippingTier2RateEur?: { toString(): string } | null;
      shippingTier3RateEur?: { toString(): string } | null;
      shippingMinCostEur?: { toString(): string } | null;
      shippingHeavyThresholdKg?: { toString(): string } | null;
      updatedBy?: string | null;
    } | null,
    Array<{
      materialKey: string;
      materialCostPerM2?: { toString(): string } | null;
      mattMaterialCostPerM2?: { toString(): string } | null;
      wasteFactorPct?: { toString(): string } | null;
      minOrderValueNet?: { toString(): string } | null;
      updatedBy?: string | null;
    }>,
  ];

  const settingAuditEntries = buildPricingAudits({
    actor,
    tableName: "PricingSettings",
    previous: {
      vatPct: previousSettings?.vatPct?.toString() ?? null,
      roundingStepNet: previousSettings?.roundingStepNet?.toString() ?? null,
      customMaxWidthMm: previousSettings?.customMaxWidthMm?.toString() ?? null,
      customMaxHeightMm: previousSettings?.customMaxHeightMm?.toString() ?? null,
      customMaxQuantity: previousSettings?.customMaxQuantity?.toString() ?? null,
      designServiceNet: previousSettings?.designServiceNet?.toString() ?? null,
      designServiceFreeThresholdNet: previousSettings?.designServiceFreeThresholdNet?.toString() ?? null,
      physicalProofNet: previousSettings?.physicalProofNet?.toString() ?? null,
      expressNet: previousSettings?.expressNet?.toString() ?? null,
      extraDesignNet: previousSettings?.extraDesignNet?.toString() ?? null,
      platePerColorCostNet: previousSettings?.platePerColorCostNet?.toString() ?? null,
      inkCostPerM2PerColorNet: previousSettings?.inkCostPerM2PerColorNet?.toString() ?? null,
      digitalCostPerM2Net: previousSettings?.digitalCostPerM2Net?.toString() ?? null,
      digitalSellingPricePerM2Net: previousSettings?.digitalSellingPricePerM2Net?.toString() ?? null,
      markupTier1Multiplier: previousSettings?.markupTier1Multiplier?.toString() ?? null,
      markupTier1MaxQty: previousSettings?.markupTier1MaxQty?.toString() ?? null,
      markupTier2Multiplier: previousSettings?.markupTier2Multiplier?.toString() ?? null,
      markupTier2MaxQty: previousSettings?.markupTier2MaxQty?.toString() ?? null,
      markupTier3Multiplier: previousSettings?.markupTier3Multiplier?.toString() ?? null,
      labelWeightPerM2Grams: previousSettings?.labelWeightPerM2Grams?.toString() ?? null,
      shippingTier1MaxKg: previousSettings?.shippingTier1MaxKg?.toString() ?? null,
      shippingTier1RateEur: previousSettings?.shippingTier1RateEur?.toString() ?? null,
      shippingTier2MaxKg: previousSettings?.shippingTier2MaxKg?.toString() ?? null,
      shippingTier2RateEur: previousSettings?.shippingTier2RateEur?.toString() ?? null,
      shippingTier3RateEur: previousSettings?.shippingTier3RateEur?.toString() ?? null,
      shippingMinCostEur: previousSettings?.shippingMinCostEur?.toString() ?? null,
      shippingHeavyThresholdKg: previousSettings?.shippingHeavyThresholdKg?.toString() ?? null,
      updatedBy: previousSettings?.updatedBy ?? null,
    },
    next: {
      vatPct: settingsData.vatPct.toString(),
      roundingStepNet: settingsData.roundingStepNet.toString(),
      customMaxWidthMm: settingsData.customMaxWidthMm.toString(),
      customMaxHeightMm: settingsData.customMaxHeightMm.toString(),
      customMaxQuantity: settingsData.customMaxQuantity.toString(),
      designServiceNet: settingsData.designServiceNet.toString(),
      designServiceFreeThresholdNet: settingsData.designServiceFreeThresholdNet.toString(),
      physicalProofNet: settingsData.physicalProofNet.toString(),
      expressNet: settingsData.expressNet.toString(),
      extraDesignNet: settingsData.extraDesignNet.toString(),
      platePerColorCostNet: settingsData.platePerColorCostNet.toString(),
      inkCostPerM2PerColorNet: settingsData.inkCostPerM2PerColorNet.toString(),
      digitalCostPerM2Net: settingsData.digitalCostPerM2Net.toString(),
      digitalSellingPricePerM2Net: settingsData.digitalSellingPricePerM2Net.toString(),
      markupTier1Multiplier: settingsData.markupTier1Multiplier.toString(),
      markupTier1MaxQty: settingsData.markupTier1MaxQty.toString(),
      markupTier2Multiplier: settingsData.markupTier2Multiplier.toString(),
      markupTier2MaxQty: settingsData.markupTier2MaxQty.toString(),
      markupTier3Multiplier: settingsData.markupTier3Multiplier.toString(),
      labelWeightPerM2Grams: settingsData.labelWeightPerM2Grams.toString(),
      shippingTier1MaxKg: settingsData.shippingTier1MaxKg.toString(),
      shippingTier1RateEur: settingsData.shippingTier1RateEur.toString(),
      shippingTier2MaxKg: settingsData.shippingTier2MaxKg.toString(),
      shippingTier2RateEur: settingsData.shippingTier2RateEur.toString(),
      shippingTier3RateEur: settingsData.shippingTier3RateEur.toString(),
      shippingMinCostEur: settingsData.shippingMinCostEur.toString(),
      shippingHeavyThresholdKg: settingsData.shippingHeavyThresholdKg.toString(),
      updatedBy: actor,
    },
  });

  const materialAuditEntries = materialData.flatMap((row) => {
    const previous = previousMaterials.find(
      (item) => item.materialKey === row.materialKey,
    );

    return buildPricingAudits({
      actor,
      tableName: `PricingMaterialCost:${row.materialKey}`,
      previous: {
        materialCostPerM2: previous?.materialCostPerM2?.toString() ?? null,
        mattMaterialCostPerM2: previous?.mattMaterialCostPerM2?.toString() ?? null,
        wasteFactorPct: previous?.wasteFactorPct?.toString() ?? null,
        minOrderValueNet: previous?.minOrderValueNet?.toString() ?? null,
        updatedBy: previous?.updatedBy ?? null,
      },
      next: {
        materialCostPerM2: row.materialCostPerM2.toString(),
        mattMaterialCostPerM2: row.mattMaterialCostPerM2?.toString() ?? null,
        wasteFactorPct: row.wasteFactorPct.toString(),
        minOrderValueNet: row.minOrderValueNet.toString(),
        updatedBy: actor,
      },
    });
  });

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (tx.pricingSettings.upsert as any)({
      where: { id: "default" },
      update: {
        ...settingsData,
        updatedBy: actor,
      },
      create: {
        id: "default",
        ...settingsData,
        updatedBy: actor,
      },
    });

    for (const row of materialData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (tx.pricingMaterialCost.upsert as any)({
        where: { materialKey: row.materialKey },
        update: {
          ...row,
          updatedBy: actor,
        },
        create: {
          ...row,
          updatedBy: actor,
        },
      });
    }

    const audits = [...settingAuditEntries, ...materialAuditEntries];
    if (audits.length > 0) {
      await tx.pricingAudit.createMany({
        data: audits,
      });
    }
  });

  return NextResponse.redirect(
    buildRedirectUrl(request, {
      message: "Preisparameter gespeichert.",
    }),
    { status: 303 },
  );
}
