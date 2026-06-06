import type { Metadata } from "next";
import Link from "next/link";

import { CheckoutIntakeForm } from "@/components/checkout/CheckoutIntakeForm";
import { getDefaultPricingSettings, mapPricingSettingsRecord } from "@/lib/admin/pricing";
import { findPackageByConfig } from "@/lib/commerce/packages";
import { getPrismaClient } from "@/lib/db/prisma";
import {
  parseCheckoutSearchParams,
  type CheckoutAddonInput,
} from "@/lib/checkout/intake";
import { isAddonsEnabled } from "@/lib/pricing/addons-feature";
import { buildCheckoutAddons } from "@/lib/pricing/checkout-addons";
import { getCheckoutBaseUrl, getStripeServerClient } from "@/lib/stripe/server";

export const metadata: Metadata = {
  title: "Checkout | Labelpilot.de",
  robots: {
    index: false,
    follow: false,
  },
};

type CheckoutPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getProductName(productSlug: "opake-pp-etiketten" | "transparente-pp-etiketten") {
  return productSlug === "opake-pp-etiketten"
    ? "Opake PP-Rollenetiketten 100x200 mm"
    : "Transparente PP-Rollenetiketten 100x200 mm";
}

function formatPrice(amountCents: number) {
  return `${(amountCents / 100).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} EUR brutto`;
}

function formatPriceNet(amountCents: number) {
  return `${(amountCents / 100).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} EUR netto`;
}

function buildAddonSummary(input: {
  addons: CheckoutAddonInput;
  lineItems: Array<{ name: string; grossAmountCents: number }>;
}) {
  const items = input.lineItems.map((item) =>
    item.grossAmountCents > 0
      ? `${item.name}: ${formatPrice(item.grossAmountCents)}`
      : `${item.name}: kostenlos`,
  );

  if (input.addons.customerUploadsOwnData) {
    items.push("Druckfertige Daten werden nach der Zahlung selbst hochgeladen");
  }

  return items;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = parseCheckoutSearchParams(await searchParams);
  const prisma = getPrismaClient();

  let checkoutAvailable = Boolean(prisma);

  if (checkoutAvailable) {
    try {
      getStripeServerClient();
      getCheckoutBaseUrl();
    } catch {
      checkoutAvailable = false;
    }
  }

  if (!params) {
    return (
      <div className="container section-stack">
        <article className="legal-card">
          <span className="eyebrow">Checkout</span>
          <h1>Checkout-Daten konnten nicht geladen werden.</h1>
          <p>Bitte starten Sie den Bestellvorgang erneut über die Produktseite.</p>
          <div className="cta-row">
            <Link href="/de/opake-pp-etiketten" className="cta-link">
              Zu den Produkten
            </Link>
            <Link href="/de/angebot-anfordern" className="secondary-link">
              Angebot anfordern
            </Link>
          </div>
        </article>
      </div>
    );
  }

  const pkg = findPackageByConfig(params);

  if (!pkg) {
    return (
      <div className="container section-stack">
        <article className="legal-card">
          <span className="eyebrow">Checkout</span>
          <h1>Dieses Paket ist nicht verfügbar.</h1>
          <p>Bitte wählen Sie ein gültiges Standardpaket oder nutzen Sie das Angebotsformular.</p>
          <div className="cta-row">
            <Link href="/de/opake-pp-etiketten" className="cta-link">
              Zu den Produkten
            </Link>
            <Link href="/de/angebot-anfordern" className="secondary-link">
              Angebot anfordern
            </Link>
          </div>
        </article>
      </div>
    );
  }

  if (!checkoutAvailable) {
    return (
      <div className="container section-stack">
        <article className="legal-card">
          <span className="eyebrow">Checkout</span>
          <h1>Der Direkt-Checkout ist derzeit nicht verfügbar.</h1>
          <p>
            Bitte nutzen Sie aktuell das Angebotsformular. So gehen Ihre Anfrage und
            Ihre B2B-Bestelldaten sicher bei uns ein.
          </p>
          <div className="cta-row">
            <Link href="/de/angebot-anfordern" className="cta-link">
              Angebot anfordern
            </Link>
            <Link href={`/${["de", pkg.productSlug].join("/")}`} className="secondary-link">
              Zurück zum Produkt
            </Link>
            <Link href="/de/kontakt" className="secondary-link">
              Kontakt
            </Link>
          </div>
        </article>
      </div>
    );
  }

  const settingsRow = prisma
    ? await prisma.pricingSettings.findUnique({
        where: { id: "default" },
      })
    : null;
  const pricingSettings =
    mapPricingSettingsRecord(settingsRow) ?? getDefaultPricingSettings();
  const addonPricing = buildCheckoutAddons({
    featureEnabled: isAddonsEnabled(),
    addons: params.addons,
    baseGrossAmountCents: pkg.grossAmountCents,
    settings: pricingSettings,
  });
  const totalAmountCents = pkg.grossAmountCents + addonPricing.addonsTotalCents;
  const totalNetAmountCents = Math.round(totalAmountCents / 1.19);
  const addonSummary = buildAddonSummary({
    addons: params.addons,
    lineItems: addonPricing.lineItems,
  });

  return (
    <div className="container section-stack">
      <article className="legal-card">
        <span className="eyebrow">Checkout</span>
        <h1>Ihre Bestellung wird vor Stripe geprüft.</h1>
        <p>
          Wir erfassen zuerst Ihre Bestell- und Lieferdaten, legen die Bestellung an und
          leiten Sie danach direkt zu Stripe weiter.
        </p>
      </article>

      <CheckoutIntakeForm
        packageId={pkg.id}
        productSlug={pkg.productSlug}
        material={pkg.material}
        quantity={pkg.quantity}
        addons={params.addons}
        productName={getProductName(pkg.productSlug)}
        packageLabel={pkg.label}
        priceLabel={formatPrice(totalAmountCents)}
        netPriceLabel={formatPriceNet(totalNetAmountCents)}
        addonSummary={addonSummary}
        backHref={`/${["de", pkg.productSlug].join("/")}`}
        initialFinishing={params.finishing}
      />
    </div>
  );
}
