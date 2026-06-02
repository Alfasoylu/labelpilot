import Link from "next/link";

import { getPrismaClient } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const prisma = getPrismaClient();

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Admin ist derzeit nicht verfuegbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const [reviewCount, proofCount, productionReadyCount] = await Promise.all([
    prisma.order.count({
      where: {
        OR: [{ status: "FILE_REVIEW" }, { status: "CORRECTION_REQUIRED" }],
      },
    }),
    prisma.order.count({
      where: {
        status: "WAITING_CUSTOMER_APPROVAL",
      },
    }),
    prisma.order.count({
      where: {
        status: "APPROVED_FOR_PRODUCTION",
      },
    }),
  ]);

  return (
    <section className="section-stack">
      <article className="surface-card">
        <h2>Aktionen heute</h2>
        <div className="feature-grid">
          <div className="section-card">
            <h3>Dateipruefung</h3>
            <p className="price-note">{reviewCount} Bestellungen offen</p>
            <Link href="/admin/orders?status=review-needed" className="secondary-link">
              Zur Pruefung
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
            <p className="price-note">{productionReadyCount} bereit fuer Produktion</p>
            <Link
              href="/admin/orders?status=APPROVED_FOR_PRODUCTION"
              className="secondary-link"
            >
              Freigaben ansehen
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}
