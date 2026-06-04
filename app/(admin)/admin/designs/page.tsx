import Link from "next/link";

import { formatStoredDesignDate } from "@/lib/artwork/saved-designs";
import { getPrismaClient } from "@/lib/db/prisma";
import { getMaterialLabel } from "@/lib/orders/artwork";

export const dynamic = "force-dynamic";

type AdminDesignsPageProps = {
  searchParams: Promise<{
    q?: string;
    product?: string;
    from?: string;
    to?: string;
  }>;
};

function buildWhere(filters: {
  q?: string;
  product?: string;
  from?: string;
  to?: string;
}) {
  const andConditions: Array<Record<string, unknown>> = [{ archivedAt: null }];

  if (filters.q) {
    andConditions.push({
      OR: [
        { name: { contains: filters.q, mode: "insensitive" } },
        { productSlug: { contains: filters.q, mode: "insensitive" } },
        { material: { contains: filters.q, mode: "insensitive" } },
        { lastOrder: { customerEmail: { contains: filters.q, mode: "insensitive" } } },
        { lastOrder: { companyName: { contains: filters.q, mode: "insensitive" } } },
        { lastOrder: { customerName: { contains: filters.q, mode: "insensitive" } } },
      ],
    });
  }

  if (filters.product) {
    andConditions.push({ productSlug: filters.product });
  }

  if (filters.from || filters.to) {
    andConditions.push({
      lastOrderedAt: {
        ...(filters.from ? { gte: new Date(`${filters.from}T00:00:00.000Z`) } : {}),
        ...(filters.to ? { lte: new Date(`${filters.to}T23:59:59.999Z`) } : {}),
      },
    });
  }

  return { AND: andConditions };
}

export default async function AdminDesignsPage({ searchParams }: AdminDesignsPageProps) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Designsuche ist derzeit nicht verfügbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const filters = await searchParams;
  const designs = await prisma.storedDesign.findMany({
    where: buildWhere(filters),
    include: {
      currentArtworkVersion: {
        select: {
          id: true,
          versionLabel: true,
          approvedAt: true,
        },
      },
      lastOrder: {
        select: {
          id: true,
          orderNumber: true,
          customerEmail: true,
          companyName: true,
          customerName: true,
        },
      },
      _count: {
        select: {
          artworkVersions: true,
        },
      },
    },
    orderBy: [{ lastOrderedAt: "desc" }, { updatedAt: "desc" }],
    take: 100,
  });

  return (
    <section className="section-stack">
      <article className="surface-card">
        <h2>Gespeicherte Designs</h2>
        <form className="quote-form" method="get">
          <div className="form-grid">
            <div>
              <label htmlFor="q">Suche</label>
              <input id="q" name="q" defaultValue={filters.q ?? ""} />
            </div>
            <div>
              <label htmlFor="product">Produkt</label>
              <select id="product" name="product" defaultValue={filters.product ?? ""}>
                <option value="">Alle</option>
                <option value="opake-pp-etiketten">Opake PP</option>
                <option value="transparente-pp-etiketten">Transparente PP</option>
              </select>
            </div>
            <div>
              <label htmlFor="from">Von</label>
              <input id="from" name="from" type="date" defaultValue={filters.from ?? ""} />
            </div>
            <div>
              <label htmlFor="to">Bis</label>
              <input id="to" name="to" type="date" defaultValue={filters.to ?? ""} />
            </div>
          </div>
          <div className="inline-actions">
            <button type="submit" className="cta-button">
              Filtern
            </button>
          </div>
        </form>
      </article>

      <article className="surface-card">
        <h2>Treffer</h2>
        {designs.length === 0 ? (
          <p className="price-note">Keine gespeicherten Designs für den aktuellen Filter.</p>
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
                  Kunde: {design.lastOrder?.companyName || design.lastOrder?.customerName || design.lastOrder?.customerEmail || "Nicht zugeordnet"}
                  {" - "}
                  Versionen: {design._count.artworkVersions}
                  {" - "}
                  Letzte Freigabe: {formatStoredDesignDate(design.currentArtworkVersion?.approvedAt ?? null)}
                </p>
                <p className="field-hint">
                  <strong>Reorder-Branches:</strong> Gleiches Artwork möglich - Kleine Anpassung möglich
                </p>
                <div className="cta-row">
                  {design.lastOrder?.id ? (
                    <Link href={`/admin/orders/${design.lastOrder.id}`} className="secondary-link">
                      Letzte Bestellung
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
