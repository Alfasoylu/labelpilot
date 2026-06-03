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

const lowQuantity = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 100,
  heightMm: 200,
  quantity: 1000,
  params,
  settings,
});

assert.equal(
  lowQuantity.method,
  lowQuantity.breakdown.digitalCost <= lowQuantity.breakdown.flexoCost
    ? "DIGITAL"
    : "FLEXO",
);

const highQuantity = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 100,
  heightMm: 200,
  quantity: 100000,
  params,
  settings,
});

assert.equal(highQuantity.method, "FLEXO");

const minOrder = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 20,
  heightMm: 20,
  quantity: 10,
  params,
  settings,
});

assert.equal(minOrder.netPrice, 75);

const rounded = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 80,
  heightMm: 120,
  quantity: 1000,
  params: {
    ...params,
    targetMarginPct: 37,
  },
  settings: {
    ...settings,
    roundingStepNet: 5,
  },
});

assert.equal(rounded.netPrice % 5, 0);

const quoteRequired = computeCustomSizePrice({
  materialKey: "OPAQUE_PP",
  widthMm: 400,
  heightMm: 200,
  quantity: 1000,
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
