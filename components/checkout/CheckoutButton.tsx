"use client";

import { useTransition } from "react";

type CheckoutButtonProps = {
  packageId: string;
  productSlug: "opake-pp-etiketten" | "transparente-pp-etiketten";
  material: "OPAQUE" | "TRANSPARENT";
  quantity: number;
};

export function CheckoutButton({
  packageId,
  productSlug,
  material,
  quantity,
}: CheckoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="pricing-card__action pricing-card__action--primary"
      onClick={() => {
        startTransition(async () => {
          const response = await fetch("/api/checkout/create-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              packageId,
              productSlug,
              material,
              quantity,
            }),
          });

          const payload = (await response.json().catch(() => null)) as
            | { url?: string; error?: string }
            | null;

          if (!response.ok || !payload?.url) {
            window.alert(
              payload?.error ??
                "Der Checkout ist im Moment nicht verfuegbar. Bitte nutzen Sie das Angebotsformular.",
            );
            return;
          }

          window.location.assign(payload.url);
        });
      }}
      disabled={isPending}
    >
      {isPending ? "Weiterleitung..." : "Zahlungspflichtig bestellen"}
    </button>
  );
}
