interface SkeletonProps {
  variant?: "text" | "line" | "card" | "badge" | "avatar";
  width?: string;
  height?: string;
  count?: number;
}

export function Skeleton({ variant = "line", width, height, count = 1 }: SkeletonProps) {
  const items = Array.from({ length: count });
  return (
    <>
      {items.map((_, i) => (
        <span
          key={i}
          className={`account-skeleton account-skeleton--${variant}`}
          style={{ width, height }}
          aria-hidden
        />
      ))}
    </>
  );
}

export function SkeletonCard() {
  return (
    <div className="account-skeleton-card" aria-hidden>
      <Skeleton variant="line" width="40%" height="14px" />
      <Skeleton variant="line" width="70%" height="20px" />
      <Skeleton variant="line" width="55%" height="14px" />
      <Skeleton variant="badge" width="120px" height="26px" />
    </div>
  );
}
