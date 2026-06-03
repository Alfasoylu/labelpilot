-- CreateTable
CREATE TABLE "GeneratedPrintFile" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLACEHOLDER_READY',
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'text/csv',
    "rowCount" INTEGER NOT NULL,
    "checksum" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedPrintFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedPrintFile_batchId_key" ON "GeneratedPrintFile"("batchId");

-- CreateIndex
CREATE INDEX "GeneratedPrintFile_status_idx" ON "GeneratedPrintFile"("status");

-- AddForeignKey
ALTER TABLE "GeneratedPrintFile" ADD CONSTRAINT "GeneratedPrintFile_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "VariableDataBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
