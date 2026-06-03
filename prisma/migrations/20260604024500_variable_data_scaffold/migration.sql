-- CreateTable
CREATE TABLE "DesignVariable" (
    "id" TEXT NOT NULL,
    "storedDesignId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "variableType" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "placeholder" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariableDataBatch" (
    "id" TEXT NOT NULL,
    "storedDesignId" TEXT,
    "orderId" TEXT,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "validRows" INTEGER NOT NULL DEFAULT 0,
    "invalidRows" INTEGER NOT NULL DEFAULT 0,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VariableDataBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariableDataRow" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "rowIndex" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "validationErrors" JSONB,
    "isValid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VariableDataRow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DesignVariable_storedDesignId_key_key" ON "DesignVariable"("storedDesignId", "key");

-- CreateIndex
CREATE INDEX "DesignVariable_storedDesignId_idx" ON "DesignVariable"("storedDesignId");

-- CreateIndex
CREATE INDEX "VariableDataBatch_storedDesignId_idx" ON "VariableDataBatch"("storedDesignId");

-- CreateIndex
CREATE INDEX "VariableDataBatch_orderId_idx" ON "VariableDataBatch"("orderId");

-- CreateIndex
CREATE INDEX "VariableDataBatch_status_idx" ON "VariableDataBatch"("status");

-- CreateIndex
CREATE UNIQUE INDEX "VariableDataRow_batchId_rowIndex_key" ON "VariableDataRow"("batchId", "rowIndex");

-- CreateIndex
CREATE INDEX "VariableDataRow_batchId_idx" ON "VariableDataRow"("batchId");

-- CreateIndex
CREATE INDEX "VariableDataRow_isValid_idx" ON "VariableDataRow"("isValid");

-- AddForeignKey
ALTER TABLE "DesignVariable" ADD CONSTRAINT "DesignVariable_storedDesignId_fkey" FOREIGN KEY ("storedDesignId") REFERENCES "StoredDesign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariableDataBatch" ADD CONSTRAINT "VariableDataBatch_storedDesignId_fkey" FOREIGN KEY ("storedDesignId") REFERENCES "StoredDesign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariableDataBatch" ADD CONSTRAINT "VariableDataBatch_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariableDataRow" ADD CONSTRAINT "VariableDataRow_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "VariableDataBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
