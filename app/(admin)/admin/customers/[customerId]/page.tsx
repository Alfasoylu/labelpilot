import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { formatAdminDate, formatCurrencyFromCents } from "@/lib/admin/orders";
import { getPrismaClient } from "@/lib/db/prisma";
import {
  getArtworkStatusLabel,
  getMaterialLabel,
  getOrderStatusLabel,
} from "@/lib/orders/artwork";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ customerId: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
};

function formatAddressBlock(parts: {
  company?: string | null;
  street?: string | null;
  line2?: string | null;
  postalCode?: string | null;
  city?: string | null;
  country?: string | null;
}): string {
  const lines: string[] = [];
  if (parts.company) lines.push(parts.company);
  if (parts.street) lines.push(parts.street);
  if (parts.line2) lines.push(parts.line2);
  const cityLine = [parts.postalCode, parts.city].filter(Boolean).join(" ");
  if (cityLine) lines.push(cityLine);
  if (parts.country) lines.push(parts.country);
  return lines.join("\n");
}

const PAID_STATUSES = [
  "PAID",
  "FILE_REVIEW",
  "CORRECTION_REQUIRED",
  "ON_HOLD",
  "PROOF_REQUIRED",
  "WAITING_CUSTOMER_APPROVAL",
  "APPROVED_FOR_PRODUCTION",
  "IN_PRODUCTION",
  "READY_TO_SHIP",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
];

