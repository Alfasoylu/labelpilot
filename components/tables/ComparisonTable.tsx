type ComparisonTableProps = {
  title: string;
  lead: string;
  columns: string[];
  rows: string[][];
};

export function ComparisonTable({
  title,
  lead,
  columns,
  rows,
}: ComparisonTableProps) {
  return (
    <section className="table-card comparison-shell">
      <h2>{title}</h2>
      <p>{lead}</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join("-")}>
                {row.map((cell) => (
                  <td key={cell}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
