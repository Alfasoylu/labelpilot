import type { ReactNode } from "react";

type EmptyAction =
  | { label: string; href: string }
  | { label: string; onClick: () => void };

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: EmptyAction;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="account-empty">
      {icon ? <span className="account-empty__icon">{icon}</span> : null}
      <p className="account-empty__title">{title}</p>
      {description ? <p className="account-empty__text">{description}</p> : null}
      {action ? (
        "href" in action ? (
          <a className="cta-button" href={action.href}>
            {action.label}
          </a>
        ) : (
          <button type="button" className="cta-button" onClick={action.onClick}>
            {action.label}
          </button>
        )
      ) : null}
    </div>
  );
}
