import assert from "node:assert/strict";

import { buildPublicCustomSizePriceResponse } from "../lib/pricing/custom-size-public.ts";

const params = {
  materialKey: "OPAQUE_PP" as const,
  materialCostPerM2: 12,
  digitalPrintCostPerM2: 16,
  flexoPrintCostPerM2: 5,
  flexoPlateCost: 80,
  wasteFactorPct: 8,
  targetMarginPct: 50,
  minOrderValueNet: 75,
  setupFeeNet: null,
};

const settings = {
  vatPct: 19,
  roundingStepNet: 1,
  customMaxWidthMm: 312,
  customMaxHeightMm: 700,
  customMaxQuantity: 300000,
};

const featureDisabled = buildPublicCustomSizePriceResponse({
  featureEnabled: false,
  request: {
    materialKey: "OPAQUE_PP",
    widthMm: 100,
    heightMm: 200,
    quantity: 1000,
  },
  params,
  settings,
});

assert.equal(featureDisabled.status, 404);
assert.equal(featureDisabled.body, null);

const notConfigured = buildPublicCustomSizePriceResponse({
  featureEnabled: true,
  request: {
    materialKey: "OPAQUE_PP",
    widthMm: 100,
    heightMm: 200,
    quantity: 1000,
  },
  params: null,
  settings,
});

assert.equal(notConfigured.status, 200);
assert.deepEqual(notConfigured.body, { configured: false });

const quoteRequired = buildPublicCustomSizePriceResponse({
  featureEnabled: true,
  request: {
    materialKey: "OPAQUE_PP",
    widthMm: 400,
    heightMm: 200,
    quantity: 1000,
  },
  params,
  settings,
});

assert.equal(quoteRequired.status, 200);
assert.equal(quoteRequired.body?.configured, true);
if (quoteRequired.body?.configured) {
  assert.equal(quoteRequired.body.quoteRequired, true);
  assert.equal("breakdown" in quoteRequired.body, false);
  assert.equal("method" in quoteRequired.body, false);
}

const normal = buildPublicCustomSizePriceResponse({
  featureEnabled: true,
  request: {
    materialKey: "OPAQUE_PP",
    widthMm: 100,
    heightMm: 200,
    quantity: 5000,
  },
  params,
  settings,
});

assert.equal(normal.status, 200);
assert.equal(normal.body?.configured, true);
if (normal.body?.configured) {
  assert.equal(normal.body.quoteRequired, false);
  assert.ok(normal.body.netPrice > 0);
  assert.ok(normal.body.grossPrice > normal.body.netPrice);
  assert.equal("breakdown" in normal.body, false);
  assert.equal("method" in normal.body, false);
}

console.log("Custom-size public response tests passed.");
