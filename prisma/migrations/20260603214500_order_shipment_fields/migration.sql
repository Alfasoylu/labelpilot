ALTER TABLE "public"."Order"
ADD COLUMN "shippingMode" TEXT,
ADD COLUMN "shippingCarrier" TEXT,
ADD COLUMN "trackingNumber" TEXT,
ADD COLUMN "trackingUrl" TEXT,
ADD COLUMN "packageCount" INTEGER,
ADD COLUMN "shipmentWeightKg" DOUBLE PRECISION,
ADD COLUMN "shippedAt" TIMESTAMP(3),
ADD COLUMN "estimatedDeliveryAt" TIMESTAMP(3),
ADD COLUMN "deliveredAt" TIMESTAMP(3),
ADD COLUMN "shipmentNote" TEXT;
