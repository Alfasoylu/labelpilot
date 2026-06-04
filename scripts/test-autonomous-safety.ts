import assert from "node:assert/strict";

import { calculateRefillReminder } from "../lib/reorders/refill-reminder.ts";
import { validateProofDecisionRequest } from "../lib/orders/proof-decision.ts";
import {
  canApplyStripePaymentFailure,
  canApplyStripePaymentSuccess,
  canReviewArtworkOrderStatus,
  canTransitionOrderStatus,
  canUploadProofForOrderStatus,
} from "../lib/orders/status.ts";
import {
  buildAbsoluteUrlFromBase,
  isNonIndexablePath,
  isSitemapEligiblePath,
  NON_INDEXABLE_PREFIXES,
  ROBOTS_ALLOW_PATHS,
  ROBOTS_DISALLOW_PATHS,
} from "../lib/seo/governance.ts";
import { metadataMap } from "../lib/seo/metadata.ts";
import { sitemapEntries } from "../lib/site-content.ts";

assert.deepEqual(ROBOTS_ALLOW_PATHS, ["/de", "/de/"]);
assert.deepEqual(ROBOTS_DISALLOW_PATHS, [
  "/account/",
  "/admin/",
  "/api/",
  "/checkout/",
  "/de/auftrag/",
  "/de/checkout",
  "/de/gespeicherte-druckdaten",
  "/lp/",
  "/teklif/",
]);

assert.equal(isNonIndexablePath("/admin"), true);
assert.equal(isNonIndexablePath("/admin/orders"), true);
assert.equal(isNonIndexablePath("/checkout/cancel"), true);
assert.equal(isNonIndexablePath("/de/checkout"), true);
assert.equal(isNonIndexablePath("/de/auftrag/order-123/druckdaten"), true);
assert.equal(isNonIndexablePath("/de/gespeicherte-druckdaten"), true);
assert.equal(isNonIndexablePath("/lp/test"), true);
assert.equal(isNonIndexablePath("/teklif/foo"), true);
assert.equal(isNonIndexablePath("/de"), false);

assert.equal(buildAbsoluteUrlFromBase("https://labelpilot.de/", "/de"), "https://labelpilot.de/de");
assert.equal(buildAbsoluteUrlFromBase("https://labelpilot.de", "/"), "https://labelpilot.de");

const sitemapPaths = sitemapEntries.map((entry) => entry.path);
assert.equal(new Set(sitemapPaths).size, sitemapPaths.length);

for (const path of sitemapPaths) {
  assert.equal(
    isSitemapEligiblePath(path),
    true,
    `Sitemap path must remain eligible: ${path}`,
  );
  assert.ok(metadataMap[path], `Metadata entry missing for sitemap path: ${path}`);
}

for (const prefix of NON_INDEXABLE_PREFIXES) {
  assert.equal(
    sitemapPaths.some((path) => path === prefix || path.startsWith(`${prefix}/`)),
    false,
    `Forbidden path leaked into sitemap scope: ${prefix}`,
  );
}

assert.equal(canTransitionOrderStatus("PENDING_PAYMENT", "PAID"), true);
assert.equal(canTransitionOrderStatus("FILE_REVIEW", "PROOF_REQUIRED"), true);
assert.equal(canTransitionOrderStatus("WAITING_CUSTOMER_APPROVAL", "APPROVED_FOR_PRODUCTION"), true);
assert.equal(canTransitionOrderStatus("PENDING_PAYMENT", "IN_PRODUCTION"), false);
assert.equal(canTransitionOrderStatus("PAID", "SHIPPED"), false);
assert.equal(canTransitionOrderStatus("CANCELLED", "IN_PRODUCTION"), false);

assert.equal(canTransitionOrderStatus("FILE_REVIEW", "CORRECTION_REQUIRED"), true);
assert.equal(canTransitionOrderStatus("CORRECTION_REQUIRED", "FILE_REVIEW"), true);
assert.equal(canTransitionOrderStatus("CORRECTION_REQUIRED", "WAITING_CUSTOMER_APPROVAL"), true);
assert.equal(canTransitionOrderStatus("PAID", "CORRECTION_REQUIRED"), true);

assert.equal(canReviewArtworkOrderStatus("PAID"), true);
assert.equal(canReviewArtworkOrderStatus("FILE_REVIEW"), true);
assert.equal(canReviewArtworkOrderStatus("SHIPPED"), false);

assert.equal(canUploadProofForOrderStatus("FILE_REVIEW"), true);
assert.equal(canUploadProofForOrderStatus("CORRECTION_REQUIRED"), true);
assert.equal(canUploadProofForOrderStatus("PAID"), false);

