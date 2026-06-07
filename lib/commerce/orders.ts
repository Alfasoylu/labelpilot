import { randomUUID } from "node:crypto";

// CHK-003: Use 8 hex chars (16^8 ≈ 4.3 billion combinations) instead of 6 to reduce collision risk.
export function createOrderNumber() {
  const token = randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `LP-${token}`;
}
