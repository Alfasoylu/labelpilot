import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { buildCanonicalMetadata, buildPageSchema } from "../lib/seo.ts";
import { checkoutAddonSchema } from "../lib/checkout/intake.ts";
import { normalizeCheckoutAddons } from "../lib/pricing/checkout-addons.ts";
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

// ── Stripe Webhook regression guards ─────────────────────────────────────────
// These assertions read the source file to ensure the structural fixes for
// SW-001, SW-002, and SW-003 are not accidentally reverted.

const webhookSource = readFileSync(
  new URL("../app/api/stripe/webhook/route.ts", import.meta.url),
  "utf8",
);

// SW-001: Atomic upsert must replace the old findUnique + conditional create.
assert.doesNotMatch(
  webhookSource,
  /prisma\.stripeEvent\.findUnique/,
  "SW-001: Webhook must not use findUnique for idempotency – use upsert to avoid TOCTOU race condition.",
);
assert.match(
  webhookSource,
  /prisma\.stripeEvent\.upsert/,
  "SW-001: Webhook must use prisma.stripeEvent.upsert for atomic idempotency guard.",
);

// SW-002: sendEmail return value must be captured and checked.
assert.doesNotMatch(
  webhookSource,
  /await sendEmail\(\{[^}]*\}\s*\);/,
  "SW-002: sendEmail result must be captured – bare `await sendEmail(...)` discards the ok flag.",
);
assert.match(
  webhookSource,
  /const emailResult = await sendEmail\(/,
  "SW-002: sendEmail result must be stored in emailResult so failures are logged and the email reservation can be rolled back.",
);
assert.match(
  webhookSource,
  /if \(!emailResult\.ok\)/,
  "SW-002: Webhook must check emailResult.ok and handle email send failures explicitly.",
);

// SW-003: ERROR events must be skipped with a warning (not re-processed on Stripe retry).
assert.match(
  webhookSource,
  /stripeEventRecord\.status === "ERROR"/,
  "SW-003: Webhook must guard against reprocessing events already marked ERROR to prevent double-execution on Stripe retries.",
);

// ── Email Integration regression guards ──────────────────────────────────────

const proofsRouteSource = readFileSync(
  new URL("../app/api/admin/orders/[orderId]/proofs/route.ts", import.meta.url),
  "utf8",
);

// EMAIL-002: proofReady sendEmail must be wrapped in try/catch so proof upload succeeds
// even when the Resend API throws.
assert.match(
  proofsRouteSource,
  /try \{[\s\S]*?await sendEmail\([\s\S]*?\}[\s\S]*?catch \(error\)/,
  "EMAIL-002: sendEmail in proofs route must be wrapped in try/catch to prevent email errors from failing the proof upload.",
);

const artworkReviewRouteSource = readFileSync(
  new URL("../app/api/admin/orders/[orderId]/artwork/review/route.ts", import.meta.url),
  "utf8",
);

// EMAIL-003: correctionRequested sendEmail must be wrapped in try/catch (consistent with artworkApproved).
// Verify that the request_correction branch contains a try/catch around sendEmail.
assert.match(
  artworkReviewRouteSource,
  /request_correction[\s\S]*?try \{[\s\S]*?await sendEmail\([\s\S]*?catch \(error\)/,
  "EMAIL-003: correctionRequested sendEmail must be wrapped in try/catch to prevent email errors from failing the admin action.",
);

// EMAIL-004: same-artwork reorder webhook must send artworkApproved email when isSameArtworkReorder is true.
assert.match(
  webhookSource,
  /isSameArtworkReorder[\s\S]*?artworkApproved\(/,
  "EMAIL-004: Webhook must send artworkApproved email for same-artwork reorders so customers are notified that production has started.",
);
assert.match(
  webhookSource,
  /artworkApproved[\s\S]*?try \{[\s\S]*?await sendEmail/,
  "EMAIL-004: artworkApproved send in webhook must be wrapped in try/catch.",
);

const sampleBoxSource = readFileSync(
  new URL("../lib/actions/sample-box-request.ts", import.meta.url),
  "utf8",
);

// EMAIL-005: ops notification must use ADMIN_NOTIFY_EMAIL as primary, not fall back to customer email.
assert.match(
  sampleBoxSource,
  /ADMIN_NOTIFY_EMAIL.*\|\|.*EMAIL_REPLY_TO/,
  "EMAIL-005: Sample-box ops notification must use ADMIN_NOTIFY_EMAIL as primary recipient with EMAIL_REPLY_TO as fallback.",
);
assert.doesNotMatch(
  sampleBoxSource,
  /adminInbox \|\| values\.email/,
  "EMAIL-005: Ops notification must never fall back to the customer email address when no admin inbox is configured.",
);

const resendSource = readFileSync(
  new URL("../lib/email/resend.ts", import.meta.url),
  "utf8",
);

// EMAIL-006: sendTransactionalEmail must wrap client.emails.send() in try/catch.
assert.match(
  resendSource,
  /try \{[\s\S]*?client\.emails\.send\(/,
  "EMAIL-006: sendTransactionalEmail must wrap client.emails.send() in try/catch to handle Resend SDK network errors gracefully.",
);

// EMAIL-007: send.ts must import getResendClient from resend.ts (consolidated singleton), not client.ts.
const sendSource = readFileSync(
  new URL("../lib/email/send.ts", import.meta.url),
  "utf8",
);
assert.match(
  sendSource,
  /from.*email\/resend/,
  "EMAIL-007: send.ts must import getResendClient from lib/email/resend (singleton) not the removed lib/email/client.",
);
assert.doesNotMatch(
  sendSource,
  /from.*email\/client/,
  "EMAIL-007: send.ts must not import from the removed lib/email/client module.",
);

// ── Pricing Engine regression guards ─────────────────────────────────────────

// PE-001: extraDesignCount must be capped at 4 by the schema validator.
assert.ok(
  checkoutAddonSchema.safeParse({ extraDesignCount: 4 }).success,
  "PE-001: extraDesignCount=4 must be accepted by checkoutAddonSchema.",
);
assert.equal(
  checkoutAddonSchema.safeParse({ extraDesignCount: 5 }).success,
  false,
  "PE-001: extraDesignCount=5 must be rejected by checkoutAddonSchema (max is 4).",
);
assert.equal(
  checkoutAddonSchema.safeParse({ extraDesignCount: 999 }).success,
  false,
  "PE-001: extraDesignCount=999 must be rejected by checkoutAddonSchema to prevent absurd charges.",
);

// PE-001: normalizeCheckoutAddons must also enforce the ceiling of 4 as a safety net.
assert.equal(
  normalizeCheckoutAddons({ extraDesignCount: 999 }).extraDesignCount,
  4,
  "PE-001: normalizeCheckoutAddons must cap extraDesignCount at 4 regardless of raw input.",
);
assert.equal(
  normalizeCheckoutAddons({ extraDesignCount: 4 }).extraDesignCount,
  4,
  "PE-001: normalizeCheckoutAddons must pass through extraDesignCount=4 unchanged.",
);
assert.equal(
  normalizeCheckoutAddons({ extraDesignCount: 0 }).extraDesignCount,
  0,
  "PE-001: normalizeCheckoutAddons must keep extraDesignCount=0 as zero.",
);

// PE-002: oval surcharge ordering — verify that the route source computes ovalSurchargeNet
// after the quoteRequired guard, not before.
const createCustomSessionSource = readFileSync(
  new URL("../app/api/checkout/create-custom-session/route.ts", import.meta.url),
  "utf8",
);
const quoteRequiredGuardPos = createCustomSessionSource.indexOf("quoteRequired");
const ovalSurchargePos = createCustomSessionSource.indexOf("ovalSurchargeNet");
assert.ok(
  ovalSurchargePos > quoteRequiredGuardPos,
  "PE-002: ovalSurchargeNet must be computed after the quoteRequired guard to prevent uncapped surcharge on rejected requests.",
);

// ── Checkout Flow regression guards ──────────────────────────────────────────

const createSessionRouteSource = readFileSync(
  new URL("../app/api/checkout/create-session/route.ts", import.meta.url),
  "utf8",
);
const checkoutSuccessPageSourceForChk = readFileSync(
  new URL("../app/(public)/checkout/success/page.tsx", import.meta.url),
  "utf8",
);
const ordersLibSource = readFileSync(
  new URL("../lib/commerce/orders.ts", import.meta.url),
  "utf8",
);
const checkoutIntakeFormSourceForChk = readFileSync(
  new URL("../components/checkout/CheckoutIntakeForm.tsx", import.meta.url),
  "utf8",
);
const customSizeCheckoutFormSource = readFileSync(
  new URL("../components/kalkulator/CustomSizeCheckoutForm.tsx", import.meta.url),
  "utf8",
);
const webhookSourceForChk = readFileSync(
  new URL("../app/api/stripe/webhook/route.ts", import.meta.url),
  "utf8",
);
const intakeSource = readFileSync(
  new URL("../lib/checkout/intake.ts", import.meta.url),
  "utf8",
);

// CHK-001: Success page must verify payment_status === 'paid' before showing success UI.
assert.match(
  checkoutSuccessPageSourceForChk,
  /payment_status !== ["']paid["']/,
  "CHK-001: Success page must guard against unpaid sessions by checking payment_status !== 'paid'.",
);
assert.match(
  checkoutSuccessPageSourceForChk,
  /order\.status !== ["']PAID["']/,
  "CHK-001: Success page must also verify the DB order has status PAID (or APPROVED_FOR_PRODUCTION) before rendering success UI.",
);

// CHK-002: Stripe session must be created BEFORE the DB order to prevent orphaned orders.
const stripeSessionCreatePos = createSessionRouteSource.indexOf("stripe.checkout.sessions.create");
const prismaOrderCreatePos = createSessionRouteSource.indexOf("prisma.order.create");
assert.ok(
  stripeSessionCreatePos > 0 && prismaOrderCreatePos > 0,
  "CHK-002: create-session route must contain both stripe.checkout.sessions.create and prisma.order.create.",
);
assert.ok(
  stripeSessionCreatePos < prismaOrderCreatePos,
  "CHK-002: Stripe session must be created BEFORE the DB order to avoid orphaned PENDING_PAYMENT orders when Stripe fails.",
);

// CHK-003: Order number must use 8 hex chars (higher entropy) and have P2002 retry logic.
assert.match(
  ordersLibSource,
  /slice\(0,\s*8\)/,
  "CHK-003: createOrderNumber must use 8 hex characters for higher entropy (not 6).",
);
assert.match(
  createSessionRouteSource,
  /P2002/,
  "CHK-003: create-session route must handle Prisma P2002 (unique constraint) for orderNumber collision with a retry loop.",
);

// CHK-004: Double-submit guard must exist in both checkout forms.
assert.match(
  checkoutIntakeFormSourceForChk,
  /submittedRef\.current/,
  "CHK-004: CheckoutIntakeForm must use a submittedRef guard to prevent double-submit.",
);
assert.match(
  customSizeCheckoutFormSource,
  /submittedRef\.current/,
  "CHK-004: CustomSizeCheckoutForm must use a submittedRef guard to prevent double-submit.",
);

// CHK-005: Email reservation (confirmationEmailSentAt) must be inside the prisma.$transaction.
const txStart = webhookSourceForChk.indexOf("prisma.$transaction");
const txEnd = webhookSourceForChk.indexOf("];", txStart);
const emailReservationInTx = webhookSourceForChk.indexOf("confirmationEmailSentAt", txStart);
assert.ok(
  emailReservationInTx > txStart && emailReservationInTx < txEnd,
  "CHK-005: confirmationEmailSentAt reservation must be inside prisma.$transaction to prevent double-email on webhook retry.",
);

// CHK-006: postalCode must be validated with a 5-digit regex.
assert.match(
  intakeSource,
  /postalCode[\s\S]*?regex\([\s\S]*?\\d\{5\}/,
  "CHK-006: checkoutIntakeSchema must validate postalCode with a \\d{5} regex.",
);
assert.match(
  intakeSource,
  /phone[\s\S]*?min\(7\)/,
  "CHK-006: phone field must enforce min(7) to reject implausibly short values.",
);

// ── Order Creation regression guards ─────────────────────────────────────────

const reorderRouteSource = readFileSync(
  new URL("../app/api/reorders/route.ts", import.meta.url),
  "utf8",
);
const createCustomSessionRouteSource = readFileSync(
  new URL("../app/api/checkout/create-custom-session/route.ts", import.meta.url),
  "utf8",
);
const leadConvertRouteSource = readFileSync(
  new URL("../app/api/admin/leads/[leadId]/convert/route.ts", import.meta.url),
  "utf8",
);

// BUG-002: create-session — payment.create must precede the Stripe metadata update so
// that a Stripe API failure after payment row creation is handled by the outer catch.
const paymentCreatePos = createSessionRouteSource.indexOf("prisma.payment.create");
const stripeMetaUpdatePos = createSessionRouteSource.indexOf("stripe.checkout.sessions.update");
assert.ok(
  paymentCreatePos > 0 && stripeMetaUpdatePos > 0,
  "BUG-002: create-session route must contain both prisma.payment.create and stripe.checkout.sessions.update.",
);
assert.ok(
  paymentCreatePos < stripeMetaUpdatePos,
  "BUG-002: create-session must write the Payment row before the non-critical Stripe metadata update so that payment row creation is covered by the error handler.",
);

// BUG-003: create-custom-session — post-Stripe DB writes must be in a prisma.$transaction.
// Extract the $transaction block and verify both order.update and payment.create are inside it.
const customSessionTxStart = createCustomSessionRouteSource.indexOf("prisma.$transaction");
assert.ok(
  customSessionTxStart > 0,
  "BUG-003: create-custom-session must wrap the post-Stripe order.update and payment.create in a prisma.$transaction.",
);
const customSessionTxEnd = createCustomSessionRouteSource.indexOf("]);", customSessionTxStart);
const customSessionTxBlock = createCustomSessionRouteSource.slice(customSessionTxStart, customSessionTxEnd);
assert.ok(
  customSessionTxBlock.includes("prisma.order.update"),
  "BUG-003: order.update must be inside the prisma.$transaction block in create-custom-session.",
);
assert.ok(
  customSessionTxBlock.includes("prisma.payment.create"),
  "BUG-003: payment.create must be inside the prisma.$transaction block in create-custom-session.",
);

// BUG-004: Both standard and custom checkout routes must read the Authorization header
// and call ensureCustomerForSupabaseUser to link authenticated users to their orders.
assert.match(
  createSessionRouteSource,
  /ensureCustomerForSupabaseUser/,
  "BUG-004: create-session must call ensureCustomerForSupabaseUser to set customerId for authenticated users.",
);
assert.match(
  createCustomSessionRouteSource,
  /ensureCustomerForSupabaseUser/,
  "BUG-004: create-custom-session must call ensureCustomerForSupabaseUser to set customerId for authenticated users.",
);
assert.match(
  createSessionRouteSource,
  /headers\.get\("authorization"\)/,
  "BUG-004: create-session must read the authorization header to detect authenticated checkout requests.",
);
assert.match(
  createCustomSessionRouteSource,
  /headers\.get\("authorization"\)/,
  "BUG-004: create-custom-session must read the authorization header to detect authenticated checkout requests.",
);

// BUG-005: ovalSurchargeCents must use * 119 (one multiplication) not * 1.19 * 100
// (two multiplications that can introduce a 1-cent floating-point discrepancy).
assert.match(
  createCustomSessionRouteSource,
  /ovalSurchargeCents\s*=\s*Math\.round\(\s*ovalSurchargeNet\s*\*\s*119\s*\)/,
  "BUG-005: ovalSurchargeCents must use Math.round(ovalSurchargeNet * 119) to avoid floating-point rounding errors.",
);
assert.doesNotMatch(
  createCustomSessionRouteSource,
  /ovalSurchargeNet\s*\*\s*1\.19\s*\*\s*100/,
  "BUG-005: ovalSurchargeCents must not chain * 1.19 * 100 (two fp multiplications that can differ by 1 cent from the Stripe total).",
);

// BUG-006: Lead convert route must create a Payment row when skipPayment=yes.
assert.match(
  leadConvertRouteSource,
  /prisma\.payment\.create/,
  "BUG-006: Lead convert route must create a Payment row when skipPayment=yes for audit-trail parity.",
);
assert.match(
  leadConvertRouteSource,
  /provider.*manual|manual.*provider/,
  "BUG-006: Manual payment rows created by lead convert must set provider='manual' to distinguish them from Stripe payments.",
);

// BUG-007: Reorder route must guard against session.url being null.
assert.match(
  reorderRouteSource,
  /if \(!session\.url\)/,
  "BUG-007: Reorder route must check session.url and return a 503 / mark PAYMENT_FAILED when Stripe returns no redirect URL.",
);
assert.match(
  reorderRouteSource,
  /PAYMENT_FAILED/,
  "BUG-007: Reorder route must mark the order PAYMENT_FAILED when session.url is null so the order does not remain stuck at PENDING_PAYMENT.",
);

// ── Artwork Upload Flow regression guards ─────────────────────────────────────

import {
  sanitizeFileName,
  validateArtworkFile,
} from "../lib/file-validation/artwork.ts";

// ART-002: MIME type bypass — empty/missing type must be rejected.
const missingMimeResult = validateArtworkFile(
  new File([new Uint8Array(10)], "test.pdf", { type: "" }),
);
assert.equal(
  missingMimeResult.ok,
  false,
  "ART-002: validateArtworkFile must reject a file with an empty MIME type (bypass attempt).",
);

const wrongMimeResult = validateArtworkFile(
  new File([new Uint8Array(10)], "test.pdf", { type: "application/octet-stream" }),
);
assert.equal(
  wrongMimeResult.ok,
  false,
  "ART-002: validateArtworkFile must reject a PDF filename with application/octet-stream MIME type.",
);

const validPdfResult = validateArtworkFile(
  new File([new Uint8Array(10)], "artwork.pdf", { type: "application/pdf" }),
);
assert.equal(
  validPdfResult.ok,
  true,
  "ART-002: validateArtworkFile must accept a valid PDF file with the correct MIME type.",
);

// ART-005: TIFF files must be accepted.
const validTiffResult = validateArtworkFile(
  new File([new Uint8Array(10)], "artwork.tiff", { type: "image/tiff" }),
);
assert.equal(
  validTiffResult.ok,
  true,
  "ART-005: validateArtworkFile must accept TIFF files (.tiff) with image/tiff MIME type.",
);

const validTifResult = validateArtworkFile(
  new File([new Uint8Array(10)], "artwork.tif", { type: "image/tiff" }),
);
assert.equal(
  validTifResult.ok,
  true,
  "ART-005: validateArtworkFile must accept TIFF files (.tif) with image/tiff MIME type.",
);

// ART-006: sanitizeFileName must strip leading dots.
assert.equal(
  sanitizeFileName(".hidden"),
  "hidden",
  "ART-006: sanitizeFileName must strip leading dots to prevent hidden-file paths.",
);
assert.equal(
  sanitizeFileName("...multiple-dots"),
  "multiple-dots",
  "ART-006: sanitizeFileName must strip multiple leading dots.",
);
assert.equal(
  sanitizeFileName("normal-file.pdf"),
  "normal-file.pdf",
  "ART-006: sanitizeFileName must leave regular file names unchanged.",
);

// ART-001: Prisma schema must include the uploadTokenExpiresAt column.
const prismaSchemaForArtwork = readFileSync(
  new URL("../prisma/schema.prisma", import.meta.url),
  "utf8",
);
assert.match(
  prismaSchemaForArtwork,
  /uploadTokenExpiresAt\s+DateTime\?/,
  "ART-001: Order model must have an uploadTokenExpiresAt column so upload tokens can expire.",
);

// ART-003: Upload route must export a config that disables the default body parser.
const artworkUploadRouteSource = readFileSync(
  new URL("../app/api/orders/[orderId]/artwork/route.ts", import.meta.url),
  "utf8",
);
assert.match(
  artworkUploadRouteSource,
  /export const config[\s\S]*bodyParser: false/,
  "ART-003: Artwork upload route must export config with bodyParser: false to allow streaming size checks.",
);
assert.match(
  artworkUploadRouteSource,
  /content-length[\s\S]*MAX_UPLOAD_BYTES|MAX_UPLOAD_BYTES[\s\S]*content-length/i,
  "ART-003: Artwork upload route must perform an early Content-Length check against MAX_UPLOAD_BYTES.",
);

// ART-007: Customer artwork download route must set Cache-Control: no-store on the redirect.
const artworkDownloadRouteSource = readFileSync(
  new URL("../app/api/orders/[orderId]/artwork/[fileId]/route.ts", import.meta.url),
  "utf8",
);
assert.match(
  artworkDownloadRouteSource,
  /Cache-Control.*no-store/,
  "ART-007: Artwork download redirect must set Cache-Control: no-store to prevent caching of signed URLs.",
);

console.log("Autonomous safety regression tests passed.");
