import type { ReactNode } from "react";

import type { StatusTone } from "@/lib/orders/status-style";

interface StatCardBaseProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: StatusTone;
  hint?: string;
  onActivate?: () => void;
}

export function StatCard({ label, value, icon, tone = "neutral", hint, onActivate }: StatCardBaseProps) {
  const className = `account-stat-card account-stat-card--${tone}`;
  const body = (
    <>
      <div className="account-stat-card__head">
        <span className="account-stat-card__label">{label}</span>
        {icon ? <span className="account-stat-card__icon">{icon}</span> : null}
      </div>
      <span className="account-stat-card__value">{value}</span>
      {hint ? <span className="account-stat-card__hint">{hint}</span> : null}
    </>
  );

  if (onActivate) {
    return (
      <button type="button" className={`${className} account-stat-card--button`} onClick={onActivate}>
        {body}
      </button>
    );
  }

  return <div className={className}>{body}</div>;
}
