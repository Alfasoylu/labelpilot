-- Matt finish surcharge: flat net € added after base price, before rounding.
ALTER TABLE "public"."PricingSettings"
  ADD COLUMN IF NOT EXISTS "mattSurchargeNet" DECIMAL(10,2) NOT NULL DEFAULT 0;
