-- Drop targetMarginPct from PricingMaterialCost (replaced by quantity-based markup tiers)
ALTER TABLE "PricingMaterialCost" DROP COLUMN IF EXISTS "targetMarginPct";

-- Add digital printing cost fields to PricingSettings
ALTER TABLE "PricingSettings" ADD COLUMN IF NOT EXISTS "digitalCostPerUnitNet" DECIMAL(10,4) NOT NULL DEFAULT 0.10;
ALTER TABLE "PricingSettings" ADD COLUMN IF NOT EXISTS "digitalSetupCostNet" DECIMAL(10,2) NOT NULL DEFAULT 40;

-- Add quantity-based markup tier fields to PricingSettings
ALTER TABLE "PricingSettings" ADD COLUMN IF NOT EXISTS "markupTier1Multiplier" DECIMAL(5,2) NOT NULL DEFAULT 1.80;
ALTER TABLE "PricingSettings" ADD COLUMN IF NOT EXISTS "markupTier1MaxQty" INT NOT NULL DEFAULT 5000;
ALTER TABLE "PricingSettings" ADD COLUMN IF NOT EXISTS "markupTier2Multiplier" DECIMAL(5,2) NOT NULL DEFAULT 1.60;
ALTER TABLE "PricingSettings" ADD COLUMN IF NOT EXISTS "markupTier2MaxQty" INT NOT NULL DEFAULT 10000;
ALTER TABLE "PricingSettings" ADD COLUMN IF NOT EXISTS "markupTier3Multiplier" DECIMAL(5,2) NOT NULL DEFAULT 1.50;
