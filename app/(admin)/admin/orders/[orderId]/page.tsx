import Link from "next/link";

import {
  formatAdminDate,
  formatCurrencyFromCents,
} from "@/lib/admin/orders";
import { getPackageById } from "@/lib/commerce/packages";
import { getPrismaClient } from "@/lib/db/prisma";
import {
  getArtworkFileStatusLabel,
  getArtworkStatusLabel,
  getMaterialLabel,
  getOrderStatusLabel,
  getProofFileStatusLabel,
} from "@/lib/orders/artwork";

export const dynamic = "force-dynamic";

type AdminOrderDetailPageProps = {
  params: Promise<{
    orderId: string;
  }>;
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
};

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: AdminOrderDetailPageProps) {
  const prisma = getPrismaClient();
  const { orderId } = await params;
  const feedback = await searchParams;

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Bestellung ist derzeit nicht verfuegbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      payments: true,
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
        take: 20,
      },
    },
  });

  if (!order) {
    return (
      <article className="legal-card">
        <h2>Bestellung wurde nicht gefunden.</h2>
        <Link href="/admin/orders" className="secondary-link">
          Zurueck zur Bestellliste
        </Link>
      </article>
    );
  }

  const pkg = getPackageById(order.packageId);
  const correctionNote = order.statusEvents.find(
    (event: (typeof order.statusEvents)[number]) => event.status === "CORRECTION_REQUIRED",
  )?.note;

  return (
    <section className="section-stack">
      <article className="surface-card">
        <div className="cta-row">
          <Link href="/admin/orders" className="secondary-link">
            Zurueck zur Bestellliste
          </Link>
          <Link
            href={`/de/auftrag/${order.id}/druckdaten?token=${encodeURIComponent(order.uploadToken)}`}
            className="secondary-link"
          >
            Kundenseite oeffnen
          </Link>
        </div>
        <h2>{order.orderNumber}</h2>
        <p className="price-note">
          {getOrderStatusLabel(order.status)} · {getArtworkStatusLabel(order.artworkStatus)}
        </p>
        {feedback.message ? <p className="form-status success">{feedback.message}</p> : null}
        {feedback.error ? <p className="form-status error">{feedback.error}</p> : null}
      </article>

      <div className="two-column">
        <article className="surface-card">
          <h2>Bestellfakten</h2>
          <ul className="simple-list">
            <li>Bestellnummer: {order.orderNumber}</li>
            <li>Erstellt: {formatAdminDate(order.createdAt)}</li>
            <li>Paket: {pkg ? pkg.label : order.packageId}</li>
            <li>Produkt: {order.productSlug}</li>
            <li>Material: {getMaterialLabel(order.material)}</li>
            <li>Menge: {order.quantity.toLocaleString("de-DE")} Stueck</li>
            <li>Betrag: {formatCurrencyFromCents(order.amountCents, order.currency)}</li>
            <li>Zahlung: {order.payments[0]?.status ?? "PENDING"}</li>
          </ul>
        </article>

        <article className="surface-card">
          <h2>Kunde</h2>
          <ul className="simple-list">
            <li>E-Mail: {order.customerEmail}</li>
            <li>Firma: {order.companyName ?? "Nicht angegeben"}</li>
            <li>Name: {order.customerName ?? "Nicht angegeben"}</li>
            <li>Land: {order.country}</li>
            <li>Stripe Session: {order.stripeCheckoutSessionId ?? "Noch nicht gesetzt"}</li>
            <li>Payment Intent: {order.stripePaymentIntentId ?? "Noch nicht gesetzt"}</li>
          </ul>
        </article>
      </div>

      <article className="surface-card">
        <h2>Druckdateien</h2>
        {order.artworkFiles.length === 0 ? (
          <p className="price-note">Keine Dateien fuer diese Bestellung vorhanden.</p>
        ) : (
          <div className="section-stack">
            {order.artworkFiles.map((file: (typeof order.artworkFiles)[number]) => (
              <div key={file.id} className="section-card">
                <div className="two-column">
                  <div>
                    <h3>{file.fileName}</h3>
                    <p className="price-note">
                      {getArtworkFileStatusLabel(file.status)} · {formatAdminDate(file.createdAt)}
                    </p>
                    <p className="price-note">
                      {Math.max(1, Math.round(file.sizeBytes / 1024))} KB
                    </p>
                  </div>
                  <div className="cta-row">
                    <a
                      href={`/api/admin/orders/${order.id}/artwork/${file.id}`}
                      className="secondary-link"
                    >
                      Datei herunterladen
                    </a>
                  </div>
                </div>

                <form
                  action={`/api/admin/orders/${order.id}/artwork/review`}
                  method="post"
                  className="quote-form"
                >
                  <input type="hidden" name="artworkFileId" value={file.id} />
                  <input type="hidden" name="redirectTo" value={`/admin/orders/${order.id}`} />
                  <div className="form-grid">
                    <div className="field-full">
                      <label htmlFor={`note-${file.id}`}>Hinweis fuer Kunde oder Produktion</label>
                      <textarea
                        id={`note-${file.id}`}
                        name="note"
                        rows={3}
                        defaultValue={file.status === "CORRECTION_REQUIRED" ? correctionNote ?? "" : ""}
                      />
                    </div>
                  </div>
                  <div className="inline-actions">
                    <button type="submit" name="action" value="under_review" className="secondary-link">
                      Datei pruefen
                    </button>
                    <button type="submit" name="action" value="approve" className="secondary-link">
                      Datei freigeben
                    </button>
                    <button
                      type="submit"
                      name="action"
                      value="request_correction"
                      className="secondary-link"
                    >
                      Korrektur anfordern
                    </button>
                  </div>
                </form>
              </div>
            ))}
          </div>
        )}
      </article>

      <article className="surface-card">
        <h2>Proof</h2>
        <form
          action={`/api/admin/orders/${order.id}/proofs`}
          method="post"
          encType="multipart/form-data"
          className="quote-form"
        >
          <input type="hidden" name="redirectTo" value={`/admin/orders/${order.id}`} />
          <div className="form-grid">
            <div className="field-full">
              <label htmlFor="proof-file">Proof-Datei</label>
              <input id="proof-file" name="file" type="file" accept=".pdf,.png,.jpg,.jpeg" />
            </div>
            <div className="field-full">
              <label htmlFor="proof-note">Hinweis</label>
              <textarea
                id="proof-note"
                name="note"
                rows={3}
                placeholder="Optionaler Hinweis fuer den Kunden."
              />
            </div>
          </div>
          <div className="inline-actions">
            <button type="submit" className="cta-button">
              Proof hochladen
            </button>
          </div>
        </form>

        {order.proofFiles.length === 0 ? (
          <p className="price-note">Noch kein Proof hochgeladen.</p>
        ) : (
          <div className="section-stack">
            {order.proofFiles.map((proof: (typeof order.proofFiles)[number]) => (
              <div key={proof.id} className="section-card">
                <h3>{proof.fileName}</h3>
                <p className="price-note">
                  {getProofFileStatusLabel(proof.status)} · {formatAdminDate(proof.createdAt)}
                </p>
                {proof.adminNote ? <p className="field-hint">Hinweis: {proof.adminNote}</p> : null}
                {proof.customerChangeRequestNote ? (
                  <p className="field-hint">
                    Aenderungswunsch: {proof.customerChangeRequestNote}
                  </p>
                ) : null}
                {proof.customerApprovedAt ? (
                  <p className="price-note">
                    Kundenfreigabe: {formatAdminDate(proof.customerApprovedAt)}
                  </p>
                ) : null}
                <a
                  href={`/api/admin/orders/${order.id}/proofs/${proof.id}`}
                  className="secondary-link"
                >
                  Proof herunterladen
                </a>
              </div>
            ))}
          </div>
        )}
      </article>

      <article className="surface-card">
        <h2>Statushistorie</h2>
        {order.statusEvents.length === 0 ? (
          <p className="price-note">Noch keine Statusaenderung vorhanden.</p>
        ) : (
          <div className="section-stack">
            {order.statusEvents.map((event: (typeof order.statusEvents)[number]) => (
              <div key={event.id} className="section-card">
                <h3>{getOrderStatusLabel(event.status)}</h3>
                <p className="price-note">{formatAdminDate(event.createdAt)}</p>
                {event.note ? <p className="field-hint">{event.note}</p> : null}
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
