import Link from "next/link";

type ProductCardProps = {
  title: string;
  body: string;
  href: string;
  badge?: string;
  featured?: boolean;
};

export function ProductCard({
  title,
  body,
  href,
  badge,
  featured = false,
}: ProductCardProps) {
  return (
    <article className={`product-card ${featured ? "featured" : ""}`}>
      <div className="product-card-header">
        <div>
          {badge ? <span className="badge">{badge}</span> : null}
          <h3>{title}</h3>
        </div>
      </div>
      <p>{body}</p>
      <div className="card-actions">
        <Link href={href} className="card-link">
          Mehr erfahren
        </Link>
      </div>
    </article>
  );
}
