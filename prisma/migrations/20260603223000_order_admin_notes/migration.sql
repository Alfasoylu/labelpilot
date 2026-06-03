CREATE TABLE "public"."OrderAdminNote" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "noteType" TEXT NOT NULL DEFAULT 'INTERNAL',
  "isCustomerVisible" BOOLEAN NOT NULL DEFAULT false,
  "actor" TEXT,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "OrderAdminNote_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "OrderAdminNote_orderId_idx" ON "public"."OrderAdminNote"("orderId");
CREATE INDEX "OrderAdminNote_createdAt_idx" ON "public"."OrderAdminNote"("createdAt");

ALTER TABLE "public"."OrderAdminNote"
ADD CONSTRAINT "OrderAdminNote_orderId_fkey"
FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
