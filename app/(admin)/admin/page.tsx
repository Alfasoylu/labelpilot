import Link from "next/link";

import { ADMIN_ORDER_ADDONS_OR } from "@/lib/admin/orders";
import { getPrismaClient } from "@/lib/db/prisma";
import { QUOTE_SOURCE_WUNSCHFORMAT } from "@/lib/quotes/source";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const prisma = getPrismaClient();

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Admin ist derzeit nicht verfügbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const [
    reviewCount,
    proofCount,
    productionReadyCount,
    inProductionCount,
    shippedCount,
    addonsOrderCount,
    newLeadCount,
    totalQuoteCount,
    wunschformatQuoteCount,
  ] = await Promise.all([
    prisma.order.count({
      where: {
        OR: [{ status: "FILE_REVIEW" }, { status: "CORRECTION_REQUIRED" }],
      },
    }),
    prisma.order.count({
      where: { status: "WAITING_CUSTOMER_APPROVAL" },
    }),
    prisma.order.count({
      where: { status: "APPROVED_FOR_PRODUCTION" },
    }),
    prisma.order.count({
      where: { status: "IN_PRODUCTION" },
    }),
    prisma.order.count({
      where: { status: "SHIPPED" },
    }),
    prisma.order.count({
      where: {
        OR: [...ADMIN_ORDER_ADDONS_OR],
      },
    }),
    prisma.lead.count({
      where: { status: "NEW" },
    }),
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({
      where: { source: QUOTE_SOURCE_WUNSCHFORMAT },
    }),
  ]);

  return (
    <section className="section-stack">
      <article className="surface-card">
        <h2>Aktionen heute</h2>
        <div className="feature-grid">
          <div className="section-card">
            <h3>Dateiprüfung</h3>
            <p className="price-note">{reviewCount} Bestellungen offen</p>
            <Link href="/admin/orders?status=review-needed" className="secondary-link">
              Zur Prüfung
            </Link>
          </div>
          <div className="section-card">
            <h3>Proof wartet</h3>
            <p className="price-note">{proofCount} Bestellungen offen</p>
            <Link
              href="/admin/orders?status=WAITING_CUSTOMER_APPROVAL"
              className="secondary-link"
            >
              Proofs ansehen
            </Link>
          </div>
          <div className="section-card">
            <h3>Freigegeben</h3>
            <p className="price-note">{productionReadyCount} bereit für Produktion</p>
            <Link
              href="/admin/orders?status=APPROVED_FOR_PRODUCTION"
              className="secondary-link"
            >
              Freigaben ansehen
            </Link>
          </div>
          <div className="section-card">
            <h3>In Produktion</h3>
            <p className="price-note">{inProductionCount} Bestellungen</p>
            <Link href="/admin/production" className="secondary-link">
              Produktionskontrolle
            </Link>
          </div>
          <div className="section-card">
            <h3>Versendet (offen)</h3>
            <p className="price-note">{shippedCount} Bestellungen</p>
            <Link href="/admin/orders?status=SHIPPED" className="secondary-link">
              Versendete ansehen
            </Link>
          </div>
          <div className="section-card">
            <h3>Neue Leads</h3>
            <p className="price-note">{newLeadCount} unbearbeitet</p>
            <Link href="/admin/leads?status=NEW" className="secondary-link">
              Leads ansehen
            </Link>
          </div>
          <div className="section-card">
            <h3>Bestellungen mit Zusatzleistungen</h3>
            <p className="price-note">{addonsOrderCount} Bestellungen</p>
            <Link href="/admin/orders?addons=with" className="secondary-link">
              Mit Zusatzleistungen ansehen
            </Link>
          </div>
          <div className="section-card">
            <h3>Wunschformat-Anfragen</h3>
            <p className="price-note">{wunschformatQuoteCount} Angebotsanfragen</p>
            <p className="field-hint">
              {wunschformatQuoteCount} von {totalQuoteCount} Anfragen
            </p>
            <Link href="/admin/quotes?source=wunschformat" className="secondary-link">
              Wunschformat ansehen
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}
