-- AlterTable: add optional upload token expiry column to Order
ALTER TABLE "public"."Order" ADD COLUMN "uploadTokenExpiresAt" TIMESTAMP(3);
