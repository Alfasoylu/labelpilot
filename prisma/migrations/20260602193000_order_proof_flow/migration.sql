-- CreateEnum
CREATE TYPE "public"."ProofFileStatus" AS ENUM (
    'NOT_REQUIRED',
    'PENDING_ADMIN_UPLOAD',
    'WAITING_CUSTOMER_APPROVAL',
    'APPROVED',
    'CHANGES_REQUESTED',
    'SUPERSEDED'
);

-- CreateTable
CREATE TABLE "public"."ProofFile" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "status" "public"."ProofFileStatus" NOT NULL DEFAULT 'PENDING_ADMIN_UPLOAD',
    "customerApprovedAt" TIMESTAMP(3),
    "customerApprovalIp" TEXT,
    "customerChangeRequestNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProofFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProofFile_orderId_idx" ON "public"."ProofFile"("orderId");

-- CreateIndex
CREATE INDEX "ProofFile_status_idx" ON "public"."ProofFile"("status");

-- CreateIndex
CREATE INDEX "ProofFile_createdAt_idx" ON "public"."ProofFile"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."ProofFile" ADD CONSTRAINT "ProofFile_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
