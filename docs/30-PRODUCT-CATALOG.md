# 30-PRODUCT-CATALOG.md

# Labelpilot.de — Produktkatalog

## 1. Zweck dieses Dokuments

Dieses Dokument definiert den MVP-Produktkatalog für **Labelpilot.de**.

Labelpilot.de ist eine auf Deutschland ausgerichtete B2B-Plattform für individuell bedruckte PP-Rollenetiketten und Thermoetiketten.

Dieses Dokument ist die verbindliche Quelle für Codex bei der Umsetzung von:

- Produktkatalog
- Produktseiten
- Produkt-Slugs
- Produktkonfiguration
- Mengenpakete
- Cross-Selling-Regeln
- Nachbestellbarkeit
- Angebotsgrenzen
- SEO-Metadaten
- Produktschema-Daten

Codex darf keine zusätzlichen Produktkategorien erfinden, solange dieses Dokument nicht aktualisiert wurde.

---

## 2. Sprachregel

Die Kundenseite von Labelpilot.de wird im MVP vollständig auf **Deutsch** umgesetzt.

Das bedeutet:

- Produktnamen auf der Website sind Deutsch.
- CTA-Texte sind Deutsch.
- Fehlermeldungen sind Deutsch.
- Checkout-Hinweise sind Deutsch.
- SEO-Titel und Meta-Beschreibungen sind Deutsch.
- FAQ-Inhalte sind Deutsch.
- Rechtliche Hinweise sind Deutsch.
- Admin-interne technische Feldnamen dürfen Englisch bleiben.
- Code-Variablen, IDs und interne Slugs dürfen Englisch oder technisch sein.

Nicht erlaubt:

- Englische Produktseiten im MVP
- Gemischte deutsche/englische Kundenkommunikation
- Englische CTA-Texte auf öffentlichen Seiten
- Englische Fehlermeldungen für Kunden

Beispiel:

```txt
Richtig: Jetzt konfigurieren
Falsch: Configure now
```

---

## 3. Strategisches Produkturteil

Der Produktkatalog muss eng bleiben.

Labelpilot.de darf nicht als allgemeine Online-Druckerei starten.

Der richtige MVP-Katalog ist:

