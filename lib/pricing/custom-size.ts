export type PricingMaterialKey = "OPAQUE_PP" | "TRANSPARENT_PP";

export type PricingMaterialParams = {
  materialKey: PricingMaterialKey;
  materialCostPerM2: number;
  digitalPrintCostPerM2: number;
  flexoPrintCostPerM2: number;
  flexoPlateCost: number;
  wasteFactorPct: number;
  targetMarginPct: number;
  minOrderValueNet: number;
  setupFeeNet?: number | null;
};

export type PricingSettingsInput = {
  vatPct: number;
  roundingStepNet: number;
  customMaxWidthMm: number;
  customMaxHeightMm: number;
  customMaxQuantity: number;
};

export type CustomSizePriceInput = {
  materialKey: PricingMaterialKey;
  widthMm: number;
  heightMm: number;
  quantity: number;
  params: PricingMaterialParams;
  settings: PricingSettingsInput;
};

export type CustomSizePriceResult = {
  quoteRequired: boolean;
  method: "DIGITAL" | "FLEXO";
  netPrice: number;
  grossPrice: number;
  breakdown: {
    labelAreaM2: number;
    totalAreaM2: number;
    materialCost: number;
    digitalCost: number;
    flexoCost: number;
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

export function computeCustomSizePrice(
  input: CustomSizePriceInput,
): CustomSizePriceResult {
  const { widthMm, heightMm, quantity, params, settings } = input;

  if (widthMm <= 0 || heightMm <= 0 || quantity <= 0) {
    throw new RangeError("Width, height and quantity must be positive.");
  }

  if (
    widthMm > settings.customMaxWidthMm ||
    heightMm > settings.customMaxHeightMm ||
    quantity > settings.customMaxQuantity
  ) {
    return {
      quoteRequired: true,
      method: "DIGITAL",
      netPrice: 0,
      grossPrice: 0,
      breakdown: {
        labelAreaM2: 0,
        totalAreaM2: 0,
        materialCost: 0,
        digitalCost: 0,
        flexoCost: 0,
        productionCost: 0,
      },
    };
  }

  const labelAreaM2 = (widthMm * heightMm) / 1_000_000;
  const totalAreaM2 = labelAreaM2 * quantity * (1 + params.wasteFactorPct / 100);
  const materialCost = params.materialCostPerM2 * totalAreaM2;
  const digitalCost = materialCost + params.digitalPrintCostPerM2 * totalAreaM2;
  const flexoCost =
    materialCost +
    params.flexoPrintCostPerM2 * totalAreaM2 +
    params.flexoPlateCost;

  const method = digitalCost <= flexoCost ? "DIGITAL" : "FLEXO";
  const productionCost = method === "DIGITAL" ? digitalCost : flexoCost;

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
    method,
    netPrice,
    grossPrice,
    breakdown: {
      labelAreaM2: roundMoney(labelAreaM2),
      totalAreaM2: roundMoney(totalAreaM2),
      materialCost: roundMoney(materialCost),
      digitalCost: roundMoney(digitalCost),
      flexoCost: roundMoney(flexoCost),
      productionCost: roundMoney(productionCost),
    },
  };
}
