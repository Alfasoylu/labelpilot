import Link from "next/link";
import type { Metadata } from "next";

import { ReorderStartForm } from "@/components/reorder-start-form";
import {
  formatStoredDesignDate,
  getAccessibleStoredDesignDetail,
  getCustomerAccessContext,
} from "@/lib/artwork/saved-designs";
import { getPrismaClient } from "@/lib/db/prisma";
import { getMaterialLabel } from "@/lib/orders/artwork";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Designdetails | Labelpilot.de",
  robots: {
    index: false,
    follow: false,
  },
};

type SavedDesignDetailPageProps = {
  params: Promise<{
    designId: string;
  }>;
  searchParams: Promise<{
    order?: string;
    token?: string;
  }>;
};

export default async function SavedDesignDetailPage({
  params,
  searchParams,
}: SavedDesignDetailPageProps) {
  const prisma = getPrismaClient();
  const { designId } = await params;
  const { order, token } = await searchParams;

  if (!prisma || !order || !token) {
    return <InvalidSavedDesignAccess />;
  }

  const access = await getCustomerAccessContext(prisma, order, token);

  if (!access) {
    return <InvalidSavedDesignAccess />;
  }

  const design = await getAccessibleStoredDesignDetail(prisma, designId, access);

  if (!design) {
    return <InvalidSavedDesignAccess />;
  }

  return (
    <div className="container section-stack">
      <article className="legal-card">
        <span className="eyebrow">Designdetail</span>
        <h1>{design.name}</h1>
        <p>
          Gespeicherte Spezifikation für spätere Nachbestellungen. Die originale Bestellung
          bleibt unverändert, jede freigegebene Version wird separat geführt.
        </p>
      </article>

      <div className="two-column">
        <article className="surface-card">
          <h2>Spezifikation</h2>
          <ul className="simple-list">
            <li>Produkt: {design.productSlug}</li>
            <li>Material: {design.material ? getMaterialLabel(design.material) : "Nicht angegeben"}</li>
            <li>Format: {design.labelSize ?? "Nicht angegeben"}</li>
            <li>Standardmenge: {design.defaultQuantity?.toLocaleString("de-DE") ?? "Nicht angegeben"}</li>
            <li>Letzte Bestellung: {design.lastOrder?.orderNumber ?? "Nicht vorhanden"}</li>
            <li>Zuletzt bestellt: {formatStoredDesignDate(design.lastOrderedAt)}</li>
          </ul>
        </article>

        <article className="surface-card">
          <h2>Nächster Schritt</h2>
          <p>
            Dieses Design ist für die Nachbestellstrecke vorbereitet. Sie können dieselbe
            Spezifikation erneut bestellen oder eine kleine Anpassung auf Basis der letzten
            freigegebenen Version starten.
          </p>
          <div className="simple-list">
            <p><strong>Sofort-Checkout:</strong> Gleiches Artwork erneut bestellen</p>
            <p><strong>Mit Upload danach:</strong> Kleine Anpassung anfordern</p>
          </div>
          <ReorderStartForm
            designId={design.id}
            orderId={order}
            token={token}
            defaultQuantity={design.defaultQuantity}
            currentArtworkVersionId={design.currentArtworkVersionId}
          />
          <div className="cta-row">
            <Link
              href={`/de/gespeicherte-druckdaten?order=${encodeURIComponent(order)}&token=${encodeURIComponent(token)}`}
              className="secondary-link"
            >
              Zur Designliste
            </Link>
            <Link href="/de/nachbestellen" className="secondary-link">
              Nachbestellinfo
            </Link>
          </div>
        </article>
      </div>

      <article className="surface-card">
        <h2>Versionen</h2>
        <div className="section-stack">
          {design.artworkVersions.map((version: (typeof design.artworkVersions)[number]) => {
            const baseHref = `/api/stored-designs/${design.id}/versions/${version.id}?order=${encodeURIComponent(order)}&token=${encodeURIComponent(token)}`;
            return (
              <div key={version.id} className="section-card">
                <h3>
                  {version.versionLabel}
                  {design.currentArtworkVersionId === version.id ? " - aktuell" : ""}
                </h3>
                <p className="price-note">
                  Quelle: {version.sourceType} - Status: {version.status} - Freigabe:{" "}
                  {formatStoredDesignDate(version.approvedAt)}
                </p>
                {version.changeSummary ? <p className="field-hint">{version.changeSummary}</p> : null}
                <div className="simple-list">
                  <p>
                    Originaldatei: {version.originalArtworkFile?.fileName ?? "Nicht hinterlegt"}
                  </p>
                  <p>Proof: {version.proofFile?.fileName ?? "Nicht hinterlegt"}</p>
                </div>
                <div className="cta-row">
                  {(version.originalArtworkFile || version.proofFile) ? (
                    <a href={baseHref} className="secondary-link">
                      Originaldatei herunterladen
                    </a>
                  ) : null}
                  {version.proofFile ? (
                    <a href={`${baseHref}&asset=proof`} className="secondary-link">
                      Proof herunterladen
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </div>
  );
}

function InvalidSavedDesignAccess() {
  return (
    <div className="container section-stack">
      <article className="legal-card">
        <span className="eyebrow">Designdetail</span>
        <h1>Design konnte nicht geöffnet werden.</h1>
        <p>Der Zugriff auf diese gespeicherten Druckdaten ist nicht verfügbar.</p>
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
