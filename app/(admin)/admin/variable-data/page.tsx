import Link from "next/link";

import { getPrismaClient } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

type VariableDataAdminPageProps = {
  searchParams: Promise<{
    batchId?: string;
    status?: string;
  }>;
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function AdminVariableDataPage({
  searchParams,
}: VariableDataAdminPageProps) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Variable-Data-Review ist derzeit nicht verfuegbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const filters = await searchParams;
  const batches = await prisma.variableDataBatch.findMany({
    where: filters.status ? { status: filters.status } : undefined,
    include: {
      storedDesign: {
        select: {
          id: true,
          name: true,
        },
      },
      order: {
        select: {
          id: true,
          orderNumber: true,
        },
      },
      _count: {
        select: {
          rows: true,
        },
      },
    },
    orderBy: [{ uploadedAt: "desc" }],
    take: 50,
  });

  const selectedBatch =
    filters.batchId
      ? await prisma.variableDataBatch.findUnique({
          where: { id: filters.batchId },
          include: {
            rows: {
              orderBy: {
                rowIndex: "asc",
              },
              take: 100,
            },
            storedDesign: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        })
      : null;

  return (
    <section className="section-stack">
      <article className="surface-card">
        <h2>Variable Data Batches</h2>
        <form className="quote-form" method="get">
          <div className="form-grid">
            <div>
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={filters.status ?? ""}>
                <option value="">Alle</option>
                <option value="DRAFT">DRAFT</option>
                <option value="REVIEWED">REVIEWED</option>
                <option value="READY">READY</option>
              </select>
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
        <h2>Batches</h2>
        {batches.length === 0 ? (
          <p className="price-note">Noch keine Variable-Data-Batches vorhanden.</p>
        ) : (
          <div className="section-stack">
            {batches.map((batch: (typeof batches)[number]) => (
              <div key={batch.id} className="section-card">
                <h3>{batch.fileName}</h3>
                <p className="price-note">
                  {batch.fileType} - {batch.status} - Upload {formatDate(batch.uploadedAt)}
                </p>
                <p className="field-hint">
                  Design: {batch.storedDesign?.name ?? "Nicht zugeordnet"}
                  {" - "}
                  Auftrag: {batch.order?.orderNumber ?? "Nicht zugeordnet"}
                  {" - "}
                  Zeilen: {batch.totalRows} gesamt / {batch.validRows} valide / {batch.invalidRows} invalide
                </p>
                <div className="cta-row">
                  <Link href={`/admin/variable-data?batchId=${batch.id}`} className="secondary-link">
                    Review oeffnen
                  </Link>
                  {batch.validRows > 0 ? (
                    <a
                      href={`/api/admin/variable-data/batches/${batch.id}/placeholder`}
                      className="secondary-link"
                    >
                      Placeholder herunterladen
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </article>

      {selectedBatch ? (
        <article className="surface-card">
          <h2>Batch-Detail</h2>
          <p className="price-note">
            {selectedBatch.fileName} - {selectedBatch.status} - {selectedBatch.storedDesign?.name ?? "Ohne Design"}
          </p>
          <div className="section-stack">
            {selectedBatch.rows.map((row: (typeof selectedBatch.rows)[number]) => (
              <div key={row.id} className="section-card">
                <h3>Zeile {row.rowIndex}</h3>
                <p className="price-note">{row.isValid ? "Valide" : "Fehlerhaft"}</p>
                <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                  {JSON.stringify(row.payload, null, 2)}
                </pre>
                {row.validationErrors ? (
                  <pre style={{ whiteSpace: "pre-wrap", margin: 0, color: "#B91C1C" }}>
                    {JSON.stringify(row.validationErrors, null, 2)}
                  </pre>
                ) : null}
              </div>
            ))}
          </div>
        </article>
      ) : null}
    </section>
  );
}
