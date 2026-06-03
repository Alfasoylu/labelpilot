-- CreateTable
CREATE TABLE "PricingMaterialCost" (
    "id" TEXT NOT NULL,
    "materialKey" TEXT NOT NULL,
    "materialCostPerM2" DECIMAL(10,4) NOT NULL,
    "digitalPrintCostPerM2" DECIMAL(10,4) NOT NULL,
    "flexoPrintCostPerM2" DECIMAL(10,4) NOT NULL,
    "flexoPlateCost" DECIMAL(10,2) NOT NULL,
    "wasteFactorPct" DECIMAL(5,2) NOT NULL,
    "targetMarginPct" DECIMAL(5,2) NOT NULL,
    "minOrderValueNet" DECIMAL(10,2) NOT NULL,
    "setupFeeNet" DECIMAL(10,2),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "PricingMaterialCost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "vatPct" DECIMAL(5,2) NOT NULL DEFAULT 19,
    "roundingStepNet" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "customMaxWidthMm" INTEGER NOT NULL,
    "customMaxHeightMm" INTEGER NOT NULL,
    "customMaxQuantity" INTEGER NOT NULL,
    "designServiceNet" DECIMAL(10,2) NOT NULL DEFAULT 40,
    "designServiceFreeThresholdNet" DECIMAL(10,2) NOT NULL DEFAULT 2000,
    "physicalProofNet" DECIMAL(10,2) NOT NULL DEFAULT 10,
    "expressNet" DECIMAL(10,2) NOT NULL DEFAULT 9.9,
    "extraDesignNet" DECIMAL(10,2) NOT NULL DEFAULT 19,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "PricingSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingAudit" (
    "id" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "table" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,

    CONSTRAINT "PricingAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PricingMaterialCost_materialKey_key" ON "PricingMaterialCost"("materialKey");

-- CreateIndex
CREATE INDEX "PricingMaterialCost_updatedAt_idx" ON "PricingMaterialCost"("updatedAt");

-- CreateIndex
CREATE INDEX "PricingSettings_updatedAt_idx" ON "PricingSettings"("updatedAt");

-- CreateIndex
CREATE INDEX "PricingAudit_changedAt_idx" ON "PricingAudit"("changedAt");

-- CreateIndex
CREATE INDEX "PricingAudit_table_idx" ON "PricingAudit"("table");

-- CreateIndex
CREATE INDEX "PricingAudit_field_idx" ON "PricingAudit"("field");
