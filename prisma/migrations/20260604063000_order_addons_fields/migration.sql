ALTER TABLE "Order"
ADD COLUMN "designServiceCents" INTEGER,
ADD COLUMN "physicalProofCents" INTEGER,
ADD COLUMN "expressCents" INTEGER,
ADD COLUMN "extraDesignCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "extraDesignCents" INTEGER,
ADD COLUMN "addonsTotalCents" INTEGER;
