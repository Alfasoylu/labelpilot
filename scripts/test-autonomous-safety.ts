import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { buildCanonicalMetadata, buildPageSchema } from "../lib/seo.ts";
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
  "/konto/",
  "/mein-konto/",
  "/de/auftrag/",
  "/de/checkout",
  "/de/gespeicherte-druckdaten",
  "/lp/",
  "/teklif/",
]);

assert.equal(isNonIndexablePath("/admin"), true);
assert.equal(isNonIndexablePath("/admin/orders"), true);
assert.equal(isNonIndexablePath("/checkout/cancel"), true);
assert.equal(isNonIndexablePath("/konto"), true);
assert.equal(isNonIndexablePath("/konto/bestellungen"), true);
assert.equal(isNonIndexablePath("/mein-konto"), true);
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
assert.ok(
  (publicPagesBySlug["etiketten-100x200"]?.faqs?.length ?? 0) >= 3,
  "The indexed 100×200 format page must keep a real FAQ block instead of collapsing into a thin commercial bridge page.",
);
assert.match(
  publicPagesBySlug["etiketten-100x200"]?.faqs?.[0]?.question ?? "",
  /100×200 mm|Sonderformat|Mengen/i,
  "The 100×200 format-page FAQ block must stay format-specific rather than duplicating generic product FAQ intent.",
);

const homepageRendererSource = readFileSync(
  new URL("../components/page-renderers.tsx", import.meta.url),
  "utf8",
);
const siteContentSource = readFileSync(
  new URL("../lib/site-content.ts", import.meta.url),
  "utf8",
);
const brandHeroSource = readFileSync(
  new URL("../components/sections/BrandHero.tsx", import.meta.url),
  "utf8",
);
const pricingCardSource = readFileSync(
  new URL("../components/cards/PricingCard.tsx", import.meta.url),
  "utf8",
);
const customSizeFormSource = readFileSync(
  new URL("../components/custom-size-price-form.tsx", import.meta.url),
  "utf8",
);
const checkoutIntakeFormSource = readFileSync(
  new URL("../components/checkout/CheckoutIntakeForm.tsx", import.meta.url),
  "utf8",
);
const checkoutSuccessPageSource = readFileSync(
  new URL("../app/(public)/checkout/success/page.tsx", import.meta.url),
  "utf8",
);
const proofApprovalPanelSource = readFileSync(
  new URL("../components/orders/ProofApprovalPanel.tsx", import.meta.url),
  "utf8",
);
assert.match(
  homepageRendererSource,
  /<Link href="\/de\/pp-rollenetiketten" className="secondary-link">\s*Alle PP-Rollenetiketten ansehen\s*<\/Link>/,
  "Homepage package section must keep a visible direct link to the PP money-page overview.",
);
assert.match(
  homepageRendererSource,
  /tier: opaquePackages\[1\][\s\S]*quantity: 2000/,
  "Homepage package ladder must keep the canonical 2.000 tier visible instead of skipping from 1.000 to 5.000.",
);
assert.match(
  homepageRendererSource,
  /1\.000 Stück ist der bezahlte Einstieg\.\s*5\.000 Stück ist das empfohlene B2B-Standardpaket/,
  "Homepage package note must keep the commercial role split between the paid 1.000 trial tier and the recommended 5.000 B2B tier.",
);
assert.match(
  brandHeroSource,
  /<Link href="\/de\/angebot-anfordern" className="cta-link">\s*Angebot anfordern\s*<\/Link>/,
  "Homepage hero must keep a direct quote CTA for higher-complexity B2B requests.",
);
assert.match(
  brandHeroSource,
  /<Link href="\/de\/musterbox" className="cta-link">\s*Musterbox anfordern\s*<\/Link>/,
  "Homepage hero must keep a direct sample-box CTA for material clarification.",
);
assert.match(
  brandHeroSource,
  /<Link href="\/de\/nachbestellen">Nachbestellen:<\/Link>/,
  "Homepage hero must explain the direct reorder path when artwork and specification are already approved.",
);
assert.match(
  pricingCardSource,
  /Bruttopreis inkl\. 19% MwSt\.: \{tier\.grossLabel\}/,
  "Fixed-price cards must show the gross customer price as a separate labeled line.",
);
assert.match(
  pricingCardSource,
  /Nettopreis pro Stück: \{tier\.perPieceLabel\}/,
  "Fixed-price cards must keep the per-piece net figure as a separately labeled commercial line.",
);
assert.match(
  pricingCardSource,
  /Empfohlenes B2B-Paket für wiederkehrende Bestellungen\./,
  "Fixed-price cards must visibly mark the 5.000 tier as the recommended B2B package when the tier is popular.",
);
assert.match(
  siteContentSource,
  /badge: "Empfohlenes B2B-Paket"[\s\S]*popular: true/,
  "The 5.000 package tier must stay marked as the recommended B2B package in the product content source.",
);
assert.doesNotMatch(
  siteContentSource,
  /Reorder-Ready|Cross-Sell/,
  "Public product-card package copy must stay German-only and must not leak English commercial labels.",
);

