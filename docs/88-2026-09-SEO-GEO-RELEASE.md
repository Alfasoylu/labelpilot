# 88-2026-09-SEO-GEO-RELEASE.md

# Labelpilot.de — SEO/GEO Release, September 2026

**Ausgangslage:** Seit Ende Juni 2026 gab es keine Content- oder SEO-Entwicklung
mehr; die Besucherzahlen blieben niedrig. Dieses Release schließt die größten
Lücken zwischen dem, was das Produkt bereits kann, und dem, was im Index
sichtbar ist.

Grundlage: `73-2026-EXPERT-GEO-SEO-TIPS.md` (Regelwerk) und
`87-SEMRUSH-COMPETITIVE-INTELLIGENCE-2026.md` (Keyword- und Wettbewerbsdaten).

---

## 1. Neue Seiten (7)

Alle Seiten sind deutschsprachig, haben H1, sichtbare Kurzantwort, Tabelle, FAQ,
interne Links, CTA, Canonical und passendes Schema — also den vollständigen
Publishing-Gate aus `73` §35.

| Pfad | Typ | Begründung |
|---|---|---|
| `/de/variable-daten-etiketten` | Service | Moat-Thema aus `73` §23/§37. Der Parser existierte seit Monaten, hatte aber keine Landingpage. |
| `/de/etiketten-mit-lotnummer-skt` | Service | Must-Build aus `73` §37. Häufigster konkreter Anwendungsfall für variable Daten. |
| `/de/tiefkuehl-etiketten` | Produkt | Der Kalkulator bietet seit Längerem „Tiefkühlgeeignet (bis −20 °C)" mit echtem Preisaufschlag — ohne jede Landingpage. Unbesetztes Keyword-Feld. |
| `/de/kosmetik-etiketten` | Branche | `87` Gap 2: Kosmetik-Vertikale ist bei allen Wettbewerbern komplett unbesetzt. |
| `/de/klebeetiketten` | Collection | „klebeetiketten" 3.600/Monat, KD 22 (`87` Tier 2). Informationsgewinn: Klebstoffvarianten, die keine bestehende Seite in der Tiefe behandelt. |
| `/de/papieretiketten` | Produkt | „papieretiketten" 480/Monat, KD 9 (`87` Tier 1). Ehrlich als Anfragefall ausgewiesen — kein Sofortpreis, weil der Kalkulator nur PP kalkuliert. |
| `/de/etiketten-gestalten` | Service | `87` Aktion P9 / Cluster D (~3.600/Monat). Führt zum Kalkulator und zur Druckdatenprüfung. |

**Inhaltliche Grundlage:** Die technischen Angaben stammen aus dem Code, nicht
aus Vermutungen — akzeptierte Spaltennamen und Datumsformate aus
`lib/variable-data/parser.ts`, die Tiefkühloption aus dem Kalkulator, Klebstoff-
und Materialangaben aus den bestehenden Fixpreis-Zeilen in `lib/site-content.ts`.

**Bewusst nicht behauptet:** keine Haftungsgarantie für Tiefkühlanwendungen,
keine rechtliche Prüfung von Pflichtangaben oder INCI, kein Sofortpreis für
Papier, keine ablösbaren Klebstoffe im Standardpreis.

---

## 2. GEO-Strukturarbeit (site-weit)

1. **Echte Kurzantwort statt Meta-Description-Dublette.** `PublicPageData` hat
   jetzt ein `directAnswer`-Feld (2–4 Sätze, `73` §6). Die Kurzantwort-Karte
   zeigte vorher `lead` — also denselben Text wie die Meta-Description.
   Befüllt: 15 kommerzielle Seiten, 8 Ratgeber, 7 neue Seiten.
2. **Freshness-Signale.** `updatedAt` je Seite → sichtbare Zeile „Zuletzt
   aktualisiert am …" mit `<time>`, `datePublished`/`dateModified` im
   Article-Schema und `lastmod` je URL in der Sitemap. Vorher trug jede URL das
   Build-Datum; ein Redeploy setzte das Frische-Signal aller Seiten zurück.
   Ratgeber tragen das Datum der letzten inhaltlichen Überarbeitung (2026-06-30),
   nicht das Deploy-Datum.
3. **Entity-Graph.** Organization und WebSite haben stabile `@id`-Werte und
   werden im Public-Layout auf **jeder** öffentlichen Seite ausgegeben; Article
   (`author`/`publisher`), Service (`provider`) und Product (`manufacturer`)
   referenzieren sie darüber. Vorher existierten die Knoten nur auf `/de`.
   Organization enthält jetzt zusätzlich `legalName`, `address` (echte Adresse
   aus dem Impressum, keine erfundene deutsche), `email`, `telephone` und
   `contactPoint`.
4. **HowTo-Schema ohne unsichtbare Schritte.** `howToSteps` wurden nur auf
   Ratgeberseiten gerendert, das JSON-LD aber auf allen Seitentypen ausgegeben.
   Der Block ist jetzt eine gemeinsame Komponente und läuft auch auf
   Service-Seiten — Schema und sichtbarer Inhalt stimmen wieder überein
   (`73` §13).
5. **Branchenseiten waren technisch dünn.** `IndustryPage` rannte alle Sections
   durch ein `FeatureGrid`, das **nur den ersten Absatz** jeder Section
   ausgegeben hat — alles Weitere stand im Code, aber nie im HTML. Jetzt werden
   die vollständigen Sections gerendert (`73` §28). Betrifft alle acht
   Branchenseiten, nicht nur die neue.
6. **Interne Verlinkung.** Neue Seiten sind über Footer (Produkte, Branchen,
   Service) und über kontextuelle Related-Links von neun bestehenden Seiten
   erreichbar — keine verwaisten Seiten (`73` §17).

---

## 3. Was zu beobachten ist

In der Search Console wöchentlich prüfen (`73` §30/§31):

- Indexierung der 7 neuen URLs (Ziel: alle indexiert innerhalb 4 Wochen).
- Impressionen auf `rollenetiketten`, `klebeetiketten`, `papieretiketten`,
  `etiketten gestalten` — die volumenstärksten neuen Ziele.
- Ob `etiketten-mit-lotnummer-skt` und `variable-daten-etiketten` Anfragen
  erzeugen, nicht nur Impressionen. Diese beiden Seiten sind Moat-Seiten: dort
  zählen Angebotsanfragen, nicht Traffic.
- Manuelle GEO-Stichprobe (`73` §32) mit den Prompts zu Lot/MHD und
  Supplement-Etiketten — dort sollte Labelpilot jetzt erstmals zitierfähig sein.

---

## 4. Bewusst nicht in diesem Release

- **Programmatische Seiten** (`73` §26): erst nach Search-Console-Evidenz für
  die 7 neuen Seiten. Der Cap von 15 ist noch nicht ausgereizt, aber ohne
  Nachfrage-Signal wären es Blindseiten.
- **Template-Library** (`72`): eigenes Produktthema, nicht mit einem
  Content-Release abzudecken.
- **Google Ads** (`87` §7): Budgetentscheidung des Gründers.
- **`scripts/test-autonomous-safety.ts`** schlägt weiterhin fehl — dieser Fehler
  bestand schon vor dem Release und ist in `.github/workflows` bewusst aus der
  CI ausgeklammert („source-text invariant suite that has drifted"). Nicht in
  diesem Release angefasst.
