-- 1) chat_sessions: öffentliche Lesepolicy entfernen.
--    Die Tabelle enthält seit der Kontakterfassung (Migration
--    20260913090000) E-Mail-Adresse und Namen von Besuchern. Mit der bisherigen
--    "public read"-Policy hätte jeder mit dem anon-Key diese Daten auslesen
--    können. Das Frontend liest chat_sessions nicht — nur chat_messages —, und
--    der Server arbeitet mit dem Service-Role-Key, der RLS ohnehin umgeht.
DROP POLICY IF EXISTS "public read chat_sessions" ON "public"."chat_sessions";

-- 2) RLS für die drei bislang offenen Tabellen aktivieren.
--    Alle drei werden ausschließlich serverseitig über Prisma geschrieben und
--    gelesen. Prisma verbindet sich als Tabelleneigentümer (postgres) und ist
--    damit von RLS ausgenommen, solange FORCE ROW LEVEL SECURITY nicht gesetzt
--    ist — dasselbe Muster, das Lead, QuoteRequest und Order bereits nutzen.
--    Ohne Policy haben anon und authenticated damit keinen Zugriff mehr.
ALTER TABLE "public"."SupportRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ConsentRecord"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."VisitorEvent"   ENABLE ROW LEVEL SECURITY;

-- OFFEN (bewusst nicht in dieser Migration): chat_messages behält die Policy
-- "public read chat_messages" ohne Einschränkung auf die eigene Sitzung. Der
-- Live-Chat im Browser liest und abonniert diese Tabelle mit dem anon-Key und
-- würde ohne Policy nicht mehr funktionieren. Eine Einschränkung auf die eigene
-- Sitzung erfordert eine Änderung am Chat-Client (sitzungsgebundenes Token
-- statt blankem anon-Key) und ist deshalb eine eigene Aufgabe.
