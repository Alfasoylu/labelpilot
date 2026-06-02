type SpecTableProps = {
  title: string;
  rows: Array<{
    label: string;
    value: string;
  }>;
};

export function SpecTable({ title, rows }: SpecTableProps) {
  return (
    <section className="table-card spec-shell">
      <h2>{title}</h2>
      <div className="table-wrap">
        <table>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th>{row.label}</th>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
