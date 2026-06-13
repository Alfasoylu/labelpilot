import assert from "node:assert/strict";

import {
  buildCheckoutAddons,
  DEFAULT_ADDON_SETTINGS,
  netEuroToGrossCents,
} from "../lib/pricing/checkout-addons.ts";

const disabled = buildCheckoutAddons({
  featureEnabled: false,
  addons: {
    designService: true,
    physicalProof: true,
    express: true,
    extraDesignCount: 2,
    customerUploadsOwnData: false,
  },
  baseGrossAmountCents: 57001,
  settings: DEFAULT_ADDON_SETTINGS,
});

// When the ADDONS feature is disabled, design/express/extra-design are gated out,
// but physicalProof is intentionally always available (see checkout-addons.ts:82).
// physicalProof 10 EUR net -> 1190 cents gross.
assert.equal(disabled.addonsTotalCents, 1190);
assert.equal(disabled.lineItems.length, 1);
assert.equal(disabled.lineItems[0]?.key, "physicalProof");
assert.equal(disabled.designServiceCents, null);
assert.equal(disabled.expressCents, null);
assert.equal(disabled.extraDesignCount, 0);

const freeOwnData = buildCheckoutAddons({
  featureEnabled: true,
  addons: {
    designService: true,
    customerUploadsOwnData: true,
  },
  baseGrossAmountCents: 57001,
  settings: DEFAULT_ADDON_SETTINGS,
});

assert.equal(freeOwnData.designServiceCents, 0);

const freeThreshold = buildCheckoutAddons({
  featureEnabled: true,
  addons: {
    designService: true,
  },
  baseGrossAmountCents: 250000,
  settings: DEFAULT_ADDON_SETTINGS,
});

assert.equal(freeThreshold.designServiceCents, 0);

const priced = buildCheckoutAddons({
  featureEnabled: true,
  addons: {
    designService: true,
    physicalProof: true,
    express: true,
    extraDesignCount: 2,
  },
  baseGrossAmountCents: 57001,
  settings: DEFAULT_ADDON_SETTINGS,
});

assert.equal(priced.designServiceCents, netEuroToGrossCents(40));
assert.equal(priced.physicalProofCents, netEuroToGrossCents(10));
assert.equal(priced.expressCents, netEuroToGrossCents(9.9));
assert.equal(priced.extraDesignCents, netEuroToGrossCents(38));
assert.equal(
  priced.addonsTotalCents,
  netEuroToGrossCents(40) +
    netEuroToGrossCents(10) +
    netEuroToGrossCents(9.9) +
    netEuroToGrossCents(38),
);
assert.equal(priced.lineItems.length, 4);

console.log("Checkout add-on pricing tests passed.");