export default async function AdminCustomerDetailPage({ params, searchParams }: PageProps) {
  const prisma = getPrismaClient();
  const { customerId } = await params;
  const feedback = await searchParams;

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Kunden sind derzeit nicht verfügbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          amountCents: true,
          currency: true,
          quantity: true,
          material: true,
          productSlug: true,
          widthMm: true,
          heightMm: true,
          createdAt: true,
          artworkStatus: true,
        },
      },
      storedDesigns: {
        where: { status: "ACTIVE" },
        include: {
          _count: { select: { artworkVersions: true } },
        },
        orderBy: { lastOrderedAt: "desc" },
      },
      _count: { select: { orders: true } },
    },
  });

  if (!customer) notFound();

  const totalRevenueCents = customer.orders
    .filter((o) => PAID_STATUSES.includes(o.status))
    .reduce((sum, o) => sum + o.amountCents, 0);

  return (
    <section className="section-stack">
      <article className="legal-card">
        <span className="eyebrow">Kundendetails</span>
        <h1>{customer.companyName ?? customer.email}</h1>
        <p className="price-note">
          Erstellt am {formatAdminDate(customer.createdAt)}
        </p>
        <div className="cta-row">
          <Link href="/admin/customers" className="secondary-link">
            ← Alle Kunden
          </Link>
          <a href={`mailto:${customer.email}`} className="secondary-link">
            E-Mail schreiben
          </a>
        </div>
      </article>

      <div className="two-column">
        <article className="surface-card">
          <h2>Profil</h2>
          <ul className="simple-list">
            <li>E-Mail: {customer.email}</li>
            {customer.companyName ? <li>Firma: {customer.companyName}</li> : null}
            {customer.contactName ? <li>Kontakt: {customer.contactName}</li> : null}
            {customer.phone ? <li>Telefon: {customer.phone}</li> : null}
            <li>Auth-ID: {customer.authUserId ?? "Kein Konto"}</li>
            <li>Erstellt: {formatAdminDate(customer.createdAt)}</li>
          </ul>
        </article>

        <article className="surface-card">
          <h2>Kennzahlen</h2>
          <ul className="simple-list">
            <li>
              Bestellungen gesamt:{" "}
              <strong>{customer._count.orders.toLocaleString("de-DE")}</strong>
            </li>
            <li>
              Gespeicherte Designs:{" "}
              <strong>{customer.storedDesigns.length.toLocaleString("de-DE")}</strong>
            </li>
            <li>
              Umsatz (bezahlte Bestellungen):{" "}
              <strong>{formatCurrencyFromCents(totalRevenueCents)}</strong>
            </li>
          </ul>
        </article>
      </div>

      <article className="surface-card">
        <h2>Adressen & USt-IdNr.</h2>
        <div className="two-column">
          <div>
            <p className="eyebrow">Lieferadresse</p>
            {customer.street ? (
              <p style={{ whiteSpace: "pre-line", margin: "4px 0 0" }}>
                {formatAddressBlock({
                  street: customer.street,
                  line2: customer.addressLine2,
                  postalCode: customer.postalCode,
                  city: customer.city,
                  country: customer.country,
                })}
              </p>
            ) : (
              <p className="price-note">Nicht hinterlegt</p>
            )}
          </div>
          <div>
            <p className="eyebrow">Rechnungsadresse</p>
            {customer.billingStreet ? (
              <p style={{ whiteSpace: "pre-line", margin: "4px 0 0" }}>
                {formatAddressBlock({
                  company: customer.billingCompanyName,
                  street: customer.billingStreet,
                  line2: customer.billingAddressLine2,
                  postalCode: customer.billingPostalCode,
                  city: customer.billingCity,
                  country: customer.billingCountry,
                })}
              </p>
            ) : (
              <p className="price-note">Wie Lieferadresse</p>
            )}
          </div>
        </div>
        <ul className="simple-list" style={{ marginTop: "0.75rem" }}>
          <li>USt-IdNr.: {customer.vatId ?? "—"}</li>
        </ul>
      </article>

      <article className="surface-card">
        <h2>Zahlungskonditionen</h2>
        <p className="price-note">
          Aktuell:{" "}
          {customer.paymentTermsApproved
            ? `Rechnungskauf freigegeben (Netto-${customer.paymentTermsNetDays ?? 15} Tage)`
            : "Vorkasse (Stripe Checkout)"}
        </p>
        {feedback.message ? <p className="form-status success">{feedback.message}</p> : null}
        {feedback.error ? <p className="form-status error">{feedback.error}</p> : null}
        <form action={`/api/admin/customers/${customer.id}/payment-terms`} method="post" className="quote-form">
          <div className="form-grid">
            <div>
              <label htmlFor="paymentTermsApproved">Rechnungskauf</label>
              <select
                id="paymentTermsApproved"
                name="paymentTermsApproved"
                defaultValue={customer.paymentTermsApproved ? "true" : "false"}
              >
                <option value="false">Nein – Vorkasse</option>
                <option value="true">Ja – Rechnungskauf freigegeben</option>
              </select>
            </div>
            <div>
              <label htmlFor="paymentTermsNetDays">Zahlungsziel (Tage netto)</label>
              <input
                id="paymentTermsNetDays"
                name="paymentTermsNetDays"
                type="number"
                min="0"
                max="120"
                defaultValue={customer.paymentTermsNetDays ?? 15}
              />
            </div>
          </div>
          <div className="inline-actions">
            <button type="submit" className="cta-button">Speichern</button>
          </div>
        </form>
      </article>

      <article className="surface-card">
        <h2>Letzte 20 Bestellungen</h2>
        {customer.orders.length === 0 ? (
          <p className="price-note">Noch keine Bestellungen vorhanden.</p>
        ) : (
          <div className="section-stack">
            {customer.orders.map((order) => (
              <div key={order.id} className="section-card">
                <div className="two-column">
                  <div>
                    <div className="admin-order-heading">
                      <h3>{order.orderNumber}</h3>
                      <Badge variant="outline">{getOrderStatusLabel(order.status)}</Badge>
                    </div>
                    <p className="price-note">
                      {getMaterialLabel(order.material)}
                      {order.widthMm && order.heightMm
                        ? ` · ${order.widthMm}×${order.heightMm} mm`
                        : ""}
                    </p>
                    <p className="price-note">
                      {getArtworkStatusLabel(
                        order.artworkStatus as Parameters<typeof getArtworkStatusLabel>[0],
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="price-note">
                      {order.quantity.toLocaleString("de-DE")} Stück
                    </p>
                    <p className="price-note">
                      {formatCurrencyFromCents(order.amountCents, order.currency)}
                    </p>
                    <p className="price-note">{formatAdminDate(order.createdAt)}</p>
                  </div>
                </div>
                <Link href={`/admin/orders/${order.id}`} className="secondary-link">
                  Bestellung öffnen →
                </Link>
              </div>
            ))}
          </div>
        )}
      </article>

      {customer.storedDesigns.length > 0 ? (
        <article className="surface-card">
          <h2>Gespeicherte Designs ({customer.storedDesigns.length})</h2>
          <div className="section-stack">
            {customer.storedDesigns.map((design) => (
              <div key={design.id} className="section-card">
                <h3>{design.name}</h3>
                <p className="price-note">
                  {design.productSlug}
                  {design.material ? ` · ${getMaterialLabel(design.material)}` : ""}
                  {design.labelSize ? ` · ${design.labelSize}` : ""}
                </p>
                <ul className="simple-list">
                  <li>Versionen: {design._count.artworkVersions}</li>
                  <li>Nachbestellungen: {design.totalOrders}</li>
                  {design.lastOrderedAt ? (
                    <li>Zuletzt bestellt: {formatAdminDate(design.lastOrderedAt)}</li>
                  ) : null}
                  {design.defaultQuantity ? (
                    <li>
                      Standardmenge: {design.defaultQuantity.toLocaleString("de-DE")} Stück
                    </li>
                  ) : null}
                </ul>
              </div>
            ))}
          </div>
        </article>
      ) : null}
    </section>
  );
}
