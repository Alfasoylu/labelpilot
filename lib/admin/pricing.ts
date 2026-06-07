import { getPrismaClient } from "@/lib/db/prisma";
import type {
  PricingMaterialKey,
  PricingMaterialParams,
  PricingSettingsInput,
} from "@/lib/pricing/custom-size";
import type { AddonSettingsInput } from "@/lib/pricing/addons";

type DecimalLike = { toString(): string };

type PricingMaterialCostRecord = {
  materialKey: string;
  materialCostPerM2: DecimalLike | number;
  wasteFactorPct: DecimalLike | number;
  minOrderValueNet: DecimalLike | number;
  updatedAt: Date;
  updatedBy: string | null;
};

type PricingSettingsRecord = {
  vatPct: DecimalLike | number;
  roundingStepNet: DecimalLike | number;
  customMaxWidthMm: number;
  customMaxHeightMm: number;
  customMaxQuantity: number;
  designServiceNet: DecimalLike | number;
  designServiceFreeThresholdNet: DecimalLike | number;
  physicalProofNet: DecimalLike | number;
  expressNet: DecimalLike | number;
  extraDesignNet: DecimalLike | number;
  platePerColorCostNet?: DecimalLike | number | null;
  inkCostPerM2PerColorNet?: DecimalLike | number | null;
  digitalCostPerUnitNet?: DecimalLike | number | null;
  digitalSetupCostNet?: DecimalLike | number | null;
  markupTier1Multiplier?: DecimalLike | number | null;
  markupTier1MaxQty?: number | null;
  markupTier2Multiplier?: DecimalLike | number | null;
  markupTier2MaxQty?: number | null;
  markupTier3Multiplier?: DecimalLike | number | null;
  labelWeightPerM2Grams?: DecimalLike | number | null;
  shippingTier1MaxKg?: DecimalLike | number | null;
  shippingTier1RateEur?: DecimalLike | number | null;
  shippingTier2MaxKg?: DecimalLike | number | null;
  shippingTier2RateEur?: DecimalLike | number | null;
  shippingTier3RateEur?: DecimalLike | number | null;
  shippingMinCostEur?: DecimalLike | number | null;
  shippingHeavyThresholdKg?: DecimalLike | number | null;
  updatedAt: Date;
  updatedBy: string | null;
};

export type PricingMaterialAdminValues = PricingMaterialParams & {
  updatedAt: Date | null;
  updatedBy: string | null;
};

export type PricingSettingsAdminValues = PricingSettingsInput &
  AddonSettingsInput & {
    updatedAt: Date | null;
    updatedBy: string | null;
  };

export type PricingAuditRecord = {
  id: string;
  actor: string;
  changedAt: Date;
  tableName: string;
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
};

type PricingAuditInsert = {
  actor: string;
  tableName: string;
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
};

export const PRICING_MATERIAL_KEYS = [
  "OPAQUE_PP",
  "TRANSPARENT_PP",
] as const satisfies readonly PricingMaterialKey[];

const DEFAULT_MATERIALS: Record<PricingMaterialKey, PricingMaterialParams> = {
  OPAQUE_PP: {
    materialKey: "OPAQUE_PP",
    materialCostPerM2: 0.8,
    wasteFactorPct: 15,
    minOrderValueNet: 75,
  },
  TRANSPARENT_PP: {
    materialKey: "TRANSPARENT_PP",
    materialCostPerM2: 1.0,
    wasteFactorPct: 15,
    minOrderValueNet: 85,
  },
};

const DEFAULT_SETTINGS: PricingSettingsInput & AddonSettingsInput = {
  vatPct: 19,
  roundingStepNet: 1,
  customMaxWidthMm: 312,
  customMaxHeightMm: 700,
  customMaxQuantity: 300000,
  designServiceNet: 40,
  designServiceFreeThresholdNet: 2000,
  physicalProofNet: 10,
  expressNet: 9.9,
  extraDesignNet: 19,
  platePerColorCostNet: 40,
  inkCostPerM2PerColorNet: 0.33,
  digitalCostPerUnitNet: 0.10,
  digitalSetupCostNet: 40,
  markupTier1Multiplier: 1.8,
  markupTier1MaxQty: 5000,
  markupTier2Multiplier: 1.6,
  markupTier2MaxQty: 10000,
  markupTier3Multiplier: 1.5,
  labelWeightPerM2Grams: 150,
  shippingTier1MaxKg: 50,
  shippingTier1RateEur: 10,
  shippingTier2MaxKg: 100,
  shippingTier2RateEur: 9,
  shippingTier3RateEur: 7,
  shippingMinCostEur: 5,
  shippingHeavyThresholdKg: 10,
};

function decimalToNumber(value: { toString(): string } | number | null | undefined) {
  if (value == null) {
    return null;
  }

  return Number(value.toString());
}

export function getDefaultPricingMaterial(
  materialKey: PricingMaterialKey,
): PricingMaterialAdminValues {
  return {
    ...DEFAULT_MATERIALS[materialKey],
    updatedAt: null,
    updatedBy: null,
  };
}

export function getDefaultPricingSettings(): PricingSettingsAdminValues {
  return {
    ...DEFAULT_SETTINGS,
    updatedAt: null,
    updatedBy: null,
  };
}

