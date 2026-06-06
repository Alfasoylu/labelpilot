-- Add shippingMinCostEur column and update heavy threshold default to 10 kg
ALTER TABLE "PricingSettings"
  ADD COLUMN IF NOT EXISTS "shippingMinCostEur" DECIMAL(10, 2) NOT NULL DEFAULT 5;

UPDATE "PricingSettings"
  SET "shippingHeavyThresholdKg" = 10
  WHERE id = 'default';
