CREATE TABLE "SupportRequest" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "orderId" TEXT,
  "type" TEXT NOT NULL DEFAULT 'GENERAL',
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'OPEN',
  "adminNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SupportRequest_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "SupportRequest"
  ADD CONSTRAINT "SupportRequest_customerId_fkey"
  FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SupportRequest"
  ADD CONSTRAINT "SupportRequest_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "SupportRequest_customerId_idx" ON "SupportRequest"("customerId");
CREATE INDEX "SupportRequest_status_idx" ON "SupportRequest"("status");
