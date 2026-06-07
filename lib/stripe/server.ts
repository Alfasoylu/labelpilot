import Stripe from "stripe";

function getRequiredStripeEnv(name: "STRIPE_SECRET_KEY" | "STRIPE_WEBHOOK_SECRET") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} ist nicht gesetzt.`);
  }

  return value;
}

export function getStripeServerClient() {
  const key = getRequiredStripeEnv("STRIPE_SECRET_KEY");

  // CHK-008: Catch obviously invalid key formats early (before an API call fails after an order
  // is already created). A valid Stripe secret key must start with sk_live_ or sk_test_.
  if (!key.startsWith("sk_live_") && !key.startsWith("sk_test_")) {
    throw new Error(
      "STRIPE_SECRET_KEY hat ein ungültiges Format. Erwartet: sk_live_... oder sk_test_...",
    );
  }

  return new Stripe(key);
}

export function getStripeWebhookSecret() {
  return getRequiredStripeEnv("STRIPE_WEBHOOK_SECRET");
}

export function getCheckoutBaseUrl() {
  const value = process.env.NEXT_PUBLIC_APP_URL;

  if (!value) {
    throw new Error("NEXT_PUBLIC_APP_URL ist nicht gesetzt.");
  }

  return value.replace(/\/$/, "");
}
