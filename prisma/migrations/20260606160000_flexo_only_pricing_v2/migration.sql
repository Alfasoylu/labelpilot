-- Flexo-only pricing model: remove digital print fields,
-- remove per-material plate/flexo print costs,
-- add ink tier and plate-per-color cost to global settings.

-- Remove obsolete columns from PricingMaterialCost
ALTER TABLE "PricingMaterialCost" DROP COLUMN IF EXISTS "digitalPrintCostPerM2";
ALTER TABLE "PricingMaterialCost" DROP COLUMN IF EXISTS "flexoPrintCostPerM2";
ALTER TABLE "PricingMaterialCost" DROP COLUMN IF EXISTS "flexoPlateCost";
ALTER TABLE "PricingMaterialCost" DROP COLUMN IF EXISTS "setupFeeNet";

-- Add new global pricing parameters to PricingSettings
ALTER TABLE "PricingSettings" ADD COLUMN IF NOT EXISTS "platePerColorCostNet"       DECIMAL(10,2) NOT NULL DEFAULT 40;
ALTER TABLE "PricingSettings" ADD COLUMN IF NOT EXISTS "inkCostTier1Net"            DECIMAL(10,2) NOT NULL DEFAULT 100;
ALTER TABLE "PricingSettings" ADD COLUMN IF NOT EXISTS "inkCostTier1MaxQty"         INTEGER       NOT NULL DEFAULT 10000;
ALTER TABLE "PricingSettings" ADD COLUMN IF NOT EXISTS "inkCostTier2Net"            DECIMAL(10,2) NOT NULL DEFAULT 170;
ALTER TABLE "PricingSettings" ADD COLUMN IF NOT EXISTS "inkCostTier2MaxQty"         INTEGER       NOT NULL DEFAULT 20000;
ALTER TABLE "PricingSettings" ADD COLUMN IF NOT EXISTS "inkCostAdditionalPer10kNet" DECIMAL(10,2) NOT NULL DEFAULT 70;
