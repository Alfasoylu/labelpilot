type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  tone?: "default" | "soft" | "dark";
  children: React.ReactNode;
};

export function Section({
  id,
  eyebrow,
  title,
  lead,
  tone = "default",
  children,
}: SectionProps) {
  const className =
    tone === "soft" ? "section-shell section-soft" : "section-shell";

  return (
    <section id={id} className={className}>
      {eyebrow || title || lead ? (
        <div className="section-header">
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          {title ? <h2>{title}</h2> : null}
          {lead ? <p>{lead}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
