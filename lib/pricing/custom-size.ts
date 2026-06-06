export type PricingMaterialKey = "OPAQUE_PP" | "TRANSPARENT_PP";

export type PricingMaterialParams = {
  materialKey: PricingMaterialKey;
  materialCostPerM2: number;
  wasteFactorPct: number;
  targetMarginPct: number;
  minOrderValueNet: number;
};

export type PricingSettingsInput = {
  vatPct: number;
  roundingStepNet: number;
  customMaxWidthMm: number;
  customMaxHeightMm: number;
  customMaxQuantity: number;
  // Kalıp (plate) maliyeti — renk başına
  platePerColorCostNet: number;
  // Boya maliyeti kademeleri
  inkCostTier1Net: number;
  inkCostTier1MaxQty: number;
  inkCostTier2Net: number;
  inkCostTier2MaxQty: number;
  inkCostAdditionalPer10kNet: number;
};

export type CustomSizePriceInput = {
  materialKey: PricingMaterialKey;
  widthMm: number;
  heightMm: number;
  quantity: number;
  colorCount: number;
  params: PricingMaterialParams;
  settings: PricingSettingsInput;
};

export type CustomSizePriceResult = {
  quoteRequired: boolean;
  netPrice: number;
  grossPrice: number;
  breakdown: {
    labelAreaM2: number;
    totalAreaM2: number;
    materialCost: number;
    inkCost: number;
    plateCost: number;
    productionCost: number;
  };
};

function roundUpToStep(value: number, step: number) {
  const safeStep = step > 0 ? step : 1;
  return Math.ceil((value + Number.EPSILON) / safeStep) * safeStep;
}

function roundMoney(value: number) {
  return Number(value.toFixed(2));
}

function computeInkCost(quantity: number, settings: PricingSettingsInput): number {
  if (quantity <= settings.inkCostTier1MaxQty) {
    return settings.inkCostTier1Net;
  }
  if (quantity <= settings.inkCostTier2MaxQty) {
    return settings.inkCostTier2Net;
  }
  const batchSize = settings.inkCostTier2MaxQty - settings.inkCostTier1MaxQty;
  const safeBatch = batchSize > 0 ? batchSize : 10_000;
  const additionalBatches = Math.ceil((quantity - settings.inkCostTier2MaxQty) / safeBatch);
  return settings.inkCostTier2Net + additionalBatches * settings.inkCostAdditionalPer10kNet;
}

export function computeCustomSizePrice(
  input: CustomSizePriceInput,
): CustomSizePriceResult {
  const { widthMm, heightMm, quantity, colorCount, params, settings } = input;

  if (widthMm <= 0 || heightMm <= 0 || quantity <= 0 || colorCount < 1) {
    throw new RangeError("Width, height, quantity and colorCount must be positive.");
  }

  if (
    widthMm > settings.customMaxWidthMm ||
    heightMm > settings.customMaxHeightMm ||
    quantity > settings.customMaxQuantity
  ) {
    return {
      quoteRequired: true,
      netPrice: 0,
      grossPrice: 0,
      breakdown: {
        labelAreaM2: 0,
        totalAreaM2: 0,
        materialCost: 0,
        inkCost: 0,
        plateCost: 0,
        productionCost: 0,
      },
    };
  }

  const labelAreaM2 = (widthMm * heightMm) / 1_000_000;
  const totalAreaM2 = labelAreaM2 * quantity * (1 + params.wasteFactorPct / 100);
  const materialCost = params.materialCostPerM2 * totalAreaM2;
  const inkCost = computeInkCost(quantity, settings);
  const plateCost = colorCount * settings.platePerColorCostNet;
  const productionCost = materialCost + inkCost + plateCost;

  const marginFactor = 1 - params.targetMarginPct / 100;
  if (marginFactor <= 0) {
    throw new RangeError("Target margin must be below 100%.");
  }

  const unroundedNetPrice = productionCost / marginFactor;
  const flooredNetPrice = Math.max(unroundedNetPrice, params.minOrderValueNet);
  const netPrice = roundMoney(roundUpToStep(flooredNetPrice, settings.roundingStepNet));
  const grossPrice = roundMoney(netPrice * (1 + settings.vatPct / 100));

  return {
    quoteRequired: false,
    netPrice,
    grossPrice,
    breakdown: {
      labelAreaM2: roundMoney(labelAreaM2),
      totalAreaM2: roundMoney(totalAreaM2),
      materialCost: roundMoney(materialCost),
      inkCost: roundMoney(inkCost),
      plateCost: roundMoney(plateCost),
      productionCost: roundMoney(productionCost),
    },
  };
}
