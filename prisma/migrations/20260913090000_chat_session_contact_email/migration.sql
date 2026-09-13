-- Kontaktadresse zur Chat-Sitzung.
--
-- Hintergrund: Am 23.08.2026 kam über den Chat eine echte B2B-Anfrage herein
-- (Eierpappen-Etiketten, Interesse an laufender Zusammenarbeit). Der Chat
-- erfasste keine Kontaktdaten, die Sitzung blieb unbeantwortet und der Kontakt
-- war nicht mehr erreichbar. Beide Spalten sind optional — der Chat funktioniert
-- unverändert weiter, wenn niemand seine Adresse hinterlässt.
ALTER TABLE "chat_sessions" ADD COLUMN IF NOT EXISTS "contact_email" TEXT;
ALTER TABLE "chat_sessions" ADD COLUMN IF NOT EXISTS "contact_name" TEXT;
