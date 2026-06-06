import assert from "node:assert/strict";

import {
  designServicePrice,
  expressPrice,
  extraDesignPrice,
  physicalProofPrice,
} from "../lib/pricing/addons.ts";
import { computeCustomSizePrice } from "../lib/pricing/custom-size.ts";

const params = {
  materialKey: "OPAQUE_PP" as const,
  materialCostPerM2: 70,
  wasteFactorPct: 15,
  targetMarginPct: 55,
  minOrderValueNet: 75,
};

const settings = {
  vatPct: 19,
  roundingStepNet: 1,
  customMaxWidthMm: 312,
  customMaxHeightMm: 700,
  customMaxQuantity: 300000,
  platePerColorCostNet: 40,
  inkCostTier1Net: 100,
  inkCostTier1MaxQty: 10000,
  inkCostTier2Net: 170,
  inkCostTier2MaxQty: 20000,
  inkCostAdditionalPer10kNet: 70,
};

// 1000 adet, 4 renk CMYK
const result1000 = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 100,
  heightMm: 200,
  quantity: 1000,
  colorCount: 4,
  params,
  settings,
});

assert.equal(result1000.quoteRequired, false);
// inkCost should be tier 1 (100 EUR)
assert.equal(result1000.breakdown.inkCost, 100);
// plateCost = 4 * 40 = 160 EUR
assert.equal(result1000.breakdown.plateCost, 160);

// 15000 adet → tier 2 ink cost (170 EUR)
const result15k = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 100,
  heightMm: 200,
  quantity: 15000,
  colorCount: 4,
  params,
  settings,
});
assert.equal(result15k.breakdown.inkCost, 170);

// 25000 adet → tier 2 + 1 additional batch (170 + 70 = 240 EUR)
const result25k = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 100,
  heightMm: 200,
  quantity: 25000,
  colorCount: 4,
  params,
  settings,
});
assert.equal(result25k.breakdown.inkCost, 240);

// Min order value floor
const minOrder = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 20,
  heightMm: 20,
  quantity: 10,
  colorCount: 1,
  params,
  settings,
});
assert.equal(minOrder.netPrice >= 75, true);

// Rounding step
const rounded = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 80,
  heightMm: 120,
  quantity: 1000,
  colorCount: 4,
  params: { ...params, targetMarginPct: 37 },
  settings: { ...settings, roundingStepNet: 5 },
});
assert.equal(rounded.netPrice % 5, 0);

// Quote required when dimensions exceed max
const quoteRequired = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 400,
  heightMm: 200,
  quantity: 1000,
  colorCount: 4,
  params,
  settings,
});
assert.equal(quoteRequired.quoteRequired, true);

const addonSettings = {
  designServiceNet: 40,
  designServiceFreeThresholdNet: 2000,
  physicalProofNet: 10,
  expressNet: 9.9,
  extraDesignNet: 19,
};

assert.equal(
  designServicePrice({
    orderNetTotal: 500,
    customerUploadsOwnData: false,
    settings: addonSettings,
  }),
  40,
);

assert.equal(
  designServicePrice({
    orderNetTotal: 2100,
    customerUploadsOwnData: false,
    settings: addonSettings,
  }),
  0,
);

assert.equal(
  designServicePrice({
    orderNetTotal: 500,
    customerUploadsOwnData: true,
    settings: addonSettings,
  }),
  0,
);

assert.equal(physicalProofPrice(addonSettings), 10);
assert.equal(expressPrice(addonSettings), 9.9);
assert.equal(extraDesignPrice(3, addonSettings), 57);

console.log("Custom-size pricing engine tests passed.");