assert.match(
  customSizeFormSource,
  /Wunschformat ist bewusst ein kontrollierter Zusatzpfad mit klarem Angebots-Fallback\./,
  "Custom-size page must keep the quote fallback explicit instead of presenting the path as a normal fixed-price checkout route.",
);
assert.match(
  customSizeFormSource,
  /Direkt berechenbar sind\s*nur Wunschformate innerhalb der freigegebenen Preislogik\./,
  "Custom-size idle state must explain that only approved request shapes are publicly priceable.",
);
assert.match(
  customSizeFormSource,
  /Er gilt nur für direkt kalkulierbare\s*Wunschformate ohne zusätzliche Sonderanforderungen\./,
  "Custom-size result state must narrow the displayed Richtpreis to directly calculable request shapes.",
);
assert.match(
  customSizeFormSource,
  /Sobald Weißunterdruck, Konturschnitt, Sonderklebstoff, Veredelung,\s*variable Daten, Multi-SKU oder Mengen ab 20\.000 Stück ins Spiel\s*kommen, bleibt der Angebotsweg verbindlich\./,
  "Custom-size direct-price state must keep the quote-only exceptions clearly separated from the public Richtpreis.",
);
assert.match(
  homepageRendererSource,
  /Checkout, Zahlungsbestätigung, Auftragsbestätigung und Proof-Freigabe bleiben im sichtbaren B2B-Prozess sauber nachvollziehbar\./,
  "Product trust block must describe the visible B2B process concretely instead of relying on vague trust wording.",
);
assert.match(
  proofApprovalPanelSource,
  /So bleibt die Freigabe für B2B-Aufträge klar/,
  "Proof panel must explain the approval process as a visible B2B trust step.",
);
assert.match(
  proofApprovalPanelSource,
  /Ein digitaler Proof gehört zum Standardprozess vor der Produktion\./,
  "Proof panel must keep the included digital proof step explicit.",
);
assert.match(
  proofApprovalPanelSource,
  /Änderungswünsche gehen kontrolliert in den nächsten Proof statt direkt in den Druck\./,
  "Proof panel must explain that change requests return to the next proof instead of silently entering production.",
);
assert.match(
  proofApprovalPanelSource,
  /Produziert wird erst nach Ihrer ausdrücklichen Freigabe; die freigegebene Version bleibt die Basis für spätere Nachbestellungen\./,
  "Proof panel must connect proof approval to production safety and later reorders.",
);

