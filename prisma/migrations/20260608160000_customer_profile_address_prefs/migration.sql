ALTER TABLE "Customer"
  ADD COLUMN "street" TEXT,
  ADD COLUMN "addressLine2" TEXT,
  ADD COLUMN "postalCode" TEXT,
  ADD COLUMN "city" TEXT,
  ADD COLUMN "country" TEXT,
  ADD COLUMN "vatId" TEXT,
  ADD COLUMN "notificationPrefs" JSONB,
  ADD COLUMN "paymentTermsApproved" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "paymentTermsNetDays" INTEGER;
