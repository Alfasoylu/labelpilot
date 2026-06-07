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
  // Flexo: ink cost per m² per color (scales with label area and color count)
  inkCostPerM2PerColorNet: number;
  // Digital: all-in cost and selling price per m² (include material + printing)
  digitalCostPerM2Net: number;
  digitalSellingPricePerM2Net: number;
  // Matt finish: flat net surcharge added after base price calculation (0 = disabled)
  mattSurchargeNet: number;
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
  finishing?: "MATT" | "GLAENZEND";
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
    mattSurcharge: number;
  };
};

function roundUpToStep(value: number, step: number) {
  const safeStep = step > 0 ? step : 1;
  return Math.ceil((value + Number.EPSILON) / safeStep) * safeStep;
}

function roundMoney(value: number) {
  return Number(value.toFixed(2));
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

// Returns the best (cheapest) production cost for a given quantity along with the
// customer-facing selling price for that method and a cost breakdown.
// Digital uses a fixed per-m² selling price (margin embedded); flexo uses cost × multiplier.
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
  sellingPrice: number;
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

  // Flexo ink: scales with printed area and color count
  const inkCost = settings.inkCostPerM2PerColorNet * colorCount * totalAreaM2;
  const plateCost = colorCount * settings.platePerColorCostNet * anzahlSorten;
  const flexoCost = materialCost + inkCost + plateCost + shippingCost;
  const flexoSellingPrice = flexoCost * computeMarkupMultiplier(quantity, settings);

  // Digital: all-in per-m² cost (includes material + printing).
  // The selling price uses a separate configurable per-m² rate — margin is embedded.
  const digitalCost = settings.digitalCostPerM2Net * totalAreaM2 + shippingCost;
  const digitalSellingPrice = settings.digitalSellingPricePerM2Net * totalAreaM2 + shippingCost;

  if (digitalCost <= flexoCost) {
    return {
      cost: digitalCost,
      sellingPrice: digitalSellingPrice,
      method: "DIGITAL",
      materialCost: 0,
      inkCost: 0,
      plateCost: 0,
      digitalPrintingCost: settings.digitalSellingPricePerM2Net * totalAreaM2,
      shippingWeightKg,
      shippingCost,
    };
  }
  return {
    cost: flexoCost,
    sellingPrice: flexoSellingPrice,
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
        mattSurcharge: 0,
      },
    };
  }

  const labelAreaM2 = (widthMm * heightMm) / 1_000_000;
  const isHeavyShipment =
    (labelAreaM2 * quantity * settings.labelWeightPerM2Grams) / 1000 > settings.shippingHeavyThresholdKg;

  const best = computeBestProductionCost(
    widthMm, heightMm, quantity, colorCount, anzahlSorten, params, settings,
  );

  // Use the method-specific selling price directly.
  // Digital: fixed per-m² selling price (no additional multiplier).
  // Flexo: cost × multiplier (already computed inside computeBestProductionCost).
  let unroundedNetPrice = best.sellingPrice;

  // Monotonicity: price must not drop as quantity crosses a markup tier boundary.
  // Applies to both methods — compute the best selling price at the boundary qty as floor.
  if (quantity > settings.markupTier1MaxQty) {
    const atBoundary = computeBestProductionCost(
      widthMm, heightMm, settings.markupTier1MaxQty, colorCount, anzahlSorten, params, settings,
    );
    unroundedNetPrice = Math.max(unroundedNetPrice, atBoundary.sellingPrice);
  }
  if (quantity > settings.markupTier2MaxQty) {
    const atBoundary = computeBestProductionCost(
      widthMm, heightMm, settings.markupTier2MaxQty, colorCount, anzahlSorten, params, settings,
    );
    unroundedNetPrice = Math.max(unroundedNetPrice, atBoundary.sellingPrice);
  }

  const mattSurcharge = input.finishing === "MATT" ? settings.mattSurchargeNet : 0;
  const flooredNetPrice = Math.max(unroundedNetPrice, params.minOrderValueNet);
  const netPrice = roundMoney(roundUpToStep(flooredNetPrice + mattSurcharge, settings.roundingStepNet));
  const grossPrice = roundMoney(netPrice * (1 + settings.vatPct / 100));

  // For display: digital has no separate multiplier (it is embedded in sellingPricePerM2).
  const multiplier = best.method === "DIGITAL" ? 1 : computeMarkupMultiplier(quantity, settings);

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
      mattSurcharge: roundMoney(mattSurcharge),
    },
  };
}
