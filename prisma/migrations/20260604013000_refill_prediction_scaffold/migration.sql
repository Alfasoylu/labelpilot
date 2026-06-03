-- CreateTable
CREATE TABLE "RefillPrediction" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "sourceDesignId" TEXT,
    "reorderStockDuration" TEXT NOT NULL,
    "predictedDepletionAt" TIMESTAMP(3) NOT NULL,
    "reminderEligibleAt" TIMESTAMP(3),
    "reminderWindowDays" INTEGER NOT NULL DEFAULT 30,
    "algorithmVersion" TEXT NOT NULL DEFAULT 'v1',
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefillPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReorderReminder" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "refillPredictionId" TEXT,
    "channel" TEXT NOT NULL DEFAULT 'EMAIL',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "clickToken" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReorderReminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RefillPrediction_orderId_idx" ON "RefillPrediction"("orderId");

-- CreateIndex
CREATE INDEX "RefillPrediction_sourceDesignId_idx" ON "RefillPrediction"("sourceDesignId");

-- CreateIndex
CREATE INDEX "RefillPrediction_predictedDepletionAt_idx" ON "RefillPrediction"("predictedDepletionAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReorderReminder_clickToken_key" ON "ReorderReminder"("clickToken");

-- CreateIndex
CREATE INDEX "ReorderReminder_orderId_idx" ON "ReorderReminder"("orderId");

-- CreateIndex
CREATE INDEX "ReorderReminder_refillPredictionId_idx" ON "ReorderReminder"("refillPredictionId");

-- CreateIndex
CREATE INDEX "ReorderReminder_scheduledFor_idx" ON "ReorderReminder"("scheduledFor");

-- AddForeignKey
ALTER TABLE "RefillPrediction" ADD CONSTRAINT "RefillPrediction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReorderReminder" ADD CONSTRAINT "ReorderReminder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReorderReminder" ADD CONSTRAINT "ReorderReminder_refillPredictionId_fkey" FOREIGN KEY ("refillPredictionId") REFERENCES "RefillPrediction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