const rootPageSource = readFileSync(
  new URL("../app/page.tsx", import.meta.url),
  "utf8",
);
assert.doesNotMatch(
  checkoutIntakeFormSource,
  /Designservice oder Datenklärung im Auftrag enthalten/,
  "Checkout intake summary must not imply that design service is always included when the customer has not selected it.",
);
assert.match(
  checkoutIntakeFormSource,
  /Designservice nur bei Auswahl oder wenn die Freiregel greift/,
  "Checkout intake summary must keep the design-service eligibility rule explicit instead of treating it as a default inclusion.",
);
assert.match(
  checkoutIntakeFormSource,
  /Keine kostenpflichtigen Zusatzleistungen ausgewählt\./,
  "Checkout intake summary must explicitly show when no paid add-ons were selected.",
);
assert.match(
  checkoutSuccessPageSource,
  /const pageHeading = hasResolvedCheckoutState[\s\S]*: "Ihr Checkout wird geprüft\.";/,
  "Checkout success page must use a softer unresolved heading instead of claiming the order is already confirmed.",
);
assert.match(
  checkoutSuccessPageSource,
  /hasResolvedCheckoutState \? "Zahlung bestätigt" : "Checkout wird bestätigt"/,
  "Checkout success page must distinguish resolved payment confirmation from an unresolved checkout review state.",
);
assert.match(
  checkoutSuccessPageSource,
  /ca\. 10–14 Werktagen nach Ihrer Freigabe/,
  "Checkout success page must keep the canonical honest delivery range after proof approval.",
);
assert.match(
  rootPageSource,
  /permanentRedirect\("\/de"\)/,
  "Root homepage entry must permanently redirect to the canonical German homepage /de.",
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

const opaqueProductSchema = buildPageSchema(
  publicPagesBySlug["opake-pp-etiketten"],
  "/de/opake-pp-etiketten",
) as Record<string, unknown>;
assert.equal(opaqueProductSchema["@type"], "Product");
assert.equal(opaqueProductSchema.category, "PP-Rollenetiketten");
assert.equal(opaqueProductSchema.material, "Opakes PP");
assert.equal(opaqueProductSchema.sku, "pp-opaque-100x200");
assert.ok(Array.isArray(opaqueProductSchema.offers), "Visible fixed-price tiers must be reflected in product JSON-LD offers.");
assert.equal((opaqueProductSchema.offers as Array<unknown>).length, 4);
assert.deepEqual(
  (opaqueProductSchema.offers as Array<Record<string, unknown>>).map((offer) => offer.price),
  [179, 279, 479, 799],
  "Product JSON-LD must use the same visible fixed package prices as the customer page.",
);

const transparentProductSchema = buildPageSchema(
  publicPagesBySlug["transparente-pp-etiketten"],
  "/de/transparente-pp-etiketten",
) as Record<string, unknown>;
assert.equal(transparentProductSchema.material, "Transparentes PP");
assert.deepEqual(
  (transparentProductSchema.offers as Array<Record<string, unknown>>).map((offer) => offer.price),
  [199, 309, 519, 849],
  "Transparent product JSON-LD must use the same visible fixed package prices as the customer page.",
);

const ppConfiguratorSchema = buildPageSchema(
  publicPagesBySlug["pp-rollenetiketten"],
  "/de/pp-rollenetiketten",
) as Record<string, unknown>;
assert.equal(
  publicPagesBySlug["pp-rollenetiketten"]?.kind,
  "product",
  "The canonical /de/pp-rollenetiketten page must be treated as the product/configurator page rather than a passive collection hub.",
);
assert.equal(
  ppConfiguratorSchema["@type"],
  "Product",
  "The canonical /de/pp-rollenetiketten page must emit product-level schema once it becomes the unified configurator page.",
);
assert.equal(
  publicPagesBySlug["opake-pp-etiketten"]?.primaryCta?.href,
  "/de/pp-rollenetiketten?material=opaque&size=standard&quantity=5000",
  "Opaque landing page must deep-link into the canonical configurator with the opak preset.",
);
assert.equal(
  publicPagesBySlug["transparente-pp-etiketten"]?.primaryCta?.href,
  "/de/pp-rollenetiketten?material=transparent&size=standard&quantity=5000",
  "Transparent landing page must deep-link into the canonical configurator with the transparent preset.",
);
assert.equal(
  publicPagesBySlug["etiketten-100x200"]?.primaryCta?.href,
  "/de/pp-rollenetiketten?material=opaque&size=standard&quantity=5000",
  "The 100×200 format landing page must feed the canonical configurator instead of behaving like a separate product destination.",
);
assert.match(
  homepageRendererSource,
  /selectedMaterialLabel[\s\S]*selectedSizeLabel/,
  "The product renderer must expose a unified material-and-size configurator state for the canonical PP page.",
);
assert.match(
  homepageRendererSource,
  /label: "Im Konfigurator öffnen"[\s\S]*href: buildConfiguratorHref\(/,
  "SEO landing package cards must route buyers into the shared configurator instead of keeping separate product-specific checkout entry points.",
);
assert.match(
  homepageRendererSource,
  /\[1000, 2000, 5000, 10000\]\.map\(\(quantity\)[\s\S]*quantity === 5000 \? " · empfohlen" : ""/,
  "The canonical configurator must expose only canonical fixed quantities and visibly recommend 5.000.",
);
assert.match(
  homepageRendererSource,
  /customSizeFeatureEnabled[\s\S]*size: "custom"[\s\S]*buildOtherQuantityQuoteHref/,
  "The non-standard quantity path must go to Wunschformat when enabled or otherwise to the quote fallback.",
);
assert.match(
  homepageRendererSource,
  /<h2>Andere Menge\?<\/h2>[\s\S]*3\.000, 7\.500, weniger als 1\.000[\s\S]*Andere Menge anfragen/,
  "The pricing section must keep an honest non-standard quantity path instead of faking intermediate live prices.",
);

const prismaSchemaSource = readFileSync(
  new URL("../prisma/schema.prisma", import.meta.url),
  "utf8",
);
const accountPageSource = readFileSync(
  new URL("../app/(account)/konto/KontoClient.tsx", import.meta.url),
  "utf8",
);
const accountDashboardApiSource = readFileSync(
  new URL("../app/api/account/dashboard/route.ts", import.meta.url),
  "utf8",
);
const reorderApiSource = readFileSync(
  new URL("../app/api/reorders/route.ts", import.meta.url),
  "utf8",
);
assert.match(
  prismaSchemaSource,
  /model Customer[\s\S]*authUserId\s+String\?\s+@unique[\s\S]*orders\s+Order\[\][\s\S]*storedDesigns\s+StoredDesign\[\]/,
  "Track S3 requires a Customer model linked to Supabase auth, order history, and saved designs.",
);
assert.match(
  prismaSchemaSource,
  /customer\s+Customer\?\s+@relation\(fields: \[customerId\], references: \[id\], onDelete: SetNull/,
  "Order and StoredDesign customer ownership must be represented as nullable, non-destructive relations.",
);
assert.match(
  accountDashboardApiSource,
  /getSupabaseUserFromRequest\(request\)[\s\S]*ensureCustomerForSupabaseUser/,
  "Customer account dashboard must verify Supabase auth server-side before linking account data.",
);
assert.match(
  accountDashboardApiSource,
  /prisma\.order\.findMany\(\{[\s\S]*where: \{ customerId: customer\.id \}/,
  "Customer account order history must be scoped by verified customerId.",
);
assert.match(
  accountDashboardApiSource,
  /prisma\.storedDesign\.findMany\(\{[\s\S]*customerId: customer\.id/,
  "Customer account saved designs must be scoped by verified customerId.",
);
assert.match(
  accountPageSource,
  /Meine Bestellungen und gespeicherten Druckdaten/,
  "The customer account page must expose a German order-history and saved-design dashboard.",
);
assert.match(
  accountPageSource,
  /<ReorderStartForm[\s\S]*accessToken=\{accessToken\}/,
  "The customer account page must expose authenticated one-click reorder from saved designs.",
);
assert.match(
  reorderApiSource,
  /authHeader\.startsWith\("Bearer "\)[\s\S]*getCustomerAccountAccessContext/,
  "The reorder API must accept verified customer-account ownership in addition to the existing token fallback.",
);

const thermalProductSchema = buildPageSchema(
  publicPagesBySlug["thermo-versandetiketten"],
  "/de/thermo-versandetiketten",
) as Record<string, unknown>;
assert.equal(
  thermalProductSchema.offers,
  undefined,
  "Quote-led thermo product pages must not emit fixed-price JSON-LD offers when no visible price exists.",
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
