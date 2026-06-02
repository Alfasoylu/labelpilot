import Stripe from "stripe";

function getRequiredStripeEnv(name: "STRIPE_SECRET_KEY" | "STRIPE_WEBHOOK_SECRET") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} ist nicht gesetzt.`);
  }

  return value;
}

export function getStripeServerClient() {
  return new Stripe(getRequiredStripeEnv("STRIPE_SECRET_KEY"));
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
