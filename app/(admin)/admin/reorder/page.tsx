import { formatCurrencyFromCents } from "@/lib/admin/orders";
import { getPrismaClient } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

type ReorderPageProps = {
  searchParams: Promise<{ message?: string; error?: string }>;
};

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(d);
}

export default async function AdminReorderPage({ searchParams }: ReorderPageProps) {
  const prisma = getPrismaClient();
  const feedback = await searchParams;

  if (!prisma) {
    return (
      <article className="legal-card">
        <h2>Nachbestellungen sind derzeit nicht verfügbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const [predictions, reminders] = await Promise.all([
    prisma.refillPrediction.findMany({
      where: { isEnabled: true },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            customerEmail: true,
            quantity: true,
            amountCents: true,
            material: true,
          },
        },
      },
      orderBy: { predictedDepletionAt: "asc" },
      take: 50,
    }),
    prisma.reorderReminder.findMany({
      where: { status: { in: ["PENDING", "SENT"] } },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            customerEmail: true,
            quantity: true,
            amountCents: true,
          },
        },
      },
      orderBy: { scheduledFor: "asc" },
      take: 50,
    }),
  ]);

  return (
    <section className="section-stack">
      <article className="surface-card">
        <h2>Nachbestellungs-Management</h2>
        <p className="price-note">
          {predictions.length} aktive Predictions · {reminders.length} offene Erinnerungen
        </p>
        {feedback.message ? (
          <p className="form-status success">{feedback.message}</p>
        ) : null}
        {feedback.error ? (
          <p className="form-status error">{feedback.error}</p>
        ) : null}
      </article>

      <article className="surface-card">
        <h2>Nachbestellungs-Prognosen</h2>
        <p className="field-hint">
          Bestellungen, bei denen ein voraussichtliches Aufbrauchsdatum berechnet wurde.
        </p>
        {predictions.length === 0 ? (
          <p className="price-note">Keine aktiven Prognosen.</p>
        ) : (
          <div className="section-stack">
            {predictions.map((pred) => (
              <div key={pred.id} className="section-card">
                <div className="two-column">
                  <div>
                    <div className="admin-order-heading">
                      <h3>{pred.order.orderNumber}</h3>
                      <span className="price-note" style={{ fontSize: "0.82rem" }}>
                        Aufbrauch: {formatDate(pred.predictedDepletionAt)}
                      </span>
                    </div>
                    <p className="price-note">
                      {pred.order.customerEmail} ·{" "}
                      {pred.order.quantity.toLocaleString("de-DE")} Stück ·{" "}
                      {formatCurrencyFromCents(pred.order.amountCents)}
                    </p>
                    <p className="price-note">
                      Lagerdauer: {pred.reorderStockDuration}
                      {pred.reminderWindowDays
                        ? ` · Erinnerungsfenster: ${pred.reminderWindowDays} Tage`
                        : ""}
                    </p>
                  </div>
                  <div>
                    <p className="price-note">
                      {pred.reminderEligibleAt
                        ? `Erinnerung ab: ${formatDate(pred.reminderEligibleAt)}`
                        : "Kein Erinnerungsdatum"}
                    </p>
                  </div>
                </div>

                <details style={{ marginTop: "12px" }}>
                  <summary className="secondary-link" style={{ cursor: "pointer" }}>
                    Erinnerung erstellen
                  </summary>
                  <form
                    action="/api/admin/reorder/reminders"
                    method="post"
                    className="form-grid"
                    style={{ marginTop: "12px" }}
                  >
                    <input type="hidden" name="orderId" value={pred.orderId} />
                    <input type="hidden" name="refillPredictionId" value={pred.id} />
                    <input
                      type="hidden"
                      name="redirectTo"
                      value="/admin/reorder?message=Erinnerung+erstellt"
                    />
                    <div>
                      <label htmlFor={`sched-${pred.id}`}>Geplant für</label>
                      <input
                        id={`sched-${pred.id}`}
                        name="scheduledFor"
                        type="datetime-local"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`channel-${pred.id}`}>Kanal</label>
                      <select id={`channel-${pred.id}`} name="channel" defaultValue="EMAIL">
                        <option value="EMAIL">E-Mail</option>
                        <option value="MANUAL">Manuell</option>
                      </select>
                    </div>
                    <div className="inline-actions">
                      <button type="submit" className="cta-button" style={{ fontSize: "0.88rem" }}>
                        Erinnerung planen
                      </button>
                    </div>
                  </form>
                </details>
              </div>
            ))}
          </div>
        )}
      </article>

      <article className="surface-card">
        <h2>Offene Erinnerungen</h2>
        {reminders.length === 0 ? (
          <p className="price-note">Keine offenen Erinnerungen.</p>
        ) : (
          <div className="section-stack">
            {reminders.map((rem) => (
              <div key={rem.id} className="section-card">
                <div className="two-column">
                  <div>
                    <div className="admin-order-heading">
                      <h3>{rem.order.orderNumber}</h3>
                      <span
                        className="price-note"
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          color: rem.status === "SENT" ? "var(--success)" : undefined,
                        }}
                      >
                        {rem.status === "SENT" ? "Gesendet" : "Ausstehend"}
                      </span>
                    </div>
                    <p className="price-note">
                      {rem.order.customerEmail} · Kanal: {rem.channel}
                    </p>
                    <p className="price-note">
                      Geplant: {formatDate(rem.scheduledFor)}
                      {rem.sentAt ? ` · Gesendet: ${formatDate(rem.sentAt)}` : ""}
                    </p>
                  </div>
                  <div>
                    <p className="price-note">
                      {rem.order.quantity.toLocaleString("de-DE")} Stück ·{" "}
                      {formatCurrencyFromCents(rem.order.amountCents)}
                    </p>
                  </div>
                </div>
                <div className="cta-row" style={{ marginTop: "10px" }}>
                  {rem.status === "PENDING" ? (
                    <form
                      action={`/api/admin/reorder/reminders/${rem.id}`}
                      method="post"
                    >
                      <input type="hidden" name="_method" value="PATCH" />
                      <input type="hidden" name="status" value="SENT" />
                      <button
                        type="submit"
                        className="cta-button"
                        style={{ fontSize: "0.88rem" }}
                      >
                        Als gesendet markieren
                      </button>
                    </form>
                  ) : null}
                  <form
                    action={`/api/admin/reorder/reminders/${rem.id}`}
                    method="post"
                  >
                    <input type="hidden" name="_method" value="PATCH" />
                    <input type="hidden" name="status" value="DISMISSED" />
                    <button
                      type="submit"
                      className="secondary-link"
                      style={{ fontSize: "0.88rem" }}
                    >
                      Als erledigt markieren
                    </button>
                  </form>
                  <a
                    href={`/admin/orders/${rem.orderId}`}
                    className="secondary-link"
                    style={{ fontSize: "0.88rem" }}
                  >
                    Auftrag öffnen →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
