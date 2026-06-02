-- CreateEnum
CREATE TYPE "public"."ArtworkFileStatus" AS ENUM ('UPLOADED', 'UNDER_REVIEW', 'APPROVED', 'CORRECTION_REQUIRED');

-- CreateEnum
CREATE TYPE "public"."ArtworkStatus" AS ENUM ('AWAITING_ARTWORK', 'ARTWORK_UPLOADED', 'ARTWORK_APPROVED');

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "artworkStatus" "public"."ArtworkStatus" NOT NULL DEFAULT 'AWAITING_ARTWORK',
ADD COLUMN     "uploadToken" TEXT;

-- Backfill upload tokens for existing orders before enforcing NOT NULL
UPDATE "public"."Order"
SET "uploadToken" = md5(random()::text || clock_timestamp()::text || "id")
WHERE "uploadToken" IS NULL;

-- Enforce token requirement after backfill
ALTER TABLE "public"."Order" ALTER COLUMN "uploadToken" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."ArtworkFile" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "status" "public"."ArtworkFileStatus" NOT NULL DEFAULT 'UPLOADED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArtworkFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ArtworkFile_orderId_idx" ON "public"."ArtworkFile"("orderId");

-- CreateIndex
CREATE INDEX "ArtworkFile_status_idx" ON "public"."ArtworkFile"("status");

-- CreateIndex
CREATE INDEX "ArtworkFile_createdAt_idx" ON "public"."ArtworkFile"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Order_uploadToken_key" ON "public"."Order"("uploadToken");

-- AddForeignKey
ALTER TABLE "public"."ArtworkFile" ADD CONSTRAINT "ArtworkFile_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

