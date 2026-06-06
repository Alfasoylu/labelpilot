export type PricingMaterialKey = "OPAQUE_PP" | "TRANSPARENT_PP";

export type PricingMaterialParams = {
  materialKey: PricingMaterialKey;
  materialCostPerM2: number;
  wasteFactorPct: number;
  minOrderValueNet: number;
};

export type PricingSettingsInput = {
  vatPct: number;
  roundingStepNet: number;
  customMaxWidthMm: number;
  customMaxHeightMm: number;
  customMaxQuantity: number;
  // Flexo: plate cost per color
  platePerColorCostNet: number;
  // Flexo: ink cost tiers (flat fee by quantity range)
  inkCostTier1Net: number;
  inkCostTier1MaxQty: number;
  inkCostTier2Net: number;
  inkCostTier2MaxQty: number;
  inkCostAdditionalPer10kNet: number;
  // Digital: per-unit + fixed setup fee
  digitalCostPerUnitNet: number;
  digitalSetupCostNet: number;
  // Quantity-based markup multipliers
  markupTier1Multiplier: number;
  markupTier1MaxQty: number;
  markupTier2Multiplier: number;
  markupTier2MaxQty: number;
  markupTier3Multiplier: number;
  // Shipping — embedded in net price (progressive tiers)
  labelWeightPerM2Grams: number;
  shippingTier1MaxKg: number;
  shippingTier1RateEur: number;
  shippingTier2MaxKg: number;
  shippingTier2RateEur: number;
  shippingTier3RateEur: number;
  shippingHeavyThresholdKg: number;
};

export type CustomSizePriceInput = {
  materialKey: PricingMaterialKey;
  widthMm: number;
  heightMm: number;
  quantity: number;
  colorCount: number;
  anzahlSorten: number;
  params: PricingMaterialParams;
  settings: PricingSettingsInput;
};

export type CustomSizePriceResult = {
  quoteRequired: boolean;
  isHeavyShipment: boolean;
  method: "DIGITAL" | "FLEXO";
  netPrice: number;
  grossPrice: number;
  breakdown: {
    labelAreaM2: number;
    totalAreaM2: number;
    materialCost: number;
    inkCost: number;
    plateCost: number;
    digitalPrintingCost: number;
    shippingWeightKg: number;
    shippingCost: number;
    productionCost: number;
    multiplier: number;
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

function computeShippingCost(kg: number, settings: PricingSettingsInput): number {
  // Progressive tiers: each portion billed at its own rate
  const tier1Kg = Math.min(kg, settings.shippingTier1MaxKg);
  let cost = tier1Kg * settings.shippingTier1RateEur;
  if (kg > settings.shippingTier1MaxKg) {
    const tier2Kg = Math.min(kg - settings.shippingTier1MaxKg, settings.shippingTier2MaxKg - settings.shippingTier1MaxKg);
    cost += tier2Kg * settings.shippingTier2RateEur;
  }
  if (kg > settings.shippingTier2MaxKg) {
    cost += (kg - settings.shippingTier2MaxKg) * settings.shippingTier3RateEur;
  }
  return cost;
}

function computeMarkupMultiplier(quantity: number, settings: PricingSettingsInput): number {
  if (quantity <= settings.markupTier1MaxQty) return settings.markupTier1Multiplier;
  if (quantity <= settings.markupTier2MaxQty) return settings.markupTier2Multiplier;
  return settings.markupTier3Multiplier;
}

export function computeCustomSizePrice(
  input: CustomSizePriceInput,
): CustomSizePriceResult {
  const { widthMm, heightMm, quantity, colorCount, anzahlSorten, params, settings } = input;

  if (widthMm <= 0 || heightMm <= 0 || quantity <= 0 || colorCount < 1 || anzahlSorten < 1) {
    throw new RangeError("Width, height, quantity, colorCount and anzahlSorten must be positive.");
  }

  if (
    widthMm > settings.customMaxWidthMm ||
    heightMm > settings.customMaxHeightMm ||
    quantity > settings.customMaxQuantity
  ) {
    return {
      quoteRequired: true,
      isHeavyShipment: false,
      method: "DIGITAL",
      netPrice: 0,
      grossPrice: 0,
      breakdown: {
        labelAreaM2: 0,
        totalAreaM2: 0,
        materialCost: 0,
        inkCost: 0,
        plateCost: 0,
        digitalPrintingCost: 0,
        shippingWeightKg: 0,
        shippingCost: 0,
        productionCost: 0,
        multiplier: 0,
      },
    };
  }

  const labelAreaM2 = (widthMm * heightMm) / 1_000_000;
  const totalAreaM2 = labelAreaM2 * quantity * (1 + params.wasteFactorPct / 100);
  const materialCost = params.materialCostPerM2 * totalAreaM2;

  // Shipping — computed on actual label area (no waste factor), embedded in price
  const shippingWeightKg = labelAreaM2 * quantity * settings.labelWeightPerM2Grams / 1000;
  const shippingCost = computeShippingCost(shippingWeightKg, settings);
  const isHeavyShipment = shippingWeightKg > settings.shippingHeavyThresholdKg;

  // Flexo path
  const inkCost = computeInkCost(quantity, settings);
  const plateCost = colorCount * settings.platePerColorCostNet * anzahlSorten;
  const flexoProductionCost = materialCost + inkCost + plateCost + shippingCost;

  // Digital path
  const digitalPrintingCost = settings.digitalCostPerUnitNet * quantity + settings.digitalSetupCostNet;
  const digitalProductionCost = materialCost + digitalPrintingCost + shippingCost;

  // Auto-select cheaper method
  const method = digitalProductionCost <= flexoProductionCost ? "DIGITAL" : "FLEXO";
  const productionCost = method === "DIGITAL" ? digitalProductionCost : flexoProductionCost;

  const multiplier = computeMarkupMultiplier(quantity, settings);
  const unroundedNetPrice = productionCost * multiplier;
  const flooredNetPrice = Math.max(unroundedNetPrice, params.minOrderValueNet);
  const netPrice = roundMoney(roundUpToStep(flooredNetPrice, settings.roundingStepNet));
  const grossPrice = roundMoney(netPrice * (1 + settings.vatPct / 100));

  return {
    quoteRequired: false,
    isHeavyShipment,
    method,
    netPrice,
    grossPrice,
    breakdown: {
      labelAreaM2: roundMoney(labelAreaM2),
      totalAreaM2: roundMoney(totalAreaM2),
      materialCost: roundMoney(materialCost),
      inkCost: method === "FLEXO" ? roundMoney(inkCost) : 0,
      plateCost: method === "FLEXO" ? roundMoney(plateCost) : 0,
      digitalPrintingCost: method === "DIGITAL" ? roundMoney(digitalPrintingCost) : 0,
      shippingWeightKg: roundMoney(shippingWeightKg),
      shippingCost: roundMoney(shippingCost),
      productionCost: roundMoney(productionCost),
      multiplier,
    },
  };
}