export function mapMaterialCostRecord(record: PricingMaterialCostRecord | null | undefined) {
  if (!record) {
    return null;
  }

  return {
    materialKey: record.materialKey as PricingMaterialKey,
    materialCostPerM2: decimalToNumber(record.materialCostPerM2) ?? 0,
    wasteFactorPct: decimalToNumber(record.wasteFactorPct) ?? 0,
    minOrderValueNet: decimalToNumber(record.minOrderValueNet) ?? 0,
    updatedAt: record.updatedAt,
    updatedBy: record.updatedBy ?? null,
  };
}

export function mapPricingSettingsRecord(record: PricingSettingsRecord | null | undefined) {
  if (!record) {
    return null;
  }

  return {
    vatPct: decimalToNumber(record.vatPct) ?? 19,
    roundingStepNet: decimalToNumber(record.roundingStepNet) ?? 1,
    customMaxWidthMm: record.customMaxWidthMm,
    customMaxHeightMm: record.customMaxHeightMm,
    customMaxQuantity: record.customMaxQuantity,
    designServiceNet: decimalToNumber(record.designServiceNet) ?? 40,
    designServiceFreeThresholdNet:
      decimalToNumber(record.designServiceFreeThresholdNet) ?? 2000,
    physicalProofNet: decimalToNumber(record.physicalProofNet) ?? 10,
    expressNet: decimalToNumber(record.expressNet) ?? 9.9,
    extraDesignNet: decimalToNumber(record.extraDesignNet) ?? 19,
    platePerColorCostNet: decimalToNumber(record.platePerColorCostNet) ?? 40,
    inkCostPerM2PerColorNet: decimalToNumber(record.inkCostPerM2PerColorNet) ?? 0.33,
    digitalCostPerUnitNet: decimalToNumber(record.digitalCostPerUnitNet) ?? 0.10,
    digitalSetupCostNet: decimalToNumber(record.digitalSetupCostNet) ?? 40,
    markupTier1Multiplier: decimalToNumber(record.markupTier1Multiplier) ?? 1.8,
    markupTier1MaxQty: record.markupTier1MaxQty ?? 5000,
    markupTier2Multiplier: decimalToNumber(record.markupTier2Multiplier) ?? 1.6,
    markupTier2MaxQty: record.markupTier2MaxQty ?? 10000,
    markupTier3Multiplier: decimalToNumber(record.markupTier3Multiplier) ?? 1.5,
    labelWeightPerM2Grams: decimalToNumber(record.labelWeightPerM2Grams) ?? 150,
    shippingTier1MaxKg: decimalToNumber(record.shippingTier1MaxKg) ?? 50,
    shippingTier1RateEur: decimalToNumber(record.shippingTier1RateEur) ?? 10,
    shippingTier2MaxKg: decimalToNumber(record.shippingTier2MaxKg) ?? 100,
    shippingTier2RateEur: decimalToNumber(record.shippingTier2RateEur) ?? 9,
    shippingTier3RateEur: decimalToNumber(record.shippingTier3RateEur) ?? 7,
    shippingMinCostEur: decimalToNumber(record.shippingMinCostEur) ?? 5,
    shippingHeavyThresholdKg: decimalToNumber(record.shippingHeavyThresholdKg) ?? 10,
    updatedAt: record.updatedAt,
    updatedBy: record.updatedBy ?? null,
  };
}

export async function getPricingAdminSnapshot() {
  const prisma = getPrismaClient();

  if (!prisma) {
    return null;
  }

  const [settings, materialRows, audits] = (await Promise.all([
    prisma.pricingSettings.findUnique({
      where: { id: "default" },
    }),
    prisma.pricingMaterialCost.findMany({
      where: {
        materialKey: {
          in: [...PRICING_MATERIAL_KEYS],
        },
      },
      orderBy: {
        materialKey: "asc",
      },
    }),
    prisma.pricingAudit.findMany({
      orderBy: {
        changedAt: "desc",
      },
      take: 20,
    }),
  ])) as [
    PricingSettingsRecord | null,
    PricingMaterialCostRecord[],
    PricingAuditRecord[],
  ];

  return {
    settings: mapPricingSettingsRecord(settings),
    materials: Object.fromEntries(
      PRICING_MATERIAL_KEYS.map((key) => {
        const found = materialRows.find((row) => row.materialKey === key);
        return [key, mapMaterialCostRecord(found)];
      }),
    ) as Record<PricingMaterialKey, ReturnType<typeof mapMaterialCostRecord>>,
    audits,
  };
}

export function formatPricingNumber(value: number | null | undefined, digits = 2) {
  if (value == null || Number.isNaN(value)) {
    return "";
  }

  return value.toFixed(digits);
}

export function formatPricingDate(value: Date | null | undefined) {
  if (!value) {
    return "Noch nicht gespeichert";
  }

  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function buildPricingAudits(input: {
  actor: string;
  tableName: string;
  previous: Record<string, string | null | undefined>;
  next: Record<string, string | null | undefined>;
}) {
  const audits: PricingAuditInsert[] = [];

  for (const [fieldName, nextValue] of Object.entries(input.next)) {
    const previousValue = input.previous[fieldName] ?? null;
    const normalizedNextValue = nextValue ?? null;

    if (previousValue === normalizedNextValue) {
      continue;
    }

    audits.push({
      actor: input.actor,
      tableName: input.tableName,
      fieldName,
      oldValue: previousValue,
      newValue: normalizedNextValue,
    });
  }

  return audits;
}
