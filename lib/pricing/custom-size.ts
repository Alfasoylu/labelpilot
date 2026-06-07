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
  shippingMinCostEur: number;
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
  // inkCostAdditionalPer10kNet is defined per 10,000 units — use the fixed batch size
  // matching the field name, independent of the tier-boundary gap.
  const additionalBatches = Math.ceil((quantity - settings.inkCostTier2MaxQty) / 10_000);
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
  return Math.max(cost, settings.shippingMinCostEur);
}

function computeMarkupMultiplier(quantity: number, settings: PricingSettingsInput): number {
  if (quantity <= settings.markupTier1MaxQty) return settings.markupTier1Multiplier;
  if (quantity <= settings.markupTier2MaxQty) return settings.markupTier2Multiplier;
  return settings.markupTier3Multiplier;
}

// Returns the best (cheapest) raw production cost for a given quantity, along with
// the chosen method and breakdown components.
function computeBestProductionCost(
  widthMm: number,
  heightMm: number,
  quantity: number,
  colorCount: number,
  anzahlSorten: number,
  params: PricingMaterialParams,
  settings: PricingSettingsInput,
): {
  cost: number;
  method: "DIGITAL" | "FLEXO";
  materialCost: number;
  inkCost: number;
  plateCost: number;
  digitalPrintingCost: number;
  shippingWeightKg: number;
  shippingCost: number;
} {
  const labelAreaM2 = (widthMm * heightMm) / 1_000_000;
  const totalAreaM2 = labelAreaM2 * quantity * (1 + params.wasteFactorPct / 100);
  const materialCost = params.materialCostPerM2 * totalAreaM2;
  const shippingWeightKg = labelAreaM2 * quantity * settings.labelWeightPerM2Grams / 1000;
  const shippingCost = computeShippingCost(shippingWeightKg, settings);

  const inkCost = computeInkCost(quantity, settings);
  const plateCost = colorCount * settings.platePerColorCostNet * anzahlSorten;
  const flexoProductionCost = materialCost + inkCost + plateCost + shippingCost;

  const digitalPrintingCost = settings.digitalCostPerUnitNet * quantity + settings.digitalSetupCostNet;
  const digitalProductionCost = materialCost + digitalPrintingCost + shippingCost;

  if (digitalProductionCost <= flexoProductionCost) {
    return {
      cost: digitalProductionCost,
      method: "DIGITAL",
      materialCost,
      inkCost: 0,
      plateCost: 0,
      digitalPrintingCost,
      shippingWeightKg,
      shippingCost,
    };
  }
  return {
    cost: flexoProductionCost,
    method: "FLEXO",
    materialCost,
    inkCost,
    plateCost,
    digitalPrintingCost: 0,
    shippingWeightKg,
    shippingCost,
  };
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
  const isHeavyShipment =
    (labelAreaM2 * quantity * settings.labelWeightPerM2Grams) / 1000 > settings.shippingHeavyThresholdKg;

  const best = computeBestProductionCost(
    widthMm, heightMm, quantity, colorCount, anzahlSorten, params, settings,
  );

  const multiplier = computeMarkupMultiplier(quantity, settings);
  let unroundedNetPrice = best.cost * multiplier;

  // Monotonicity: price must not decrease as quantity crosses a markup tier boundary.
  // When the multiplier drops at a tier boundary, the lower multiplier on a slightly
  // larger production cost can produce a lower total price than the tier below it.
  // Fix: use the price at each lower tier boundary as a floor.
  if (quantity > settings.markupTier1MaxQty) {
    const atBoundary = computeBestProductionCost(
      widthMm, heightMm, settings.markupTier1MaxQty, colorCount, anzahlSorten, params, settings,
    );
    const floorAtTier1 = atBoundary.cost * settings.markupTier1Multiplier;
    unroundedNetPrice = Math.max(unroundedNetPrice, floorAtTier1);
  }
  if (quantity > settings.markupTier2MaxQty) {
    const atBoundary = computeBestProductionCost(
      widthMm, heightMm, settings.markupTier2MaxQty, colorCount, anzahlSorten, params, settings,
    );
    const floorAtTier2 = atBoundary.cost * settings.markupTier2Multiplier;
    unroundedNetPrice = Math.max(unroundedNetPrice, floorAtTier2);
  }

  const flooredNetPrice = Math.max(unroundedNetPrice, params.minOrderValueNet);
  const netPrice = roundMoney(roundUpToStep(flooredNetPrice, settings.roundingStepNet));
  const grossPrice = roundMoney(netPrice * (1 + settings.vatPct / 100));

  return {
    quoteRequired: false,
    isHeavyShipment,
    method: best.method,
    netPrice,
    grossPrice,
    breakdown: {
      labelAreaM2: roundMoney(labelAreaM2),
      totalAreaM2: roundMoney(labelAreaM2 * quantity * (1 + params.wasteFactorPct / 100)),
      materialCost: roundMoney(best.materialCost),
      inkCost: roundMoney(best.inkCost),
      plateCost: roundMoney(best.plateCost),
      digitalPrintingCost: roundMoney(best.digitalPrintingCost),
      shippingWeightKg: roundMoney(best.shippingWeightKg),
      shippingCost: roundMoney(best.shippingCost),
      productionCost: roundMoney(best.cost),
      multiplier,
    },
  };
}