> Individuell bedruckte PP-Rollenetiketten als Hauptkategorie — `100×200 mm` als Fixpreis-Standardpaket (Schnell-Checkout-Anker) plus Wunschformat/Sondermaß als konfigurierbarer Größenpfad auf denselben PP-Produkten (SoT #16; `04 §29`) — ergänzt durch Thermoetiketten als Cross-Sell.

Der falsche MVP-Katalog ist:

> Aufkleber, Visitenkarten, Flyer, Broschüren, Einladungskarten, Poster, Anhänger und zufällige Druckprodukte.

Fokus bringt bessere Conversion, klarere SEO-Signale, einfachere Abläufe und höhere Wiederbestellungswerte.

---

## 4. Marke und Domain

Finaler Projektname:

```txt
Labelpilot.de
```

Finale Ziel-Domain:

```txt
labelpilot.de
```

Kundenseitige Schreibweise:

```txt
Labelpilot.de
```

Nicht verwenden:

```txt
LabelHub Germany
Label Pilot
LabelPilot
Labelpilot
```

---

## 5. MVP-Produktkategorien

Der MVP hat nur zwei Produktkategorien.

```txt
1. PP-Produktetiketten
2. Thermoetiketten
```

### 5.1 Hauptkategorie

```txt
PP-Produktetiketten
```

Das ist die Hauptumsatz- und Hauptgewinnkategorie.

### 5.2 Cross-Sell-Kategorie

```txt
Thermoetiketten
```

Diese Kategorie erhöht Warenkorbwert, Kundenbindung und Wiederbestellungen.

Thermoetiketten dürfen nicht die Hauptpositionierung der Website übernehmen.

---

## 6. MVP-Produktliste

### 6.1 Hauptprodukte

| Produkt-ID | Kundenseitiger Produktname | Größe | Material | Rolle |
|---|---|---:|---|---|
| `pp-opaque-100x200` | Opake PP-Rollenetiketten 100×200 mm | 100×200 mm | Opakes PP | Hauptprodukt |
| `pp-transparent-100x200` | Transparente PP-Rollenetiketten 100×200 mm | 100×200 mm | Transparentes PP | Hauptprodukt |

#### 6.1a Größenpfade pro PP-Produkt (SoT #16; `04 §29`)

Jedes der beiden PP-Hauptprodukte hat **zwei Größenpfade** — Wunschformat ist **kein neues Basis-SKU**, sondern ein konfigurierbarer Größenpfad auf demselben Produkt:

| Größenpfad | Verhalten | Preislogik |
|---|---|---|
| **Standardgröße 100×200 mm** | Standard / Schnell-Checkout-Anker | Fixpreis-Pakete `1.000 / 2.000 / 5.000 / 10.000` zu den kanonischen Netto-/Brutto-Preisen (unverändert); `20.000+` → Angebot |
| **Wunschformat / Sondermaß** | Breite × Höhe frei eingebbar | Flächenbasierte m²-Berechnung (`04 §29`) **nur** wenn `NEXT_PUBLIC_FEATURE_CUSTOM_SIZE` aktiv **und** die Kostenparameter in Admin `§30A` validiert + gesperrt sind; sonst → *„Individuelles Angebot anfordern"* |

**Angebots-Fallback (immer quote-only):** Weißunterdruck auf transparentem Material, Konturschnitt/Sonderform mit neuem Werkzeug, Sonderklebstoffe, Laminierung/Lack, Folie/Metallic, variable Daten (Lot/SKT), Mehr-SKU-Sets, extreme Größen außerhalb der Grenzwerte und `20.000+` laufen über das Angebot — nie als Self-Serve. Interne Kostenparameter und die gewählte Druckmethode werden dem Kunden **nie** angezeigt.

### 6.2 Cross-Sell-Produkte

| Produkt-ID | Kundenseitiger Produktname | Größe | Material | Rolle |
|---|---|---:|---|---|
| `thermal-eco-100x100` | Thermoetiketten 100×100 mm | 100×100 mm | Eco-Thermo | Cross-Sell |
| `thermal-shipping-100x150` | Thermo-Versandetiketten 100×150 mm | 100×150 mm | Thermo | Cross-Sell |

### 6.3 Vertriebsunterstützende Produkte

| Produkt-ID | Kundenseitiger Produktname | Rolle |
|---|---|---|
| `sample-box` | Labelpilot Musterbox | Vertrauensaufbau / Lead-Konversion |
| `custom-quote` | Individuelles B2B-Angebot | Großmengen / Sonderanfragen |
| `reorder` | Etiketten nachbestellen | Kundenbindung / Wiederbestellung |

---

## 7. Im MVP nicht erlaubte Produkte

Codex darf folgende Produkte nicht in den MVP aufnehmen:

```txt
Visitenkarten
Flyer
Broschüren
Poster
Einladungskarten
Hochzeitseinladungen
generische Sticker
Dankeskarten
Hangtags
Textiletiketten
Speisekarten
Kataloge
Booklets
Verpackungsboxen
Papiertüten
Geschenkkarten
```

Grund:

Diese Produkte schwächen die Positionierung, erzeugen niedrige Margen, lenken SEO ab und verringern den Fokus auf wiederkehrende B2B-Etikettenbestellungen.

---

## 8. Hauptprodukt: Opake PP-Rollenetiketten 100×200 mm

### 8.1 Produktidentität

```txt
Produkt-ID: pp-opaque-100x200
Produkt-Slug: pp-etiketten-100x200
Kundenseitiger Titel: Opake PP-Rollenetiketten 100×200 mm
Kategorie: PP-Produktetiketten
Rolle: Hauptprodukt
```

### 8.2 Einsatzbereiche

Geeignet für:

- Lebensmittelverpackungen
- Supplement-Dosen
- Kaffee-Beutel
- Gewürzverpackungen
- Honig- und Marmeladengläser
- Produktboxen
- Flache Beutelverpackungen
- Verpackungen mit stark deckendem Etikettendesign

### 8.3 Zielkunden

Primär:

```txt
Deutsche Lebensmittel-, Getränke- und Supplement-Mikromarken
```

Sekundär:

```txt
Kaffeeröstereien
Gewürzmarken
Honig- und Marmeladenhersteller
D2C-Produktmarken
```

### 8.4 Produktspezifikation

| Feld | Wert |
|---|---|
| Größe | 100×200 mm |
| Material | Opakes PP |
| Druck | Individuell bedruckt |
| Format | Rollenetikett |
| Druckdaten | Upload oder später senden |
| Proof / Freigabe | Unterstützt |
| Nachbestellung | Unterstützt |
| Hauptpaket | 5.000 Etiketten |
| Produktion | Türkei |
| Zielmarkt | Deutschland |
| Kundensprache | Deutsch |

### 8.5 Produktionskosten-Annahme

| Kostenart | Wert |
|---|---:|
| Produktionskosten pro Stück | 0,020 € |
| 1.000 Stück | 20 € |
| 5.000 Stück | 100 € |
| 10.000 Stück | 200 € |

Diese Kosten sind Arbeitsannahmen.

Die endgültige Preislogik steht in:

```txt
/docs/04-PRICING-AND-MARGIN-MODEL.md
```

### 8.6 Pakete

Die kanonische Preis- und Mengenlogik liegt in:

```txt
/docs/04-PRICING-AND-MARGIN-MODEL.md
```

Für dieses Produkt gelten kommerziell diese Paketstufen:

| Paket | Menge | Rolle |
|---|---:|---|
| Starter | 1.000 Stück | Einstieg / Testbestellung |
| Reorder Ready | 2.000 Stück | Nachbestellfreundliche Standardmenge |
| Growth | 5.000 Stück | Hauptpaket |
| Pro | 10.000 Stück | Skalierung |
| Business | 20.000+ Stück | B2B-Großmenge / Angebot |

### 8.7 Nachbestellbarkeit

Dieses Produkt ist nachbestellbar.

Bei einer Nachbestellung sollen übernommen werden:

- Produkt
- Material
- Größe
- Druckdatei
- Proof-Datei
- Menge
- Produktionshinweise
- Kundennotizen

Der Kunde darf die Menge ändern.

Kleine Textänderungen können eine erneute technische Prüfung oder einen neuen Proof erfordern.

---

## 9. Hauptprodukt: Transparente PP-Rollenetiketten 100×200 mm

### 9.1 Produktidentität

```txt
Produkt-ID: pp-transparent-100x200
Produkt-Slug: transparente-pp-etiketten-100x200
Kundenseitiger Titel: Transparente PP-Rollenetiketten 100×200 mm
Kategorie: PP-Produktetiketten
Rolle: Hauptprodukt
```

### 9.2 Einsatzbereiche

Geeignet für:

- Getränkeflaschen
- Glasverpackungen
- Premium-Lebensmittelverpackungen
- Transparente Behälter
- Supplement-Flaschen
- Hochwertige Produktverpackungen
- Produkte, bei denen der Verpackungsinhalt sichtbar bleiben soll

> **Hinweis (SoT #20-i):** Weißunterdruck (Deckweiß) auf transparentem Material ist **quote-only** und **kein Self-Serve-Checkout-Add-on** (siehe §15.0 und `04 §28.2`).

### 9.3 Zielkunden

Primär:

```txt
Deutsche Getränke-, Glas-, Flaschen- und Premium-Verpackungsmarken
```

Sekundär:

```txt
Supplement-Marken
Honig- und Marmeladenhersteller
Saucenmarken
Premium-D2C-Lebensmittelmarken
```

### 9.4 Produktspezifikation

| Feld | Wert |
|---|---|
| Größe | 100×200 mm |
| Material | Transparentes PP |
| Druck | Individuell bedruckt |
| Format | Rollenetikett |
| Druckdaten | Upload oder später senden |
| Proof / Freigabe | Unterstützt |
| Nachbestellung | Unterstützt |
| Hauptpaket | 5.000 Etiketten |
| Produktion | Türkei |
| Zielmarkt | Deutschland |
| Kundensprache | Deutsch |

### 9.5 Produktionskosten-Annahme

Initiale Arbeitsannahme:

| Kostenart | Wert |
|---|---:|
| Produktionskosten pro Stück | 0,020 € |
| 1.000 Stück | 20 € |
| 5.000 Stück | 100 € |
| 10.000 Stück | 200 € |

Wenn transparente PP-Etiketten später andere Kosten haben, müssen Preislogik und Produktkonfiguration aktualisiert werden.

### 9.6 Pakete

Die kanonische Preis- und Mengenlogik liegt in:

```txt
/docs/04-PRICING-AND-MARGIN-MODEL.md
```

Für dieses Produkt gelten kommerziell diese Paketstufen:

| Paket | Menge | Rolle |
|---|---:|---|
| Starter | 1.000 Stück | Premium-Einstieg / Testbestellung |
| Reorder Ready | 2.000 Stück | Premium-Nachbestellpfad |
| Growth | 5.000 Stück | Hauptpaket |
| Pro | 10.000 Stück | Skalierung |
| Business | 20.000+ Stück | B2B-Großmenge / Angebot |

### 9.7 Nachbestellbarkeit

Dieses Produkt ist nachbestellbar.

Transparente Etiketten brauchen im Zweifel stärkere Proof-Prüfung, weil das Ergebnis vom Hintergrund der Verpackung abhängen kann.

---

## 10. Cross-Sell-Produkt: Thermoetiketten 100×100 mm

### 10.1 Produktidentität

```txt
Produkt-ID: thermal-eco-100x100
Produkt-Slug: thermoetiketten-100x100
Kundenseitiger Titel: Thermoetiketten 100×100 mm
Kategorie: Thermoetiketten
Rolle: Cross-Sell
```

### 10.2 Einsatzbereiche

Geeignet für:

- Interne Logistiketiketten
- Lageretiketten
- Produktkennzeichnung
- Prozessetiketten
- Kleine Versand- oder Handling-Etiketten

### 10.3 Produktspezifikation

| Feld | Wert |
|---|---|
| Größe | 100×100 mm |
| Material | Eco-Thermo |
| Format | Rollenetikett |
| Druckdaten | je nach Anwendung optional |
| Proof / Freigabe | optional |
| Nachbestellung | Unterstützt |
| Rolle | Cross-Sell |
| Produktion | Türkei |
| Zielmarkt | Deutschland |
| Kundensprache | Deutsch |

### 10.4 Produktionskosten-Annahme

| Kostenart | Wert |
|---|---:|
| Produktionskosten pro Stück | 0,012 € |
| 1.000 Stück | 12 € |
| 5.000 Stück | 60 € |
| 10.000 Stück | 120 € |

### 10.5 Produktrolle

Dieses Produkt soll:

- Warenkorbwert erhöhen
- B2B-Kundenbindung verbessern
- Logistikbedarf bestehender Kunden decken
- Wiederbestellungen erzeugen

Es darf nicht als Hauptangebot auf der Startseite dominieren.

---

## 11. Cross-Sell-Produkt: Thermo-Versandetiketten 100×150 mm

### 11.1 Produktidentität

```txt
Produkt-ID: thermal-shipping-100x150
Produkt-Slug: thermo-versandetiketten-100x150
Kundenseitiger Titel: Thermo-Versandetiketten 100×150 mm
Kategorie: Thermoetiketten
Rolle: Cross-Sell
```

### 11.2 Einsatzbereiche

Geeignet für:

- Versandetiketten
- DHL/DPD-ähnliche Logistiketiketten
- Lager- und Versandprozesse
- E-Commerce-Fulfillment

### 11.3 Produktspezifikation

| Feld | Wert |
|---|---|
| Größe | 100×150 mm |
| Material | Thermo |
| Format | Rollenetikett |
| Druckdaten | meistens nicht erforderlich |
| Proof / Freigabe | meistens nicht erforderlich |
| Nachbestellung | Unterstützt |
| Rolle | Cross-Sell |
| Produktion | Türkei |
| Zielmarkt | Deutschland |
| Kundensprache | Deutsch |

### 11.4 Paketstrategie

Thermo-Versandetiketten können verkauft werden als:

1. Add-on beim PP-Etiketten-Checkout
2. Wiederbestellprodukt für B2B-Kunden
3. Angebotsbasiertes Großmengenprodukt
4. Bundle mit PP-Etikettenpaketen

Dieses Produkt darf nicht zum SEO-Hauptprodukt werden.

---

## 12. Vertriebsprodukt: Labelpilot Musterbox

### 12.1 Produktidentität

```txt
Produkt-ID: sample-box
Produkt-Slug: musterbox
Kundenseitiger Titel: Labelpilot Musterbox
Kategorie: Vertriebsunterstützung
Rolle: Vertrauensaufbau / Lead-Konversion
```

### 12.2 Zweck

Die Musterbox reduziert Vertrauenshürden bei deutschen B2B-Käufern.

Sie soll zeigen:

- opakes PP-Muster
- transparentes PP-Muster
- Thermoetiketten-Muster
- Materialgefühl
- Druckqualität
- Rollenetiketten-Finish
- optionale Verpackungsbeispiele

### 12.3 Preisstrategie

Mögliche Modelle:

```txt
Kostenpflichtige Musterbox
Kostenlose Musterbox für qualifizierte B2B-Leads
Musterbox mit Gutschein für die erste Bestellung
```

Empfehlung für MVP:

```txt
Kostenpflichtige oder anfragebasierte Musterbox
```

Nicht zu früh zu viele kostenlose Musterboxen verschicken.

### 12.4 CTA

Kundenseitiger CTA:

```txt
Musterbox anfordern
```

---

## 13. Vertriebsprodukt: Individuelles B2B-Angebot

### 13.1 Produktidentität

```txt
Produkt-ID: custom-quote
Produkt-Slug: angebot-anfordern
Kundenseitiger Titel: Individuelles B2B-Angebot anfordern
Kategorie: Vertriebsunterstützung
Rolle: Großmengen / Sonderanfragen
```

### 13.2 Wann Angebotsfluss genutzt wird

Der Angebotsfluss wird genutzt bei:

- 20.000+ Etiketten
- Sondergrößen
- Sondermaterialien
- Spezialklebstoff
- Sonderveredelungen
- transparenten Jobs mit starkem Weißunterdruck
- Metall-/Folieneffekten
- mehreren SKUs
- mehr als 50 Zeilen variabler Daten
- Kontur- oder Sonderformen
- Express-Anfragen
- regelmäßiger monatlicher Produktion
- Paletten-/Sammelversand
- Deutschland-Hub-Lieferung
- Net-14-Bestellungen oberhalb des Kreditlimits
- komplexeren Druckdaten
- B2B-Verhandlung

### 13.3 Formularfelder

Das Angebotsformular soll erfassen:

```txt
Firmenname
Ansprechpartner
E-Mail
Telefon
Land
Produkttyp
Etikettengröße
Material
Menge
Ziel-Liefertermin
Druckdaten-Upload optional
Notizen
```

---

## 14. Vertriebsprodukt: Etiketten nachbestellen

### 14.1 Produktidentität

```txt
Produkt-ID: reorder
Produkt-Slug: nachbestellen
Kundenseitiger Titel: Etiketten nachbestellen
Kategorie: Kundenbindung
Rolle: Gewinnmotor
```

### 14.2 Zweck

Nachbestellungen sind der langfristige Gewinnmotor.

Der Kunde kann:

- freigegebene Druckdaten wiederverwenden
- Material wiederverwenden
- Größe wiederverwenden
- Produktionsspezifikationen wiederverwenden
- Menge ändern
- kleine Textänderungen anfragen
- schneller kaufen

### 14.3 CTAs

Kundenseitige CTAs:

```txt
Etiketten nachbestellen
Gleiche Druckdatei erneut bestellen
Nachbestellung starten
```

---

## 15. Produktkonfiguration

### 15.0 Self-Serve-Add-ons & Wunschformat (SoT #16, freigegeben 2026-06-03)

Zusätzlich zur Basis-Konfiguration sind folgende Optionen **freigegeben** und **hinter Feature-Flags (standardmäßig aus)** umgesetzt. Es sind **Optionen auf dem bestehenden PP-Produkt — keine neuen Basisprodukte/SKUs** (Abschnitt 7 bleibt unberührt):

- **Checkout-Add-ons** (`NEXT_PUBLIC_FEATURE_ADDONS`): Designservice (€40 netto · €0 ab €2.000 netto Bestellwert oder bei eigenen druckfertigen Daten), physischer Andruck (€10 netto), Express (€9,90 netto), Zusatzdesign (€19 netto je weiteres Design). Serverseitig berechnet, netto + brutto angezeigt. Preislogik: `04 §28`.
- **Wunschformat** (`NEXT_PUBLIC_FEATURE_CUSTOM_SIZE`): flächenbasierte Preisberechnung für individuelle Größen mit Angebots-Fallback oberhalb der Grenzwerte. Logik: `04 §29`, Admin-Kostenscreen: `18 §30A`.

Die festen `100×200`-Pakete bleiben der Standardweg; ihre Basis-Spezifikation und Preise (SoT #15) bleiben unverändert.

**Nicht self-serve (quote-only):** Weißunterdruck / Deckweiß ist **kein** Checkout-Add-on, sondern **quote-only** (Angebot) — ebenso Laminat/Folie, Sonderkleber, variable Daten und Konturschnitt (SoT #20-i; `04 §28.2`).

**Flag-Freigabe-Gate (SoT #20):** Die Checkout-Add-ons und das Matt-Finish-Add-on bleiben **standardmäßig aus**, bis **Founder-Freigabe UND ein erfolgreicher Stripe-TEST-Durchlauf** vorliegen (vorhandene Live-Stripe-Keys aktivieren das Flag nicht automatisch). **Wunschformat** bleibt **aus**, bis der Betreiber echte Kostenparameter in Admin `§30A` validiert und sperrt.

Für PP-Etiketten muss die Konfiguration mindestens enthalten:

```txt
productId
material
size
quantity
artworkUploadStatus
sendFileLater
customerNotes
shippingCountry
companyName
email
```

Kundenseitige Feldlabels müssen Deutsch sein.

Beispiele:

| Internes Feld | Kundenseitiges Label |
|---|---|
| material | Material |
| size | Größe |
| quantity | Stückzahl |
| artworkUploadStatus | Druckdatei |
| sendFileLater | Druckdatei später senden |
| customerNotes | Hinweise zur Bestellung |
| shippingCountry | Lieferland |
| companyName | Firmenname |
| email | E-Mail |

Optionale zukünftige Felder:

```txt
Rollenkern
Wickelrichtung
Etikettenabstand
Finish
Klebstofftyp
Anwendungsoberfläche
Anwendungstemperatur
```

Diese Felder nicht im MVP hinzufügen, wenn sie operativ nicht zwingend sind.

### 15.1 Verbindliche Fixed-Package-Spezifikation für PP 100×200 mm

Für die festen PP-Pakete gilt verbindlich:

| Feld | Wert |
|---|---|
| Material | Opakes PP oder transparentes PP |
| Größe | 100×200 mm (10×20 cm) |
| Form | Rechteck |
| Schnitt | Standardschnitt, kein Konturschnitt |
| Format | Auf Rolle |
| Klebstoff | Permanent |
| Finish | Genau ein Finish: glänzend oder matt |
| Druck | 4/0-farbig CMYK Digitaldruck |
| Designs pro Auftrag | 1 Design / 1 Artwork |
| Variable Daten | Nicht im Fixpreis enthalten |
| Quote-only Trigger | Sondergröße, Sondermaterial, Weißunterdruck auf transparent, mehrere SKUs, Express, Spezialveredelung |
| Core Cross-Sell Future | Thermoetiketten bleiben separates Cross-Sell, kein automatischer Paketbestandteil |

---

## 16. Mengenregeln

### 16.1 PP-Produktetiketten

Erlaubte feste Pakete:

```txt
1.000
2.000
5.000
10.000
```

Angebotsschwelle:

```txt
20.000+
```

Bevorzugtes Paket:

```txt
5.000
```

Logik:

- 1.000 = Einstieg / Testbestellung
- 5.000 = Hauptprodukt
- 10.000 = Skalierungsprodukt
- 20.000+ = Angebot

### 16.2 Thermoetiketten

Erlaubte Pakete:

```txt
1.000
2.000
5.000
10.000
```

Angebotsschwelle:

```txt
20.000+
```

Thermoetiketten können später größere wiederkehrende B2B-Bestellungen unterstützen.

---

## 17. Preisquelle

Preise dürfen nicht zufällig in React-Komponenten hartcodiert werden.

Preisquelle muss zentralisiert sein.

Empfohlene Dateien:

```txt
config/products.ts
config/pricing.ts
```

oder später datenbankgestützt.

Produktkonfiguration soll Mengenstaffeln aus `/docs/04-PRICING-AND-MARGIN-MODEL.md` referenzieren.

Produktkonfiguration kann zum Beispiel enthalten:

```ts
{
  id: "pp-opaque-100x200",
  slug: "pp-etiketten-100x200",
  customerTitle: "Opake PP-Rollenetiketten 100×200 mm",
  category: "PP_PRODUCT_LABELS",
  material: "OPAQUE_PP",
  size: "100x200",
  packages: [
    { quantity: 1000, priceKey: "starter", label: "Starter" },
    { quantity: 2000, priceKey: "reorder_ready", label: "Reorder Ready" },
    { quantity: 5000, priceKey: "growth", label: "Growth" },
    { quantity: 10000, priceKey: "pro", label: "Pro" }
  ],
  quoteThreshold: 20000,
  uploadRequired: true,
  reorderEligible: true,
  language: "de"
}
```

---

## 18. Produktseiten-Anforderungen

Jede Produktseite muss enthalten:

1. Deutscher H1
2. Kurze Direktantwort
3. Produktspezifikationstabelle
4. Mengenauswahl
5. Materialerklärung
6. Hinweis zum Druckdaten-Upload
7. Nachbestellvorteil
8. Produktion- und Lieferhinweis
9. CTA für Angebotsanfrage
10. CTA für Musterbox
11. FAQ
12. Verwandte Produkte
13. Schema Markup
14. Pflicht-Hinweis zur regulatorischen Verantwortung, wenn relevant

### 18.1 Im Preis enthalten / nicht enthalten

Für die festen PP-Produktseiten muss zusätzlich ein klarer Block sichtbar sein.

**Im Preis enthalten**

- 100×200 mm (10×20 cm) rechteckiges Rollenetikett
- 1 Design / Artwork pro Auftrag
- genanntes PP-Material
- permanenter Klebstoff
- Rollenformat
- 4/0-farbiger CMYK-Digitaldruck
- keine Einrichtungs- oder Klischeekosten
- ein Finish: glänzend oder matt
- kostenlose Standard-Datenprüfung
- eine Proof-Runde
- Versand nach Deutschland
- Nachbestellung derselben gespeicherten Spezifikation zum gleichen Paketpreis

**Nicht enthalten**

- Weißunterdruck / Deckweiß bei transparentem Material
- Laminierung / Lack
- Folie / Metallic
- variable Daten / Lot- und SKT-Nummerierung
- Kontur- oder Sonderform
- zusätzliche Designs / SKUs
- Express

Für diese ausgeschlossenen Punkte muss die Produktseite sichtbar auf folgenden CTA führen:

```txt
Individuelles B2B-Angebot anfordern
```

---

## 19. CTA-Regeln

Primärer CTA:

```txt
Jetzt konfigurieren
```

Sekundärer CTA:

```txt
Angebot anfordern
```

Dritter CTA:

```txt
Musterbox anfordern
```

Nachbestell-CTA:

```txt
Etiketten nachbestellen
```

Nicht verwenden:

```txt
Configure now
Request quote
Order sample
Reorder labels
```

---

## 20. Cross-Sell-Regeln

### 20.1 PP-Etiketten-Checkout

Beim Checkout für PP-Etiketten:

```txt
Benötigen Sie auch Thermo-Versandetiketten?
```

Angebot:

- Thermoetiketten 100×100 mm
- Thermo-Versandetiketten 100×150 mm

### 20.2 Nachbestellung

Für Wiederbesteller:

```txt
Letzte Bestellung erneut bestellen und Thermoetiketten hinzufügen
```

### 20.3 Musterbox

Auf kommerziellen Landingpages:

```txt
Noch unsicher beim Material? Musterbox anfordern.
```

### 20.4 Angebotsanfrage

Bei 20.000+ Stück:

```txt
Für größere Mengen erhalten Sie ein individuelles B2B-Angebot.
```

---

## 21. SEO-Produktzuordnung

| Produkt | SEO-Seite |
|---|---|
| Opake PP 100×200 | `/de/opake-pp-etiketten` |
| Transparente PP 100×200 | `/de/transparente-pp-etiketten` |
| PP-Rollenetiketten | `/de/pp-rollenetiketten` |
| 100×200 Etiketten | `/de/etiketten-100x200` |
| Thermo 100×100 | `/de/thermoetiketten-100x100` |
| Thermo-Versand 100×150 | `/de/thermo-versandetiketten` |
| Musterbox | `/de/musterbox` |
| Nachbestellen | `/de/nachbestellen` |
| Angebot | `/de/angebot-anfordern` |

---

## 22. Branchenzuordnung

| Branchenseite | Empfohlenes Produkt |
|---|---|
| Lebensmitteletiketten | Opake PP / transparente PP |
| Supplement-Etiketten | Opake PP / transparente PP |
| Getränkeetiketten | Transparente PP |
| Kaffee-Etiketten | Opake PP |
| Gewürz-Etiketten | Opake PP |
| Honig-/Marmeladenetiketten | Transparente PP / opake PP |
| Flaschenetiketten | Transparente PP |
| Glasetiketten | Transparente PP / opake PP |
| Beuteletiketten | Opake PP |

---

## 23. Produktschema-Daten

Jedes Produkt muss schemafähige Daten liefern:

```txt
name
description
brand
category
material
size
sku
offers
availability
url
image
```

Beispiel:

```txt
name: Opake PP-Rollenetiketten 100×200 mm
brand: Labelpilot.de
category: Rollenetiketten
material: Opakes PP
size: 100×200 mm
```

Schema muss mit sichtbarem Seiteninhalt übereinstimmen.

---

## 24. Deutsche Produkttext-Regeln

Die deutsche Kopie muss praktisch, klar und B2B-orientiert sein.

Nicht verwenden:

```txt
Hochwertige Etiketten für jeden Bedarf.
```

Besser:

```txt
Opake PP-Rollenetiketten 100×200 mm für Lebensmittel-, Supplement- und Getränkeverpackungen. Geeignet für Marken, die regelmäßig Produktetiketten bestellen und ihre Druckdaten für spätere Nachbestellungen speichern möchten.
```

Keine rechtliche Konformität versprechen.

---

## 25. Pflicht-Hinweis für regulierte Produktbereiche

Auf Seiten für Lebensmittel, Getränke und Supplemente muss sichtbar stehen:

```txt
Hinweis: Für rechtliche Pflichtangaben, Zutaten, Nährwerte, Allergene, Health Claims und regulatorische Inhalte ist der Kunde verantwortlich. Labelpilot.de übernimmt Druckproduktion, technische Dateiprüfung und Layout-Unterstützung, jedoch keine rechtliche Prüfung.
```

Dieser Hinweis ist verpflichtend.

---

## 26. Produktbilder

MVP benötigt Produktbilder für:

1. Opake PP-Rollenetiketten
2. Transparente PP-Rollenetiketten
3. Thermoetiketten 100×100 mm
4. Thermo-Versandetiketten 100×150 mm
5. Etiketten auf Lebensmittelgläsern
6. Etiketten auf Supplement-Dosen
7. Etiketten auf Flaschen
8. Musterbox
9. Nachbestellprozess

Alt-Texte müssen Deutsch und beschreibend sein.

Beispiele:

```txt
Opake PP-Rollenetiketten 100×200 mm für Lebensmittelverpackungen
Transparente PP-Etiketten auf Glasflaschen
Supplement-Dose mit bedrucktem PP-Etikett
```

---

## 27. MVP-Akzeptanzkriterien für den Katalog

Der Produktkatalog ist akzeptiert, wenn:

1. Nur freigegebene MVP-Produkte existieren.
2. Produktdaten zentralisiert sind.
3. Produktseiten auf Deutsch sind.
4. Produktpakete verfügbar sind.
5. Angebotsschwelle respektiert wird.
6. PP-Etiketten als Hauptprodukt positioniert sind.
7. Thermoetiketten als Cross-Sell positioniert sind.
8. Nachbestellbarkeit für Hauptprodukte existiert.
9. SEO-Metadaten für Produktseiten existieren.
10. Produktschema mit sichtbarem Inhalt übereinstimmt.
11. Pflicht-Hinweis auf sensiblen Seiten sichtbar ist.
12. Keine generischen Druckprodukte hinzugefügt wurden.
13. Keine englischen kundenorientierten Texte im MVP sichtbar sind.

---

## 28. Zukünftige Katalogerweiterung

Zukünftige Produkte dürfen erst nach Validierung ergänzt werden.

Mögliche spätere Produkte:

```txt
Sondergrößen
weitere PP-Etikettengrößen
flaschenspezifische Etiketten
glasspezifische Etiketten
beutelspezifische Etiketten
Sicherheitssiegel
Batch-/MHD-variable Etiketten
Thermoetiketten mit Deutschland-Hub-Lagerung
monatliche B2B-Produktionspläne
```

Erweiterungsregeln:

1. Muss B2B-Wiederbestellungen unterstützen.
2. Muss starke Marge haben.
3. Muss zur deutschen Etikettenpositionierung passen.
4. Darf die Seite nicht zur generischen Druckerei machen.
5. Muss dieses Dokument vor Umsetzung aktualisieren.

---

## 29. Produkt-Kill-Criteria

Ein Produkt wird entfernt oder depriorisiert, wenn:

1. Durchschnittlicher Bestellwert zu niedrig ist.
2. Supportaufwand zu hoch ist.
3. Nachbestellrate schwach ist.
4. Bruttomarge schwach ist.
5. Lieferbeschwerden hoch sind.
6. Produkt falsche Kunden anzieht.
7. Produkt von PP-Etiketten ablenkt.
8. Produkt SEO-Positionierung beschädigt.
9. Produkt operativ zu komplex wird.
10. Produkt überwiegend einmalig gekauft wird.

Thermoetiketten bleiben nur, wenn sie B2B-Kundenbindung oder Warenkorbwert verbessern.

---

## 30. Codex-Umsetzungsregeln

Codex muss:

1. `/docs/00-PROJECT-BRIEF.md` lesen.
2. `/docs/03-PRODUCT-STRATEGY-v2.md` lesen.
3. `/docs/04-PRICING-AND-MARGIN-MODEL.md` lesen.
4. `/docs/20-SEO-STRATEGY-2026.md` lesen.
5. Diesen Produktkatalog befolgen.
6. `Labelpilot.de` als finalen Markennamen verwenden.
7. Keine neuen Produktkategorien erfinden.
8. Keine generischen Druckprodukte hinzufügen.
9. Produktdaten zentralisieren.
10. PP-Etiketten als Hauptprodukt halten.
11. Thermoetiketten als Cross-Sell halten.
12. Nachbestellbarkeit implementieren.
13. Angebotsschwelle implementieren.
14. Kundenseitige Texte auf Deutsch halten.
15. Preislogik serverseitig halten.
16. Im MVP keine englischen kundenseitigen Texte ausgeben.

---

## 31. Finales Produktkatalog-Urteil

Der richtige MVP-Katalog ist:

> Opake und transparente PP-Rollenetiketten 100×200 mm als Hauptprodukte, ergänzt durch Thermoetiketten 100×100 mm und Thermo-Versandetiketten 100×150 mm als B2B-Cross-Sell.

Der falsche MVP-Katalog ist:

> Eine breite Online-Druckerei mit vielen unzusammenhängenden Produkten.

Labelpilot.de muss mit Fokus, Wiederbestellung, B2B-Anwendungsfällen und deutscher Etikettenpositionierung gewinnen.
