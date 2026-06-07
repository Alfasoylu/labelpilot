import assert from "node:assert/strict";

import { buildPublicCustomSizePriceResponse } from "../lib/pricing/custom-size-public.ts";

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
  inkCostPerM2PerColorNet: 0.33,
  digitalCostPerM2Net: 8,
  digitalSellingPricePerM2Net: 12,
  mattSurchargeNet: 0,
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
  shippingHeavyThresholdKg: 100,
};

const featureDisabled = buildPublicCustomSizePriceResponse({
  featureEnabled: false,
  request: { materialKey: "OPAQUE_PP", widthMm: 100, heightMm: 200, quantity: 1000, colorCount: 4, anzahlSorten: 1 },
  params,
  settings,
});

assert.equal(featureDisabled.status, 404);
assert.equal(featureDisabled.body, null);

const notConfigured = buildPublicCustomSizePriceResponse({
  featureEnabled: true,
  request: { materialKey: "OPAQUE_PP", widthMm: 100, heightMm: 200, quantity: 1000, colorCount: 4, anzahlSorten: 1 },
  params: null,
  settings,
});

assert.equal(notConfigured.status, 200);
assert.deepEqual(notConfigured.body, { configured: false });

const quoteRequired = buildPublicCustomSizePriceResponse({
  featureEnabled: true,
  request: { materialKey: "OPAQUE_PP", widthMm: 400, heightMm: 200, quantity: 1000, colorCount: 4, anzahlSorten: 1 },
  params,
  settings,
});

assert.equal(quoteRequired.status, 200);
assert.equal(quoteRequired.body?.configured, true);
if (quoteRequired.body?.configured) {
  assert.equal(quoteRequired.body.quoteRequired, true);
}

const normal = buildPublicCustomSizePriceResponse({
  featureEnabled: true,
  request: { materialKey: "OPAQUE_PP", widthMm: 100, heightMm: 200, quantity: 5000, colorCount: 4, anzahlSorten: 1 },
  params,
  settings,
});

assert.equal(normal.status, 200);
assert.equal(normal.body?.configured, true);
if (normal.body?.configured) {
  assert.equal(normal.body.quoteRequired, false);
  assert.ok(normal.body.netPrice > 0);
  assert.ok(normal.body.grossPrice > normal.body.netPrice);
  assert.ok(normal.body.method === "DIGITAL" || normal.body.method === "FLEXO");
  assert.ok("breakdown" in normal.body);
}

console.log("Custom-size public response tests passed.");
