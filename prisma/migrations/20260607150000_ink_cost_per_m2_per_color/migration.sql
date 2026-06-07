-- Replace quantity-tier ink cost model with area×color model.
-- boyaMaliyeti = inkCostPerM2PerColor × colorCount × totalAreaM2
ALTER TABLE "public"."PricingSettings"
  DROP COLUMN IF EXISTS "inkCostTier1Net",
  DROP COLUMN IF EXISTS "inkCostTier1MaxQty",
  DROP COLUMN IF EXISTS "inkCostTier2Net",
  DROP COLUMN IF EXISTS "inkCostTier2MaxQty",
  DROP COLUMN IF EXISTS "inkCostAdditionalPer10kNet",
  ADD COLUMN IF NOT EXISTS "inkCostPerM2PerColorNet" DECIMAL(10,4) NOT NULL DEFAULT 0.33;
