import { randomUUID } from "node:crypto";

export function createOrderNumber() {
  const token = randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `LP-${token}`;
}
