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
  materialCostPerM2: 0.8,
  wasteFactorPct: 15,
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
  shippingHeavyThresholdKg: 100,
};

// 1000 adet, 4 renk CMYK, 1 sorten — small quantity, digital should win vs flexo
// Digital cost: 0.10 * 1000 + 40 = 140 EUR
// Flexo cost: ink(100) + plates(4*40*1=160) = 260 EUR
// Material cost: 0.8 * (100*200/1M) * 1000 * 1.15 = 0.8 * 0.02 * 1000 * 1.15 = 18.4 EUR
// Digital total: 18.4 + 140 = 158.4 EUR
// Flexo total: 18.4 + 260 = 278.4 EUR → DIGITAL wins
const result1000 = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 100,
  heightMm: 200,
  quantity: 1000,
  colorCount: 4,
  anzahlSorten: 1,
  params,
  settings,
});

assert.equal(result1000.quoteRequired, false);
assert.equal(result1000.method, "DIGITAL");
assert.equal(result1000.breakdown.inkCost, 0);
assert.equal(result1000.breakdown.plateCost, 0);
assert.ok(result1000.breakdown.digitalPrintingCost > 0);

// 1000 adet, 4 renk, 3 sorten — more plates, still digital?
// Flexo: ink(100) + plates(4*40*3=480) = 580 EUR
// Digital: same 140 EUR → DIGITAL still wins with multiple sorten
const result1000_3sorten = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 100,
  heightMm: 200,
  quantity: 1000,
  colorCount: 4,
  anzahlSorten: 3,
  params,
  settings,
});
assert.equal(result1000_3sorten.method, "DIGITAL");

// High quantity — flexo should become cheaper eventually
// 50000 adet, 4 renk: digital = 0.10*50000+40 = 5040 EUR; flexo ink=170+3*70=380, plates=160; flexo=540
// With material for 50k: material >> both printing costs
// Flexo: 18.4*(50/1) + 540 = 920+540 — let's just check method changes to FLEXO at high qty
const result50k = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 100,
  heightMm: 200,
  quantity: 50000,
  colorCount: 4,
  anzahlSorten: 1,
  params,
  settings,
});
assert.equal(result50k.method, "FLEXO");
assert.ok(result50k.breakdown.inkCost > 0);
assert.ok(result50k.breakdown.plateCost > 0);

// anzahlSorten multiplies plate cost for flexo
const result_flexo_2sorten = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 100,
  heightMm: 200,
  quantity: 50000,
  colorCount: 4,
  anzahlSorten: 2,
  params,
  settings,
});
const result_flexo_1sorten = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 100,
  heightMm: 200,
  quantity: 50000,
  colorCount: 4,
  anzahlSorten: 1,
  params,
  settings,
});
assert.equal(result_flexo_2sorten.breakdown.plateCost, result_flexo_1sorten.breakdown.plateCost * 2);

// Markup tiers: ≤5000 → ×1.8, ≤10000 → ×1.6, >10000 → ×1.5
assert.equal(result1000.breakdown.multiplier, 1.8);

const result6k = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 100,
  heightMm: 200,
  quantity: 6000,
  colorCount: 1,
  anzahlSorten: 1,
  params,
  settings,
});
assert.equal(result6k.breakdown.multiplier, 1.6);
assert.equal(result50k.breakdown.multiplier, 1.5);

// inkCost tiers for flexo — 15000 adet → tier 2 (170 EUR)
const result15k = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 100,
  heightMm: 200,
  quantity: 15000,
  colorCount: 4,
  anzahlSorten: 1,
  params,
  settings,
});
assert.equal(result15k.method, "FLEXO");
assert.equal(result15k.breakdown.inkCost, 170);

// 25000 adet → tier 2 + 1 additional batch (170 + 70 = 240 EUR)
const result25k = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 100,
  heightMm: 200,
  quantity: 25000,
  colorCount: 4,
  anzahlSorten: 1,
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
  anzahlSorten: 1,
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
  anzahlSorten: 1,
  params,
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
  anzahlSorten: 1,
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
