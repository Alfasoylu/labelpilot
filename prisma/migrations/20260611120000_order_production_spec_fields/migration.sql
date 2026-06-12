-- Wunschformat production spec: persist form, adhesive type, UV varnish and corner radius
-- so paid custom-size orders carry the full spec the customer confirmed.
ALTER TABLE "Order" ADD COLUMN "form" TEXT;
ALTER TABLE "Order" ADD COLUMN "klebertyp" TEXT;
ALTER TABLE "Order" ADD COLUMN "uvLack" TEXT;
ALTER TABLE "Order" ADD COLUMN "cornerRadiusMm" INTEGER;
