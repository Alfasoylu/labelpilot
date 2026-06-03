ALTER TABLE "QuoteRequest"
ADD COLUMN "source" TEXT;

CREATE INDEX "QuoteRequest_source_idx" ON "QuoteRequest"("source");
