"use client";

import { useEffect } from "react";

import { gtagPurchase } from "@/lib/analytics/gtag";

type PurchaseEventProps = {
  transactionId: string;
  value: number;
};

export function PurchaseEvent({ transactionId, value }: PurchaseEventProps) {
  useEffect(() => {
    gtagPurchase({ transactionId, value });
  // Only fire once per mount — intentionally no deps array update
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
