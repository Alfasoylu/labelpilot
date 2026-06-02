type FeatureItem = {
  title: string;
  body: string;
};

type FeatureGridProps = {
  items: FeatureItem[];
};

export function FeatureGrid({ items }: FeatureGridProps) {
  return (
    <div className="card-grid">
      {items.map((item) => (
        <article key={item.title} className="feature-card">
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  );
}
