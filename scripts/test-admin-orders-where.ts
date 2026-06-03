import assert from "node:assert/strict";

import {
  ADMIN_ORDER_ADDONS_OR,
  buildAdminOrdersListWhere,
  hasOrderAddons,
} from "../lib/admin/orders.ts";

const defaultWhere = buildAdminOrdersListWhere({
  status: "review-needed",
  artworkStatus: "all",
  addons: "all",
  q: "",
});

assert.ok(Array.isArray((defaultWhere as { OR?: unknown[] }).OR));
assert.equal("AND" in defaultWhere, false);

const filteredWhere = buildAdminOrdersListWhere({
  status: "review-needed",
  artworkStatus: "ARTWORK_UPLOADED",
  addons: "with",
  q: "pilot",
});

assert.ok(Array.isArray((filteredWhere as { OR?: unknown[] }).OR));
assert.ok(Array.isArray((filteredWhere as { AND?: unknown[] }).AND));
assert.equal((filteredWhere as { AND: unknown[] }).AND.length, 2);
assert.deepEqual((filteredWhere as { AND: Array<{ OR: unknown[] }> }).AND[1], {
  OR: [...ADMIN_ORDER_ADDONS_OR],
});

assert.equal(
  hasOrderAddons({
    designServiceCents: 0,
    physicalProofCents: null,
    expressCents: null,
    extraDesignCount: 0,
    addonsTotalCents: null,
  }),
  true,
);

console.log("Admin order where tests passed.");
