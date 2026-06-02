import Link from "next/link";

type SampleBoxCardProps = {
  title: string;
  body: string;
  href: string;
};

export function SampleBoxCard({
  title,
  body,
  href,
}: SampleBoxCardProps) {
  return (
    <article className="sample-card featured">
      <span className="badge">Qualifizierung statt Giveaway</span>
      <h3>{title}</h3>
      <p>{body}</p>
      <div className="hero-actions">
        <Link href={href} className="secondary-link">
          Musterbox ansehen
        </Link>
      </div>
    </article>
  );
}
