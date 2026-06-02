type LegalNoticeBoxProps = {
  title?: string;
  body: string;
  tone?: "warning" | "default";
};

export function LegalNoticeBox({
  title = "Hinweis",
  body,
  tone = "warning",
}: LegalNoticeBoxProps) {
  const className =
    tone === "warning"
      ? "notice-card warning legal-notice"
      : "notice-card legal-notice";

  return (
    <div className={className}>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}
