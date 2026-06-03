-- AlterTable
ALTER TABLE "Order"
ADD COLUMN "reorderMode" TEXT,
ADD COLUMN "reorderSourceArtworkVersionId" TEXT,
ADD COLUMN "reorderSourceDesignId" TEXT,
ADD COLUMN "reorderStockDuration" TEXT;

-- CreateIndex
CREATE INDEX "Order_reorderSourceDesignId_idx" ON "Order"("reorderSourceDesignId");

-- CreateIndex
CREATE INDEX "Order_reorderSourceArtworkVersionId_idx" ON "Order"("reorderSourceArtworkVersionId");
