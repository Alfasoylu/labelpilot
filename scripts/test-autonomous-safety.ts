import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { buildCanonicalMetadata } from "../lib/seo.ts";
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
import {
  deferredPhase2Routes,
  glossaryPagesBySlug,
  guidePagesBySlug,
  hubPagesBySlug,
  publicPagesBySlug,
  sitemapEntries,
} from "../lib/site-content.ts";

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
assert.equal(isSitemapEligiblePath("/de/wunschformat"), false);

assert.equal(buildAbsoluteUrlFromBase("https://labelpilot.de/", "/de"), "https://labelpilot.de/de");
assert.equal(buildAbsoluteUrlFromBase("https://labelpilot.de", "/"), "https://labelpilot.de");

const sitemapPaths = sitemapEntries.map((entry) => entry.path);
assert.equal(new Set(sitemapPaths).size, sitemapPaths.length);

assert.equal(
  hubPagesBySlug.glossar?.secondaryCta?.href,
  "/de/pp-rollenetiketten",
  "Glossary hub hero must keep a direct CTA to the core PP money page.",
);
assert.equal(
  hubPagesBySlug.ratgeber?.secondaryCta?.href,
  "/de/pp-rollenetiketten",
  "Guide hub hero must keep a direct CTA to the core PP money page.",
);

const homepageRendererSource = readFileSync(
  new URL("../components/page-renderers.tsx", import.meta.url),
  "utf8",
);
assert.match(
  homepageRendererSource,
  /<Link href="\/de\/pp-rollenetiketten" className="secondary-link">\s*Alle PP-Rollenetiketten ansehen\s*<\/Link>/,
  "Homepage package section must keep a visible direct link to the PP money-page overview.",
);

const duplicateIntentRouteGroups = [
  [
    {
      path: "/de/druckdaten",
      title: publicPagesBySlug.druckdaten?.title,
      metadataTitle: metadataMap["/de/druckdaten"]?.title,
      requiredMarker: "einreichen",
    },
    {
      path: "/de/ratgeber/druckdaten-vorbereiten",
      title: guidePagesBySlug["druckdaten-vorbereiten"]?.title,
      metadataTitle: metadataMap["/de/ratgeber/druckdaten-vorbereiten"]?.title,
      requiredMarker: "vorbereiten",
    },
    {
      path: "/de/glossar/druckdaten",
      title: glossaryPagesBySlug.druckdaten?.title,
      metadataTitle: metadataMap["/de/glossar/druckdaten"]?.title,
      requiredMarker: "Was sind",
    },
  ],
  [
    {
      path: "/de/nachbestellen",
      title: publicPagesBySlug.nachbestellen?.title,
      metadataTitle: metadataMap["/de/nachbestellen"]?.title,
      requiredMarker: "nachbestellen",
    },
    {
      path: "/de/glossar/nachbestellung",
      title: glossaryPagesBySlug.nachbestellung?.title,
      metadataTitle: metadataMap["/de/glossar/nachbestellung"]?.title,
      requiredMarker: "Was bedeutet",
    },
  ],
  [
    {
      path: "/de/pp-rollenetiketten",
      title: publicPagesBySlug["pp-rollenetiketten"]?.title,
      metadataTitle: metadataMap["/de/pp-rollenetiketten"]?.title,
      requiredMarker: "drucken",
    },
    {
      path: "/de/ratgeber/rollenetiketten-vs-bogenetiketten",
      title: guidePagesBySlug["rollenetiketten-vs-bogenetiketten"]?.title,
      metadataTitle: metadataMap["/de/ratgeber/rollenetiketten-vs-bogenetiketten"]?.title,
      requiredMarker: "vs.",
    },
    {
      path: "/de/glossar/rollenetiketten",
      title: glossaryPagesBySlug.rollenetiketten?.title,
      metadataTitle: metadataMap["/de/glossar/rollenetiketten"]?.title,
      requiredMarker: "Was sind",
    },
  ],
  [
    {
      path: "/de/opake-pp-etiketten",
      title: publicPagesBySlug["opake-pp-etiketten"]?.title,
      metadataTitle: metadataMap["/de/opake-pp-etiketten"]?.title,
      requiredMarker: "drucken",
    },
    {
      path: "/de/ratgeber/pp-etiketten-vs-papieretiketten",
      title: guidePagesBySlug["pp-etiketten-vs-papieretiketten"]?.title,
      metadataTitle: metadataMap["/de/ratgeber/pp-etiketten-vs-papieretiketten"]?.title,
      requiredMarker: "vs.",
    },
    {
      path: "/de/glossar/pp-etiketten",
      title: glossaryPagesBySlug["pp-etiketten"]?.title,
      metadataTitle: metadataMap["/de/glossar/pp-etiketten"]?.title,
      requiredMarker: "Was sind",
    },
  ],
];

