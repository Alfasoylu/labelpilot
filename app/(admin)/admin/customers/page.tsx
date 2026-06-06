import Link from "next/link";

import { formatAdminDate, formatCurrencyFromCents } from "@/lib/admin/orders";
import { getPrismaClient } from "@/lib/db/prisma";
import { getOrderStatusLabel } from "@/lib/orders/artwork";

export const dynamic = "force-dynamic";

type CustomersPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

const PAGE_SIZE = 50;

export default async function AdminCustomersPage({ searchParams }: CustomersPageProps) {
  const prisma = getPrismaClient();
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Kunden sind derzeit nicht verfügbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const where = query
    ? {
        OR: [
          { email: { contains: query, mode: "insensitive" as const } },
          { companyName: { contains: query, mode: "insensitive" as const } },
          { contactName: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      include: {
        _count: { select: { orders: true } },
        orders: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            orderNumber: true,
            createdAt: true,
            amountCents: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.customer.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <section className="section-stack">
      <article className="surface-card">
        <div className="cta-row">
          <h2>Kunden ({total.toLocaleString("de-DE")})</h2>
        </div>
        <form method="get">
          <div className="form-grid">
            <div>
              <label htmlFor="q">Suche (E-Mail, Firma, Name)</label>
              <input id="q" name="q" defaultValue={query} placeholder="max@beispiel.de" />
            </div>
            <div className="inline-actions">
              <button type="submit" className="cta-button">
                Suchen
              </button>
              {query ? (
                <Link href="/admin/customers" className="secondary-link">
                  Zurücksetzen
                </Link>
              ) : null}
            </div>
          </div>
        </form>
      </article>

      <article className="surface-card">
        {customers.length === 0 ? (
          <p className="price-note">Keine Kunden gefunden.</p>
        ) : (
          <div className="section-stack">
            {customers.map((customer) => {
              const lastOrder = customer.orders[0];
              return (
                <div key={customer.id} className="section-card">
                  <div className="two-column">
                    <div>
                      <h3>{customer.companyName ?? customer.email}</h3>
                      {customer.companyName ? (
                        <p className="price-note">{customer.email}</p>
                      ) : null}
                      {customer.contactName ? (
                        <p className="price-note">{customer.contactName}</p>
                      ) : null}
                      {customer.phone ? (
                        <p className="price-note">{customer.phone}</p>
                      ) : null}
                    </div>
                    <div>
                      <p className="price-note">
                        Bestellungen: {customer._count.orders}
                      </p>
                      {lastOrder ? (
                        <>
                          <p className="price-note">
                            Letzte Bestellung: {lastOrder.orderNumber}
                          </p>
                          <p className="price-note">
                            {getOrderStatusLabel(lastOrder.status)} ·{" "}
                            {formatCurrencyFromCents(lastOrder.amountCents)}
                          </p>
                          <p className="price-note">
                            {formatAdminDate(lastOrder.createdAt)}
                          </p>
                        </>
                      ) : (
                        <p className="price-note">Noch keine Bestellungen</p>
                      )}
                    </div>
                  </div>
                  <Link href={`/admin/customers/${customer.id}`} className="secondary-link">
                    Kundendetails öffnen →
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 ? (
          <div className="cta-row" style={{ marginTop: "1.5rem" }}>
            {page > 1 ? (
              <Link
                href={`/admin/customers?q=${encodeURIComponent(query)}&page=${page - 1}`}
                className="secondary-link"
              >
                ← Vorherige
              </Link>
            ) : null}
            <span className="price-note">
              Seite {page} von {totalPages}
            </span>
            {page < totalPages ? (
              <Link
                href={`/admin/customers?q=${encodeURIComponent(query)}&page=${page + 1}`}
                className="secondary-link"
              >
                Nächste →
              </Link>
            ) : null}
          </div>
        ) : null}
      </article>
    </section>
  );
}
