import Link from "next/link";
import type { Metadata } from "next";

import { ArtworkUploadForm } from "@/components/orders/ArtworkUploadForm";
import { ProofApprovalPanel } from "@/components/orders/ProofApprovalPanel";
import { getPrismaClient } from "@/lib/db/prisma";
import {
  getArtworkFileRequirementsText,
  getProofFileRequirementsText,
} from "@/lib/file-validation/artwork";
import {
  getArtworkFileStatusLabel,
  getArtworkStatusLabel,
  getMaterialLabel,
  getOrderStatusLabel,
  getProofFileStatusLabel,
} from "@/lib/orders/artwork";
import { getPackageById } from "@/lib/commerce/packages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Druckdaten hochladen | Labelpilot.de",
  robots: {
    index: false,
    follow: false,
  },
};

type OrderArtworkPageProps = {
  params: Promise<{
    orderId: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

function formatDateLabel(value: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function OrderArtworkPage({
  params,
  searchParams,
}: OrderArtworkPageProps) {
  const prisma = getPrismaClient();
  const { orderId } = await params;
  const { token } = await searchParams;

  if (!prisma || !token) {
    return <InvalidOrderAccess />;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      artworkFiles: {
        orderBy: {
          createdAt: "desc",
        },
      },
      proofFiles: {
        orderBy: {
          createdAt: "desc",
        },
      },
      statusEvents: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!order || order.uploadToken !== token) {
    return <InvalidOrderAccess />;
  }

  const pkg = getPackageById(order.packageId);
  const latestCorrectionEvent = order.statusEvents.find(
    (event: (typeof order.statusEvents)[number]) => event.status === "CORRECTION_REQUIRED" && event.note,
  );
  const files = order.artworkFiles.map((file: (typeof order.artworkFiles)[number]) => ({
    id: file.id,
    fileName: file.fileName,
    sizeBytes: file.sizeBytes,
    statusLabel: getArtworkFileStatusLabel(file.status),
    createdAtLabel: formatDateLabel(file.createdAt),
    downloadHref: `/api/orders/${order.id}/artwork/${file.id}?token=${encodeURIComponent(token)}`,
  }));
  const proofs = order.proofFiles.map((proof: (typeof order.proofFiles)[number]) => ({
    id: proof.id,
    fileName: proof.fileName,
    sizeBytes: proof.sizeBytes,
    status: proof.status,
    statusLabel: getProofFileStatusLabel(proof.status),
    createdAtLabel: formatDateLabel(proof.createdAt),
    adminNote: proof.adminNote,
    customerChangeRequestNote: proof.customerChangeRequestNote,
    downloadHref: `/api/orders/${order.id}/proofs/${proof.id}?token=${encodeURIComponent(token)}`,
  }));

  return (
    <div className="container section-stack">
      <article className="legal-card">
        <span className="eyebrow">Bestellung</span>
        <h1>Druckdaten fuer Ihre Bestellung</h1>
        <p>
          Hier koennen Sie Druckdaten hochladen, den Dateistatus sehen und bei Bedarf
          eine korrigierte Datei senden.
        </p>
      </article>

      <div className="two-column">
        <article className="surface-card">
          <h2>Bestelluebersicht</h2>
          <ul className="simple-list">
            <li>Bestellnummer: {order.orderNumber}</li>
            <li>Paket: {pkg ? `${pkg.label} (${pkg.quantity.toLocaleString("de-DE")} Stueck)` : order.packageId}</li>
            <li>Material: {getMaterialLabel(order.material)}</li>
            <li>Menge: {order.quantity.toLocaleString("de-DE")} Stueck</li>
            <li>Bestellstatus: {getOrderStatusLabel(order.status)}</li>
            <li>Druckdatenstatus: {getArtworkStatusLabel(order.artworkStatus)}</li>
          </ul>
        </article>

        <article className="surface-card">
          <h2>Wichtiger Hinweis</h2>
          <p>
            Rechtliche Pflichtangaben, Zutaten und Naehrwerte bleiben in Ihrer
            Verantwortung.
          </p>
          <p className="price-note">
            Fuer Allergene, Health Claims und sonstige regulatorische Inhalte fuehren wir
            keine rechtliche Pruefung durch.
          </p>
          <div className="cta-row">
            <Link href="/de/druckdaten" className="secondary-link">
              Druckdaten-Hinweise
            </Link>
            <Link href="/de/kontakt" className="secondary-link">
              Kontakt
            </Link>
          </div>
        </article>
      </div>

      <ArtworkUploadForm
        orderId={order.id}
        token={token}
        canUpload={order.status !== "PENDING_PAYMENT" && order.status !== "PAYMENT_FAILED" && order.status !== "CANCELLED"}
        requirementsText={getArtworkFileRequirementsText()}
        initialFiles={files}
      />

      {latestCorrectionEvent?.note ? (
        <article className="surface-card">
          <h2>Korrekturhinweis</h2>
          <p>{latestCorrectionEvent.note}</p>
        </article>
      ) : null}

      <ProofApprovalPanel
        orderId={order.id}
        token={token}
        canRespond={order.status === "WAITING_CUSTOMER_APPROVAL"}
        requirementsText={getProofFileRequirementsText()}
        initialProofs={proofs}
      />
    </div>
  );
}

function InvalidOrderAccess() {
  return (
    <div className="container section-stack">
      <article className="legal-card">
        <span className="eyebrow">Bestellung</span>
        <h1>Bestellung konnte nicht geoeffnet werden.</h1>
        <p>Der Zugriff auf diese Seite ist nicht verfuegbar oder der Link ist ungueltig.</p>
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