assert.equal(canApplyStripePaymentSuccess("PENDING_PAYMENT"), true);
assert.equal(canApplyStripePaymentSuccess("PAYMENT_FAILED"), true);
assert.equal(canApplyStripePaymentSuccess("SHIPPED"), false);

assert.equal(canApplyStripePaymentFailure("PENDING_PAYMENT"), true);
assert.equal(canApplyStripePaymentFailure("PAYMENT_FAILED"), true);
assert.equal(canApplyStripePaymentFailure("COMPLETED"), false);

const mediumReminder = calculateRefillReminder({
  anchorDate: new Date("2026-06-03T00:00:00.000Z"),
  stockDuration: "ONE_TO_THREE_MONTHS",
});
assert.equal(mediumReminder.shouldScheduleReminder, true);
assert.equal(mediumReminder.reason, "scheduled");
assert.equal(mediumReminder.algorithmVersion, "v1");
assert.equal(mediumReminder.reminderEligibleAt?.toISOString(), "2026-07-03T00:00:00.000Z");
assert.equal(mediumReminder.predictedDepletionAt.toISOString(), "2026-08-02T00:00:00.000Z");

const shortReminder = calculateRefillReminder({
  anchorDate: new Date("2026-06-03T00:00:00.000Z"),
  stockDuration: "UNDER_4_WEEKS",
});
assert.equal(shortReminder.shouldScheduleReminder, false);
assert.equal(shortReminder.reason, "below_30_day_window");
assert.equal(shortReminder.reminderEligibleAt, null);

const missingToken = validateProofDecisionRequest({
  decision: "approve",
});
assert.deepEqual(missingToken, {
  ok: false,
  status: 403,
  error: "Sie haben keinen Zugriff auf diese Bestellung.",
});

const invalidDecision = validateProofDecisionRequest({
  token: "abc",
  decision: undefined,
});
assert.deepEqual(invalidDecision, {
  ok: false,
  status: 400,
  error: "Ungültige Rückmeldung.",
});

const missingChangeNote = validateProofDecisionRequest({
  token: "abc",
  decision: "request_changes",
});
assert.deepEqual(missingChangeNote, {
  ok: false,
  status: 400,
  error: "Bitte beschreiben Sie den Änderungswunsch.",
});

const wrongOrder = validateProofDecisionRequest(
  {
    token: "abc",
    decision: "approve",
  },
  {
    orderExists: false,
    uploadToken: null,
    proofMatchesOrder: false,
    proofStatus: null,
    orderStatus: "WAITING_CUSTOMER_APPROVAL",
  },
);
assert.deepEqual(wrongOrder, {
  ok: false,
  status: 403,
  error: "Sie haben keinen Zugriff auf diese Bestellung.",
});

const wrongStatus = validateProofDecisionRequest(
  {
    token: "abc",
    decision: "approve",
  },
  {
    orderExists: true,
    uploadToken: "abc",
    proofMatchesOrder: true,
    proofStatus: "WAITING_CUSTOMER_APPROVAL",
    orderStatus: "FILE_REVIEW",
  },
);
assert.deepEqual(wrongStatus, {
  ok: false,
  status: 409,
  error: "Für diesen Proof ist derzeit keine Rückmeldung möglich.",
});

const wrongProofState = validateProofDecisionRequest(
  {
    token: "abc",
    decision: "approve",
  },
  {
    orderExists: true,
    uploadToken: "abc",
    proofMatchesOrder: true,
    proofStatus: "APPROVED",
    orderStatus: "WAITING_CUSTOMER_APPROVAL",
  },
);
assert.deepEqual(wrongProofState, {
  ok: false,
  status: 409,
  error: "Für diesen Proof ist derzeit keine Rückmeldung möglich.",
});

const validApprove = validateProofDecisionRequest(
  {
    token: "abc",
    decision: "approve",
  },
  {
    orderExists: true,
    uploadToken: "abc",
    proofMatchesOrder: true,
    proofStatus: "WAITING_CUSTOMER_APPROVAL",
    orderStatus: "WAITING_CUSTOMER_APPROVAL",
  },
);
assert.deepEqual(validApprove, { ok: true });

const validRequestChanges = validateProofDecisionRequest(
  {
    token: "abc",
    decision: "request_changes",
    note: "Bitte die Schrift groesser setzen.",
  },
  {
    orderExists: true,
    uploadToken: "abc",
    proofMatchesOrder: true,
    proofStatus: "WAITING_CUSTOMER_APPROVAL",
    orderStatus: "WAITING_CUSTOMER_APPROVAL",
  },
);
assert.deepEqual(validRequestChanges, { ok: true });

console.log("Autonomous safety regression tests passed.");
