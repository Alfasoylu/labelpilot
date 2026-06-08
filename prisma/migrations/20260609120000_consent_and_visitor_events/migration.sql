CREATE TABLE "ConsentRecord" (
  "id" TEXT NOT NULL,
  "visitorId" TEXT,
  "analytics" BOOLEAN NOT NULL DEFAULT false,
  "marketing" BOOLEAN NOT NULL DEFAULT false,
  "policyVersion" TEXT NOT NULL DEFAULT 'v1',
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ConsentRecord_visitorId_idx" ON "ConsentRecord"("visitorId");
CREATE INDEX "ConsentRecord_createdAt_idx" ON "ConsentRecord"("createdAt");

CREATE TABLE "VisitorEvent" (
  "id" TEXT NOT NULL,
  "visitorId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "path" TEXT,
  "referrer" TEXT,
  "utmSource" TEXT,
  "utmMedium" TEXT,
  "utmCampaign" TEXT,
  "country" TEXT,
  "device" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "VisitorEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "VisitorEvent_visitorId_idx" ON "VisitorEvent"("visitorId");
CREATE INDEX "VisitorEvent_eventType_idx" ON "VisitorEvent"("eventType");
CREATE INDEX "VisitorEvent_createdAt_idx" ON "VisitorEvent"("createdAt");
