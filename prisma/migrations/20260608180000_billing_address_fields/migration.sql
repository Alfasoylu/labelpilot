ALTER TABLE "Customer"
  ADD COLUMN "billingCompanyName" TEXT,
  ADD COLUMN "billingStreet" TEXT,
  ADD COLUMN "billingAddressLine2" TEXT,
  ADD COLUMN "billingPostalCode" TEXT,
  ADD COLUMN "billingCity" TEXT,
  ADD COLUMN "billingCountry" TEXT;

ALTER TABLE "Order"
  ADD COLUMN "billingCompanyName" TEXT,
  ADD COLUMN "billingStreetAddress" TEXT,
  ADD COLUMN "billingAddressLine2" TEXT,
  ADD COLUMN "billingPostalCode" TEXT,
  ADD COLUMN "billingCity" TEXT,
  ADD COLUMN "billingCountry" TEXT;
