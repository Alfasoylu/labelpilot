import Link from "next/link";

import {
  formatAdminDate,
  formatCurrencyFromCents,
  getShippingModeLabel,
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
        <h2>Bestellung ist derzeit nicht verfügbar.</h2>
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
        take: 50,
      },
      adminNotes: {
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
      },
      customer: {
        select: { id: true, companyName: true },
      },
    },
  });

  if (!order) {
    return (
      <article className="legal-card">
        <h2>Bestellung wurde nicht gefunden.</h2>
        <Link href="/admin/orders" className="secondary-link">
          Zurück zur Bestellliste
        </Link>
      </article>
    );
  }

  const pkg = order.packageId ? getPackageById(order.packageId) : null;
  const correctionNote = order.statusEvents.find(
    (event: (typeof order.statusEvents)[number]) => event.status === "CORRECTION_REQUIRED",
  )?.note;
  const addonItems: Array<{ label: string; value: string }> = [];

  if (order.designServiceCents != null) {
    addonItems.push({
      label: "Designservice",
      value:
        order.designServiceCents === 0
          ? "kostenlos"
          : `${formatCurrencyFromCents(order.designServiceCents, order.currency)} brutto`,
    });
  }

  if (order.physicalProofCents != null) {
    addonItems.push({
      label: "Physischer Andruck",
      value: `${formatCurrencyFromCents(order.physicalProofCents, order.currency)} brutto`,
    });
  }

  if (order.expressCents != null) {
    addonItems.push({
      label: "Express",
      value: `${formatCurrencyFromCents(order.expressCents, order.currency)} brutto`,
    });
  }

  if (order.extraDesignCount > 0) {
    addonItems.push({
      label: `${order.extraDesignCount} x Zusatzdesign`,
      value:
        order.extraDesignCents != null
          ? `${formatCurrencyFromCents(order.extraDesignCents, order.currency)} brutto`
          : "kein Aufpreis",
    });
  }

  const hasAddons =
    addonItems.length > 0 || order.addonsTotalCents != null;

  const hasRollSpecs =
    order.rollKern || order.abrollrichtung || order.maxRollendurchmesser || order.maschineName;
  const approvedArtworkFile =
    order.artworkFiles.find(
      (f: (typeof order.artworkFiles)[number]) => f.status === "APPROVED",
    ) ??
    order.artworkFiles[0] ??
    null;

  return (
    <section className="section-stack">
      <article className="surface-card">
        <div className="cta-row">
          <Link href="/admin/orders" className="secondary-link">
            Zurück zur Bestellliste
          </Link>
          <Link
            href={`/de/auftrag/${order.id}/druckdaten?token=${encodeURIComponent(order.uploadToken)}`}
            className="secondary-link"
          >
            Kundenseite öffnen
          </Link>
          {order.customer ? (
            <Link
              href={`/admin/customers/${order.customer.id}`}
              className="secondary-link"
            >
              Kundenprofil ({order.customer.companyName ?? order.customerEmail})
            </Link>
          ) : null}
        </div>
        <h2>{order.orderNumber}</h2>
        <p className="price-note">
          {getOrderStatusLabel(order.status)} · {getArtworkStatusLabel(order.artworkStatus)}
        </p>
        {feedback.message ? <p className="form-status success">{feedback.message}</p> : null}
        {feedback.error ? <p className="form-status error">{feedback.error}</p> : null}
      </article>

      {order.status === "APPROVED_FOR_PRODUCTION" ? (
        <article className="surface-card">
          <span className="eyebrow">Produktionsübergabe</span>
          <h2>Auftrag freigegeben – bereit für die Produktion</h2>
          <ul className="simple-list">
            <li>Material: {getMaterialLabel(order.material)}</li>
            <li>Menge: {order.quantity.toLocaleString("de-DE")} Stück</li>
            <li>Oberfläche: {formatFinishing(order.finishing)}</li>
            {order.tiefkuehlgeeignet ? (
              <li><strong>Tiefkühlgeeignet: Ja (Spezialkleber bis −20 °C)</strong></li>
            ) : null}
            <li>
              Format:{" "}
              {order.widthMm && order.heightMm
                ? `${order.widthMm} × ${order.heightMm} mm (Wunschformat)`
                : "100 × 200 mm (Standardformat)"}
            </li>
            {order.rollKern ? <li>Rollenkern: {order.rollKern}</li> : null}
            {order.abrollrichtung ? <li>Abrollrichtung: {order.abrollrichtung}</li> : null}
            {order.maxRollendurchmesser ? (
              <li>Max. Rollendurchmesser: {order.maxRollendurchmesser}</li>
            ) : null}
            {order.maschineName ? <li>Maschine / Etikettenspender: {order.maschineName}</li> : null}
          </ul>
          {approvedArtworkFile ? (
            <div className="inline-actions">
              <a
                href={`/api/admin/orders/${order.id}/artwork/${approvedArtworkFile.id}`}
                className="cta-link"
              >
                Druckdatei herunterladen ({approvedArtworkFile.fileName})
              </a>
            </div>
          ) : (
            <p className="price-note">Noch keine freigegebene Druckdatei vorhanden.</p>
          )}
        </article>
      ) : null}

      <div className="two-column">
        <article className="surface-card">
          <h2>Bestellfakten</h2>
          <ul className="simple-list">
            <li>Bestellnummer: {order.orderNumber}</li>
            <li>Erstellt: {formatAdminDate(order.createdAt)}</li>
            {order.widthMm && order.heightMm ? (
              <li>Format: {order.widthMm} × {order.heightMm} mm (Wunschformat)</li>
            ) : (
              <li>Paket: {pkg ? pkg.label : (order.packageId ?? "Standardpaket")}</li>
            )}
            <li>Produkt: {order.productSlug}</li>
            <li>Material: {getMaterialLabel(order.material)}</li>
            <li>Menge: {order.quantity.toLocaleString("de-DE")} Stück</li>
            <li>Anzahl Druckmotive: {order.extraDesignCount + 1}</li>
            <li>Oberfläche: {formatFinishing(order.finishing)}</li>
            {order.tiefkuehlgeeignet ? (
              <li><strong>Tiefkühlgeeignet: Ja (Spezialkleber bis −20 °C)</strong></li>
            ) : null}
            <li>Proof-Typ: {order.physicalProofCents != null ? "Digital + Physischer Andruck" : "Digital (inklusive)"}</li>
            <li>Gesamtbetrag: {formatCurrencyFromCents(order.amountCents, order.currency)} brutto inkl. 19% MwSt.</li>
            <li>Zahlung: {order.payments[0]?.status ?? "PENDING"}</li>
          </ul>
        </article>

        <article className="surface-card">
          <h2>Kunde</h2>
          <ul className="simple-list">
            <li>E-Mail: {order.customerEmail}</li>
            <li>Firma: {order.companyName ?? "Nicht angegeben"}</li>
            <li>Name: {order.customerName ?? "Nicht angegeben"}</li>
            <li>Telefon: {order.customerPhone ?? "Nicht angegeben"}</li>
            <li>USt-IdNr.: {order.vatId ?? "Nicht angegeben"}</li>
            <li>Land: {order.country}</li>
            <li>
              Lieferadresse:{" "}
              {order.streetAddress
                ? [order.streetAddress, order.addressLine2, order.postalCode, order.city]
                    .filter(Boolean)
                    .join(", ")
                : "Nicht angegeben"}
            </li>
            <li>Druckdatenwunsch: {formatArtworkInputStatus(order.artworkInputStatus)}</li>
            <li>Stripe Session: {order.stripeCheckoutSessionId ?? "Noch nicht gesetzt"}</li>
            <li>Payment Intent: {order.stripePaymentIntentId ?? "Noch nicht gesetzt"}</li>
          </ul>
          {order.customerNote ? <p className="field-hint">Hinweis: {order.customerNote}</p> : null}
        </article>
      </div>

      {hasRollSpecs ? (
        <article className="surface-card">
          <h2>Rollenspezifikationen</h2>
          <ul className="simple-list">
            <li>Rollenkern: {order.rollKern ?? "Nicht angegeben"}</li>
            <li>Abrollrichtung: {order.abrollrichtung ?? "Nicht angegeben"}</li>
            <li>Max. Rollendurchmesser: {order.maxRollendurchmesser ?? "Nicht angegeben"}</li>
            <li>Maschine / Etikettenspender: {order.maschineName ?? "Nicht angegeben"}</li>
          </ul>
        </article>
      ) : null}

      <article className="surface-card">
        <h2>Zusatzleistungen</h2>
        {hasAddons ? (
          <ul className="simple-list">
            {addonItems.map((item) => (
              <li key={item.label}>
                {item.label}: {item.value}
              </li>
            ))}
            {order.addonsTotalCents != null ? (
              <li>
                Zusatzleistungen gesamt:{" "}
                {formatCurrencyFromCents(order.addonsTotalCents, order.currency)} brutto
              </li>
            ) : null}
          </ul>
        ) : (
          <p className="price-note">Keine Zusatzleistungen.</p>
        )}
      </article>

      {(order.reorderSourceDesignId || order.reorderMode || order.reorderStockDuration) ? (
        <article className="surface-card">
          <h2>Nachbestellkontext</h2>
          <ul className="simple-list">
            <li>Source Design: {order.reorderSourceDesignId ?? "Nicht gesetzt"}</li>
            <li>Artwork-Version: {order.reorderSourceArtworkVersionId ?? "Nicht gesetzt"}</li>
            <li>Branch: {formatReorderMode(order.reorderMode)}</li>
            <li>Bestandsdauer: {formatReorderStockDuration(order.reorderStockDuration)}</li>
          </ul>
        </article>
      ) : null}

      <article className="surface-card">
        <h2>Status ändern</h2>
        <form
          action={`/api/admin/orders/${order.id}/status`}
          method="post"
          className="quote-form"
        >
          <input type="hidden" name="redirectTo" value={`/admin/orders/${order.id}`} />
          <div className="form-grid">
            <div>
              <label htmlFor="new-status">Neuer Status</label>
              <select id="new-status" name="status" defaultValue={order.status}>
                <option value="PENDING_PAYMENT">Zahlung ausstehend</option>
                <option value="PAID">Bezahlt</option>
                <option value="FILE_REVIEW">Dateiprüfung</option>
                <option value="CORRECTION_REQUIRED">Korrektur erforderlich</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="PROOF_REQUIRED">Proof nötig</option>
                <option value="WAITING_CUSTOMER_APPROVAL">Proof wartet auf Freigabe</option>
                <option value="APPROVED_FOR_PRODUCTION">Freigegeben für Produktion</option>
                <option value="IN_PRODUCTION">In Produktion</option>
                <option value="READY_TO_SHIP">Versandbereit</option>
                <option value="SHIPPED">Versendet</option>
                <option value="DELIVERED">Zugestellt</option>
                <option value="COMPLETED">Abgeschlossen</option>
                <option value="REPRINT_REQUIRED">Nachdruck nötig</option>
                <option value="REFUND_REQUESTED">Rückerstattung angefragt</option>
                <option value="CANCELLED">Storniert</option>
              </select>
            </div>
            <div className="field-full">
              <label htmlFor="status-note">Interne Notiz (optional)</label>
              <textarea id="status-note" name="note" rows={3} />
            </div>
          </div>
          <div className="inline-actions">
            <button type="submit" className="cta-button">Status speichern</button>
          </div>
        </form>
      </article>

      <article className="surface-card">
        <h2>Druckdateien</h2>
        {order.artworkFiles.length === 0 ? (
          <p className="price-note">Keine Dateien für diese Bestellung vorhanden.</p>
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
                      <label htmlFor={`note-${file.id}`}>Hinweis für Kunde oder Produktion</label>
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
                      Datei prüfen
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
                placeholder="Optionaler Hinweis für den Kunden."
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
                    Änderungswunsch: {proof.customerChangeRequestNote}
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
        <h2>Versand</h2>
        <form
          action={`/api/admin/orders/${order.id}/shipment`}
          method="post"
          className="quote-form"
        >
          <div className="form-grid">
            <div>
              <label htmlFor="shippingMode">Versandart</label>
              <select id="shippingMode" name="shippingMode" defaultValue={order.shippingMode ?? ""}>
                <option value="">Bitte wählen</option>
                <option value="DIRECT_TR">Direktversand Türkei → Deutschland</option>
                <option value="CONSOLIDATED">Sammelversand / Teilladung</option>
                <option value="DE_HUB">Versand über Deutschland-Hub</option>
              </select>
            </div>
            <div>
              <label htmlFor="shippingCarrier">Versanddienstleister</label>
              <input id="shippingCarrier" name="shippingCarrier" defaultValue={order.shippingCarrier ?? ""} />
            </div>
            <div>
              <label htmlFor="trackingNumber">Trackingnummer</label>
              <input id="trackingNumber" name="trackingNumber" defaultValue={order.trackingNumber ?? ""} />
            </div>
            <div>
              <label htmlFor="trackingUrl">Tracking-URL</label>
              <input id="trackingUrl" name="trackingUrl" type="url" defaultValue={order.trackingUrl ?? ""} />
            </div>
            <div>
              <label htmlFor="packageCount">Paketanzahl</label>
              <input id="packageCount" name="packageCount" type="number" min="1" defaultValue={order.packageCount ?? ""} />
            </div>
            <div>
              <label htmlFor="shipmentWeightKg">Gewicht kg</label>
              <input id="shipmentWeightKg" name="shipmentWeightKg" type="number" min="0.01" step="0.01" defaultValue={order.shipmentWeightKg ?? ""} />
            </div>
            <div>
              <label htmlFor="shippedAt">Versanddatum</label>
              <input id="shippedAt" name="shippedAt" type="datetime-local" defaultValue={toDateTimeLocal(order.shippedAt)} />
            </div>
            <div>
              <label htmlFor="estimatedDeliveryAt">Voraussichtliche Lieferung</label>
              <input id="estimatedDeliveryAt" name="estimatedDeliveryAt" type="datetime-local" defaultValue={toDateTimeLocal(order.estimatedDeliveryAt)} />
            </div>
            <div className="field-full">
              <label htmlFor="shipmentNote">Versandnotiz</label>
              <textarea id="shipmentNote" name="shipmentNote" rows={3} defaultValue={order.shipmentNote ?? ""} />
            </div>
          </div>
          <div className="simple-list">
            <p>Aktuelle Versandart: {getShippingModeLabel(order.shippingMode)}</p>
            <p>Versendet: {order.shippedAt ? formatAdminDate(order.shippedAt) : "Noch nicht gesetzt"}</p>
            <p>Zugestellt: {order.deliveredAt ? formatAdminDate(order.deliveredAt) : "Noch nicht gesetzt"}</p>
          </div>
          <div className="inline-actions">
            <button type="submit" className="cta-button">Versanddaten speichern</button>
            <button type="submit" name="markShipped" value="yes" className="secondary-link">
              Als versendet markieren
            </button>
            <button type="submit" name="markDelivered" value="yes" className="secondary-link">
              Als zugestellt markieren
            </button>
          </div>
        </form>
      </article>

      <article className="surface-card">
        <h2>Statushistorie</h2>
        {order.statusEvents.length === 0 ? (
          <p className="price-note">Noch keine Statusänderung vorhanden.</p>
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

      <article className="surface-card">
        <h2>Admin-Notizen</h2>
        <form
          action={`/api/admin/orders/${order.id}/notes`}
          method="post"
          className="quote-form"
        >
          <div className="form-grid">
            <div>
              <label htmlFor="noteType">Notiztyp</label>
              <select id="noteType" name="noteType" defaultValue="INTERNAL">
                <option value="INTERNAL">Intern</option>
                <option value="CUSTOMER_VISIBLE">Kundensichtbar</option>
                <option value="PRODUCTION">Produktion</option>
                <option value="SHIPPING">Versand</option>
                <option value="PAYMENT">Zahlung</option>
                <option value="REPRINT">Nachdruck</option>
              </select>
            </div>
            <div>
              <label htmlFor="isCustomerVisible">Sichtbarkeit</label>
              <select id="isCustomerVisible" name="isCustomerVisible" defaultValue="no">
                <option value="no">Nur intern</option>
                <option value="yes">Kundensichtbar</option>
              </select>
            </div>
            <div className="field-full">
              <label htmlFor="body">Notiz</label>
              <textarea id="body" name="body" rows={4} />
            </div>
          </div>
          <div className="inline-actions">
            <button type="submit" className="cta-button">Notiz speichern</button>
          </div>
        </form>

        {order.adminNotes.length === 0 ? (
          <p className="price-note">Noch keine Admin-Notizen vorhanden.</p>
        ) : (
          <div className="section-stack">
            {order.adminNotes.map((note: (typeof order.adminNotes)[number]) => (
              <div key={note.id} className="section-card">
                <h3>{formatNoteType(note.noteType)}</h3>
                <p className="price-note">
                  {formatAdminDate(note.createdAt)} · {note.actor ?? "admin"} · {note.isCustomerVisible ? "kundensichtbar" : "intern"}
                </p>
                <p className="field-hint">{note.body}</p>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}

function toDateTimeLocal(value: Date | null) {
  if (!value) {
    return "";
  }

  return new Date(value.getTime() - value.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function formatNoteType(value: string) {
  switch (value) {
    case "CUSTOMER_VISIBLE":
      return "Kundensichtbar";
    case "PRODUCTION":
      return "Produktion";
    case "SHIPPING":
      return "Versand";
    case "PAYMENT":
      return "Zahlung";
    case "REPRINT":
      return "Nachdruck";
    case "INTERNAL":
    default:
      return "Intern";
  }
}

function formatReorderMode(value: string | null) {
  switch (value) {
    case "SAME_ARTWORK":
      return "Gleiches Artwork";
    case "MINOR_CHANGE":
      return "Kleine Anpassung";
    default:
      return "Nicht gesetzt";
  }
}

function formatReorderStockDuration(value: string | null) {
  switch (value) {
    case "UNDER_4_WEEKS":
      return "Unter 4 Wochen";
    case "ONE_TO_THREE_MONTHS":
      return "1 bis 3 Monate";
    case "THREE_TO_SIX_MONTHS":
      return "3 bis 6 Monate";
    case "OVER_SIX_MONTHS":
      return "Mehr als 6 Monate";
    default:
      return "Nicht gesetzt";
  }
}

function formatFinishing(value: string | null) {
  switch (value) {
    case "MATT":
      return "Matt";
    case "GLAENZEND":
      return "Glänzend";
    default:
      return "Nicht angegeben";
  }
}

function formatArtworkInputStatus(value: string | null) {
  switch (value) {
    case "artwork_ready":
      return "Druckdaten bereit";
    case "upload_after_order":
      return "Upload nach Bestellung";
    case "needs_help":
      return "Hilfe bei Datei oder Gestaltung";
    default:
      return "Nicht angegeben";
  }
}
