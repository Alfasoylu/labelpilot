ALTER TABLE "public"."Order"
ADD COLUMN "customerPhone" TEXT,
ADD COLUMN "vatId" TEXT,
ADD COLUMN "streetAddress" TEXT,
ADD COLUMN "addressLine2" TEXT,
ADD COLUMN "postalCode" TEXT,
ADD COLUMN "city" TEXT,
ADD COLUMN "customerNote" TEXT,
ADD COLUMN "artworkInputStatus" TEXT,
ADD COLUMN "selectedAddons" JSONB;
