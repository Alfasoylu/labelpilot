import type { ReactNode } from "react";

import type { StatusTone } from "@/lib/orders/status-style";

interface StatusBadgeProps {
  tone: StatusTone;
  children: ReactNode;
  icon?: ReactNode;
  size?: "sm" | "md";
}

export function StatusBadge({ tone, children, icon, size = "md" }: StatusBadgeProps) {
  return (
    <span className={`account-badge account-badge--${tone}${size === "sm" ? " account-badge--sm" : ""}`}>
      {icon ? <span className="account-badge__icon">{icon}</span> : null}
      {children}
    </span>
  );
}
