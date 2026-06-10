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
            <p className="trust-item__title">{item.title}</p>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
