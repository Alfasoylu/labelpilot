ALTER TABLE "PricingMaterialCost" ADD COLUMN "freezerMaterialCostPerM2" DECIMAL(10,4);
ALTER TABLE "Order" ADD COLUMN "tiefkuehlgeeignet" BOOLEAN NOT NULL DEFAULT false;