for (const group of duplicateIntentRouteGroups) {
  const pageTitles = group.map((entry) => entry.title);
  const metadataTitles = group.map((entry) => entry.metadataTitle);

  assert.equal(
    new Set(pageTitles).size,
    pageTitles.length,
    `Duplicate route intent must keep distinct on-page titles: ${group
      .map((entry) => entry.path)
      .join(", ")}`,
  );
  assert.equal(
    new Set(metadataTitles).size,
    metadataTitles.length,
    `Duplicate route intent must keep distinct metadata titles: ${group
      .map((entry) => entry.path)
      .join(", ")}`,
  );

  for (const entry of group) {
    assert.match(
      entry.title ?? "",
      new RegExp(entry.requiredMarker, "i"),
      `Active route title must preserve its intended query role: ${entry.path}`,
    );
    assert.match(
      entry.metadataTitle ?? "",
      new RegExp(entry.requiredMarker, "i"),
      `Metadata title must preserve its intended query role: ${entry.path}`,
    );
  }
}

const activePublicPathList = [
  "/de",
  ...Object.values(publicPagesBySlug).map((page) => page.path),
  ...Object.values(guidePagesBySlug).map((page) => page.path),
  ...Object.values(glossaryPagesBySlug).map((page) => page.path),
  ...Object.values(hubPagesBySlug).map((page) => page.path),
];
const activePublicPaths = new Set(activePublicPathList);

assert.equal(
  activePublicPaths.size,
  activePublicPathList.length,
  "Active /de public route ownership contains a duplicate path.",
);

for (const path of sitemapPaths) {
  assert.equal(
    isSitemapEligiblePath(path),
    true,
    `Sitemap path must remain eligible: ${path}`,
  );
  assert.ok(metadataMap[path], `Metadata entry missing for sitemap path: ${path}`);
}

for (const path of deferredPhase2Routes) {
  assert.equal(
    activePublicPaths.has(path),
    false,
    `Deferred Phase 2 route must not resolve as an active owned /de public path: ${path}`,
  );
  assert.equal(
    sitemapPaths.includes(path),
    false,
    `Deferred Phase 2 route must not leak into sitemap output: ${path}`,
  );
  assert.equal(
    isSitemapEligiblePath(path),
    false,
    `Deferred Phase 2 route must remain ineligible for sitemap ownership until implemented: ${path}`,
  );
  assert.equal(
    Boolean(metadataMap[path]),
    false,
    `Deferred Phase 2 route must not reserve canonical metadata before the runtime page exists: ${path}`,
  );
}

for (const prefix of NON_INDEXABLE_PREFIXES) {
  assert.equal(
    sitemapPaths.some((path) => path === prefix || path.startsWith(`${prefix}/`)),
    false,
    `Forbidden path leaked into sitemap scope: ${prefix}`,
  );
}

assert.equal(
  sitemapPaths.includes("/de/wunschformat"),
  false,
  "Feature-gated Wunschformat must not leak into sitemap while the flag is off.",
);
assert.equal(
  sitemapPaths.some((path) => path === "/lp" || path.startsWith("/lp/")),
  false,
  "Ads landing pages under /lp must never appear in sitemap output.",
);
assert.equal(
  sitemapPaths.some((path) => path === "/teklif" || path.startsWith("/teklif/")),
  false,
  "Ads landing pages under /teklif must never appear in sitemap output.",
);

const nonIndexableCanonicalMetadata = buildCanonicalMetadata("/lp/angebot-a", {
  title: "Landingpage",
  description: "Test",
});
assert.equal(
  nonIndexableCanonicalMetadata.alternates?.canonical,
  undefined,
  "Ads landing pages must not publish a canonical URL.",
);
assert.deepEqual(nonIndexableCanonicalMetadata.robots, {
  index: false,
  follow: false,
});
assert.equal(nonIndexableCanonicalMetadata.openGraph?.url, undefined);

const teklifCanonicalMetadata = buildCanonicalMetadata("/teklif/pp-rollenetiketten", {
  title: "Landingpage",
  description: "Test",
});
assert.equal(
  teklifCanonicalMetadata.alternates?.canonical,
  undefined,
  "Equivalent ads landing pages under /teklif must not publish a canonical URL.",
);
assert.deepEqual(teklifCanonicalMetadata.robots, {
  index: false,
  follow: false,
});
assert.equal(teklifCanonicalMetadata.openGraph?.url, undefined);

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
