import Link from "next/link";
import type { Metadata } from "next";

import {
  formatStoredDesignDate,
  getCustomerAccessContext,
  listAccessibleStoredDesigns,
} from "@/lib/artwork/saved-designs";
import { getPrismaClient } from "@/lib/db/prisma";
import { getMaterialLabel } from "@/lib/orders/artwork";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gespeicherte Druckdaten | Labelpilot.de",
  robots: {
    index: false,
    follow: false,
  },
};

type SavedDesignsPageProps = {
  searchParams: Promise<{
    order?: string;
    token?: string;
  }>;
};

export default async function SavedDesignsPage({ searchParams }: SavedDesignsPageProps) {
  const prisma = getPrismaClient();
  const { order, token } = await searchParams;

  if (!prisma || !order || !token) {
    return <InvalidSavedDesignAccess />;
  }

  const access = await getCustomerAccessContext(prisma, order, token);

  if (!access) {
    return <InvalidSavedDesignAccess />;
  }

  const designs = await listAccessibleStoredDesigns(prisma, access);

  return (
    <div className="container section-stack">
      <article className="legal-card">
        <span className="eyebrow">Gespeicherte Druckdaten</span>
        <h1>Ihre freigegebenen Designs für schnelle Nachbestellungen</h1>
        <p>
          Hier sehen Sie freigegebene Druckdaten aus Ihren bisherigen Bestellungen.
          Jede Version bleibt getrennt gespeichert und kann für spätere Nachbestellungen
          wiederverwendet werden.
        </p>
      </article>

      <article className="surface-card">
        <h2>Zugriff</h2>
        <p className="price-note">
          Freigeschaltet für {access.companyName || access.customerName || access.customerEmail}
        </p>
        <div className="cta-row">
          <Link
            href={`/de/auftrag/${order}/druckdaten?token=${encodeURIComponent(token)}`}
            className="secondary-link"
          >
            Zurück zur Bestellansicht
          </Link>
          <Link href="/de/nachbestellen" className="secondary-link">
            Nachbestellprozess ansehen
          </Link>
        </div>
      </article>

      <article className="surface-card">
        <h2>Verfügbare Designs</h2>
        {designs.length === 0 ? (
          <p className="price-note">
            Noch keine freigegebenen Designs verfügbar. Sobald ein Auftrag freigegeben ist,
            erscheint er hier für spätere Nachbestellungen.
          </p>
        ) : (
          <div className="section-stack">
            {designs.map((design: (typeof designs)[number]) => (
              <div key={design.id} className="section-card">
                <h3>{design.name}</h3>
                <p className="price-note">
                  {design.productSlug} - {design.material ? getMaterialLabel(design.material) : "Material offen"} -{" "}
                  {design.labelSize ?? "Format offen"}
                </p>
                <p className="field-hint">
                  Letzte Freigabe: {formatStoredDesignDate(design.currentArtworkVersion?.approvedAt ?? null)}
                  {" - "}
                  Versionen: {design._count.artworkVersions}
                  {" - "}
                  Letzte Bestellung: {design.lastOrder?.orderNumber ?? "Nicht vorhanden"}
                </p>
                <div className="cta-row">
                  <Link
                    href={`/de/gespeicherte-druckdaten/${design.id}?order=${encodeURIComponent(order)}&token=${encodeURIComponent(token)}`}
                    className="cta-link"
                  >
                    Design ansehen
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}

function InvalidSavedDesignAccess() {
  return (
    <div className="container section-stack">
      <article className="legal-card">
        <span className="eyebrow">Gespeicherte Druckdaten</span>
        <h1>Zugriff nicht verfügbar</h1>
        <p>Diese Ansicht erfordert einen gültigen Bestelllink.</p>
        <div className="cta-row">
          <Link href="/de/kontakt" className="cta-link">
            Kontakt
          </Link>
          <Link href="/de" className="secondary-link">
            Zur Startseite
          </Link>
        </div>
      </article>
    </div>
  );
}
