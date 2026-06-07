-- Replace per-unit digital cost model with per-m² model.
-- digitalCostPerM2Net  = all-in cost (material + printing) per m² (default 8 EUR)
-- digitalSellingPricePerM2Net = customer selling price per m² (default 12 EUR)
ALTER TABLE "public"."PricingSettings"
  DROP COLUMN IF EXISTS "digitalCostPerUnitNet",
  DROP COLUMN IF EXISTS "digitalSetupCostNet",
  ADD COLUMN IF NOT EXISTS "digitalCostPerM2Net" DECIMAL(10,4) NOT NULL DEFAULT 8,
  ADD COLUMN IF NOT EXISTS "digitalSellingPricePerM2Net" DECIMAL(10,4) NOT NULL DEFAULT 12;
