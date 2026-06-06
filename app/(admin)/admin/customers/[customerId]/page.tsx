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
};

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

export default async function AdminCustomerDetailPage({ params }: PageProps) {
  const prisma = getPrismaClient();
  const { customerId } = await params;

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
