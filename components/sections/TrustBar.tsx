type TrustItem = {
  title: string;
  body: string;
};

type TrustBarProps = {
  items: TrustItem[];
};

export function TrustBar({ items }: TrustBarProps) {
  return (
    <section className="trust-shell">
      <div className="trust-grid">
        {items.map((item) => (
          <article key={item.title} className="trust-item">
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
