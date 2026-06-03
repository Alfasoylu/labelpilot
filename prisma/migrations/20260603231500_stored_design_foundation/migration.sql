CREATE TYPE "public"."StoredDesignStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'NEEDS_REVIEW', 'LOCKED');
CREATE TYPE "public"."ArtworkVersionSourceType" AS ENUM ('CUSTOMER_UPLOAD', 'ADMIN_UPLOAD', 'TEMPLATE_GENERATED', 'VARIABLE_DATA_GENERATED', 'REORDER_MINOR_CHANGE');
CREATE TYPE "public"."ArtworkVersionStatus" AS ENUM ('DRAFT', 'UPLOADED', 'UNDER_REVIEW', 'APPROVED', 'REPLACED', 'ARCHIVED', 'REJECTED');

CREATE TABLE "public"."StoredDesign" (
  "id" TEXT NOT NULL,
  "customerId" TEXT,
  "name" TEXT NOT NULL,
  "productSlug" TEXT NOT NULL,
  "labelSize" TEXT,
  "material" TEXT,
  "finishing" TEXT,
  "defaultQuantity" INTEGER,
  "status" "public"."StoredDesignStatus" NOT NULL DEFAULT 'ACTIVE',
  "currentArtworkVersionId" TEXT,
  "currentProofFileId" TEXT,
  "lastOrderedAt" TIMESTAMP(3),
  "lastOrderId" TEXT,
  "totalOrders" INTEGER NOT NULL DEFAULT 0,
  "customerNotes" TEXT,
  "adminProductionNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "archivedAt" TIMESTAMP(3),
  CONSTRAINT "StoredDesign_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."ArtworkVersion" (
  "id" TEXT NOT NULL,
  "storedDesignId" TEXT NOT NULL,
  "versionNumber" INTEGER NOT NULL,
  "versionLabel" TEXT NOT NULL,
  "sourceType" "public"."ArtworkVersionSourceType" NOT NULL,
  "originalArtworkFileId" TEXT,
  "generatedPrintFileId" TEXT,
  "proofFileId" TEXT,
  "status" "public"."ArtworkVersionStatus" NOT NULL DEFAULT 'UPLOADED',
  "changeSummary" TEXT,
  "uploadedByUserId" TEXT,
  "approvedByAdminId" TEXT,
  "approvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ArtworkVersion_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ArtworkVersion_storedDesignId_versionNumber_key" ON "public"."ArtworkVersion"("storedDesignId", "versionNumber");
CREATE INDEX "StoredDesign_customerId_idx" ON "public"."StoredDesign"("customerId");
CREATE INDEX "StoredDesign_productSlug_idx" ON "public"."StoredDesign"("productSlug");
CREATE INDEX "StoredDesign_status_idx" ON "public"."StoredDesign"("status");
CREATE INDEX "StoredDesign_lastOrderedAt_idx" ON "public"."StoredDesign"("lastOrderedAt");
CREATE INDEX "ArtworkVersion_storedDesignId_idx" ON "public"."ArtworkVersion"("storedDesignId");
CREATE INDEX "ArtworkVersion_status_idx" ON "public"."ArtworkVersion"("status");
CREATE INDEX "ArtworkVersion_approvedAt_idx" ON "public"."ArtworkVersion"("approvedAt");

ALTER TABLE "public"."StoredDesign"
ADD CONSTRAINT "StoredDesign_currentArtworkVersionId_fkey"
FOREIGN KEY ("currentArtworkVersionId") REFERENCES "public"."ArtworkVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "public"."StoredDesign"
ADD CONSTRAINT "StoredDesign_currentProofFileId_fkey"
FOREIGN KEY ("currentProofFileId") REFERENCES "public"."ProofFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "public"."StoredDesign"
ADD CONSTRAINT "StoredDesign_lastOrderId_fkey"
FOREIGN KEY ("lastOrderId") REFERENCES "public"."Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "public"."ArtworkVersion"
ADD CONSTRAINT "ArtworkVersion_storedDesignId_fkey"
FOREIGN KEY ("storedDesignId") REFERENCES "public"."StoredDesign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."ArtworkVersion"
ADD CONSTRAINT "ArtworkVersion_proofFileId_fkey"
FOREIGN KEY ("proofFileId") REFERENCES "public"."ProofFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "public"."ArtworkVersion"
ADD CONSTRAINT "ArtworkVersion_originalArtworkFileId_fkey"
FOREIGN KEY ("originalArtworkFileId") REFERENCES "public"."ArtworkFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
