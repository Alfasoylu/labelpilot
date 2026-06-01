# 29-LEGAL-PAGES-GERMANY.md

# Labelpilot.de — Legal Pages Germany

## 1. Purpose

This document defines the legal page structure for **Labelpilot.de**.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

This document does not provide legal advice.

It defines the required legal page routes, content structure, risk boundaries and implementation rules so Codex can create the correct page skeletons.

Final legal text must be reviewed by a qualified legal professional before production launch.

---

## 2. Legal Page Verdict

The correct legal implementation is:

> German legal page skeletons with clear placeholders, no false legal claims, no hidden compliance promises, and explicit responsibility boundaries for custom printed food, beverage and supplement labels.

The wrong implementation is:

> Copy-paste legal text from another website, claim legal label compliance, or publish final legal terms without review.

Legal pages protect conversion and reduce risk, but they must be reviewed before launch.

---

## 3. Required Legal Routes

Required routes:

```txt
/de/impressum
/de/datenschutz
/de/agb
/de/versand
/de/widerruf
```

Recommended additional route:

```txt
/de/reklamation
```

Optional future route:

```txt
/de/b2b-rahmenbedingungen
```

All legal pages must be German.

---

## 4. Required Source Documents

Before implementing legal pages, Codex must read:

```txt
/docs/00-PROJECT-BRIEF.md
/docs/14-AUTH-AND-ACCOUNTS.md
/docs/15-STRIPE-PAYMENT-FLOW.md
/docs/16-ORDER-FLOW.md
/docs/17-FILE-UPLOAD-AND-PROOFING.md
/docs/24-METADATA-MAP.md
/docs/26-SITEMAP-ROBOTS-CANONICAL.md
/docs/29-LEGAL-PAGES-GERMANY.md
```

If there is conflict, stop and report it.

---

## 5. Important Legal Disclaimer for This Document

This document is an implementation guide, not legal advice.

Codex must include placeholder warnings where legal review is required.

Recommended internal placeholder comment:

```txt
TODO: Final legal text must be reviewed by a German/EU e-commerce lawyer before production launch.
```

Do not present placeholder text as final legal compliance.

---

## 6. Language Rule

All legal pages must be German.

Not allowed:

```txt
English legal pages
mixed German/English legal copy
copied foreign legal templates
unreviewed final claims
```

Allowed:

```txt
German placeholders
German headings
German explanatory skeletons
internal developer comments
```

---

## 7. Legal Risk Context

Labelpilot.de sells custom printed labels for regulated product categories:

```txt
Lebensmittel
Getränke
Supplemente / Nahrungsergänzungsmittel
```

Risk:

Customers may assume Labelpilot.de checks legal label content.

Labelpilot.de must clearly state:

```txt
Labelpilot.de prüft Druckdaten technisch, aber nicht rechtlich.
```

The customer is responsible for:

```txt
Pflichtangaben
Zutaten
Nährwerte
Allergene
Health Claims
Produktversprechen
Barcode/GTIN correctness
regulatorische Inhalte
```

---

## 8. Mandatory Responsibility Disclaimer

Use this disclaimer across relevant pages:

```txt
Hinweis: Für rechtliche Pflichtangaben, Zutaten, Nährwerte, Allergene, Health Claims und regulatorische Inhalte ist der Kunde verantwortlich. Labelpilot.de übernimmt Druckproduktion, technische Dateiprüfung und Layout-Unterstützung, jedoch keine rechtliche Prüfung.
```

Required on:

```txt
/de/lebensmittel-etiketten
/de/supplement-etiketten
/de/getraenke-etiketten
/de/druckdaten
/de/angebot-anfordern
/de/agb
```

This wording should not be removed without legal review.

---

## 9. Impressum Page

Route:

```txt
/de/impressum
```

Purpose:

German legal provider identification page.

### Required Sections

```txt
Impressum
Angaben gemäß § 5 TMG / DDG if applicable
Unternehmen
Vertreten durch
Adresse
Kontakt
Registereintrag if applicable
Umsatzsteuer-ID if applicable
Verantwortlich für den Inhalt
Haftung für Inhalte
Haftung für Links
Urheberrecht
```

### Placeholder Skeleton

```txt
# Impressum

Angaben gemäß den gesetzlichen Informationspflichten.

## Anbieter

[Unternehmensname]
[Rechtsform]
[Adresse]
[Land]

## Vertreten durch

[Name der vertretungsberechtigten Person]

## Kontakt

E-Mail: [E-Mail]
Telefon: [Telefon optional]

## Registereintrag

Registergericht: [falls vorhanden]
Registernummer: [falls vorhanden]

## Umsatzsteuer-ID

Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: [falls vorhanden]

## Verantwortlich für den Inhalt

[Name / Adresse]

## Hinweis

Dieses Impressum muss vor Veröffentlichung durch eine qualifizierte Stelle geprüft und vervollständigt werden.
```

Codex must not invent company details.

---

## 10. Datenschutz Page

Route:

```txt
/de/datenschutz
```

Purpose:

Explain data processing.

### Required Sections

```txt
Datenschutzerklärung
Verantwortlicher
Allgemeine Hinweise
Erfassung personenbezogener Daten
Kontaktformulare
Angebotsanfragen
Musterbox-Anfragen
Kundenkonto
Bestellabwicklung
Zahlungsabwicklung via Stripe
Druckdaten / Datei-Uploads
Hosting via Vercel
Datenbank / Supabase
E-Mail via Resend
Analytics if used
Cookies / Consent if used
Betroffenenrechte
Speicherdauer
Datenübermittlung in Drittländer if applicable
SSL/TLS
Kontakt Datenschutz
```

### Key Privacy Points

Labelpilot.de processes:

```txt
company data
contact data
email
phone
shipping data
order data
payment metadata
uploaded artwork files
proof approval data
lead source data
analytics data if enabled
```

Do not claim data is not stored if order/file system stores it.

### Stripe Section

Must explain:

```txt
Zahlungen werden über Stripe verarbeitet.
Labelpilot.de speichert keine vollständigen Kreditkartendaten.
Stripe verarbeitet Zahlungsdaten.
```

### File Upload Section

Must explain:

```txt
Druckdaten und Proof-Dateien werden zur Bearbeitung der Bestellung gespeichert.
Dateien sind nicht öffentlich zugänglich.
```

Final legal text must be reviewed.

---

## 11. AGB Page

Route:

```txt
/de/agb
```

Purpose:

General terms and conditions.

### Required Sections

```txt
Geltungsbereich
Vertragspartner
Leistungsbeschreibung
Angebote und Vertragsschluss
Kundenspezifische Druckprodukte
Druckdaten und technische Prüfung
Keine rechtliche Prüfung von Etiketteninhalten
Proof und Freigabe
Preise und Zahlung
Produktion und Lieferung
Eigentumsvorbehalt if applicable
Reklamation und Nachdruck
Haftung
Urheberrechte / Nutzungsrechte an Druckdaten
B2B/B2C distinction
Schlussbestimmungen
```

### Critical Clause Themes

#### Custom Print Products

Clarify that many orders are customized.

```txt
Die Produkte werden nach Kundenspezifikation hergestellt.
```

#### Customer Responsibility

```txt
Der Kunde ist für Inhalt, Gestaltung, Pflichtangaben und rechtliche Zulässigkeit der Druckdaten verantwortlich.
```

#### Technical Review Only

```txt
Labelpilot.de prüft Druckdaten technisch, jedoch nicht rechtlich.
```

#### Proof Approval

```txt
Nach Freigabe des Proofs durch den Kunden kann die Produktion vorbereitet werden.
```

#### No Production Before Approval

```txt
Die Produktion beginnt erst nach Zahlung beziehungsweise Freigabe und nach erforderlicher technischer Prüfung.
```

Do not publish final AGB without legal review.

---

## 12. Versand Page

Route:

```txt
/de/versand
```

Purpose:

Explain production and shipping.

### Required Sections

```txt
Produktion
Versand nach Deutschland
Versand aus der Türkei
Zukünftiger Deutschland-Hub
Lieferzeiten
Versandkosten
Tracking
Zoll / Einfuhr / IOSS where applicable
Teillieferungen if applicable
Lieferverzögerungen
```

### Required Transparency

Use:

```txt
Labelpilot.de richtet sich an Kunden in Deutschland und nutzt kosteneffiziente Produktion in der Türkei. Bestellungen werden nach Deutschland geliefert. In späteren Wachstumsphasen ist ein Deutschland-Hub für schnellere B2B-Lieferungen vorgesehen.
```

Do not hide Turkey production.

Do not promise unrealistic delivery times.

### Shipping Cost Placeholder

```txt
Versandkosten werden je nach Produkt, Menge, Gewicht und Lieferadresse berechnet oder im Angebot ausgewiesen.
```

---

## 13. Widerruf Page

Route:

```txt
/de/widerruf
```

Purpose:

Explain withdrawal/cancellation rules.

Custom printed goods require careful handling.

### Required Sections

```txt
Widerrufsrecht
Ausnahmen bei kundenspezifischen Produkten
B2B-Bestellungen
Stornierung vor Produktionsbeginn
Stornierung nach Proof-Freigabe
Rücksendungen
Kontakt
```

### Critical Theme

Many Labelpilot.de products are custom-made according to customer artwork/specifications.

The page should clearly explain that cancellation/withdrawal may be limited for custom products, but final wording must be legally reviewed.

### Placeholder Warning

```txt
TODO: Final wording for Widerrufsrecht and custom-made product exception must be reviewed by a qualified German/EU e-commerce lawyer.
```

Do not invent definitive legal wording.

---

## 14. Reklamation Page

Recommended route:

```txt
/de/reklamation
```

Purpose:

Explain complaints, reprints and quality issues.

### Required Sections

```txt
Reklamation melden
Benötigte Informationen
Fotos / Nachweise
Prüfung durch Labelpilot.de
Nachdruck
Teilrückerstattung
Ablehnung bei kundenseitigem Fehler
Proof-Freigabe und Verantwortung
Kontakt
```

### Reprint Reasons

Use internal categories:

```txt
PRINT_ERROR
CUTTING_ERROR
WRONG_MATERIAL
DAMAGED_IN_TRANSIT
CUSTOMER_FILE_ERROR
CUSTOMER_APPROVED_WRONG_PROOF
OTHER
```

Customer-facing categories:

```txt
Druckfehler
Schnittfehler
Falsches Material
Transportschaden
Problem mit Kundendatei
Freigegebener Proof enthielt Fehler
Sonstiges
```

---

## 15. Required Legal Footer Links

Footer must link to:

```txt
Impressum
Datenschutz
AGB
Versand
Widerruf
```

Recommended:

```txt
Reklamation
Kontakt
```

These links must be visible on public pages.

---

## 16. Metadata for Legal Pages

Use metadata from `/docs/24-METADATA-MAP.md`.

Legal pages may be indexable.

Priority low in sitemap.

Example:

```txt
Title: Impressum | Labelpilot.de
Robots: index,follow
```

---

## 17. Sitemap Rules for Legal Pages

Include:

```txt
/de/impressum
/de/datenschutz
/de/agb
/de/versand
/de/widerruf
```

Optional:

```txt
/de/reklamation
```

Priority:

```txt
0.3
```

Change frequency:

```txt
yearly
```

or update when legal pages change.

---

## 18. Checkout Legal Consent

Checkout should include links to:

```txt
AGB
Datenschutzerklärung
Widerruf / Sonderanfertigungen
```

German checkbox example:

```txt
Ich akzeptiere die AGB und habe die Datenschutzerklärung gelesen.
```

For custom print products, consider clear notice:

```txt
Ich nehme zur Kenntnis, dass individuell bedruckte Produkte nach Kundenspezifikation hergestellt werden.
```

Final wording requires legal review.

---

## 19. Quote Form Legal Notice

Quote form should link to privacy policy.

German checkbox:

```txt
Ich habe die Datenschutzerklärung gelesen und stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage verwendet werden.
```

Do not use this checkbox for newsletter consent.

Marketing consent must be separate.

---

## 20. Sample Box Form Legal Notice

Sample box form should include:

```txt
Ich habe die Datenschutzerklärung gelesen und stimme zu, dass meine Angaben zur Bearbeitung meiner Musterbox-Anfrage verwendet werden.
```

If sample box is paid, checkout legal consent also applies.

---

## 21. File Upload Legal Notice

Upload flow must show responsibility disclaimer.

Use:

```txt
Hinweis: Für rechtliche Pflichtangaben, Zutaten, Nährwerte, Allergene, Health Claims und regulatorische Inhalte ist der Kunde verantwortlich. Labelpilot.de übernimmt Druckproduktion, technische Dateiprüfung und Layout-Unterstützung, jedoch keine rechtliche Prüfung.
```

This is critical for food/supplement labels.

---

## 22. Proof Approval Legal Notice

Proof approval screen should include:

```txt
Bitte prüfen Sie den Proof sorgfältig. Nach Ihrer Freigabe kann die Bestellung für die Produktion vorbereitet werden.
```

Approval checkbox:

```txt
Ich habe den Proof geprüft und gebe ihn für die weitere Bearbeitung frei.
```

For regulated labels, also show responsibility note.

---

## 23. GDPR / Consent Notes

Forms should not automatically enroll users in marketing.

Allowed transactional processing:

```txt
quote request handling
sample box handling
order processing
file proofing
payment confirmation
shipment notification
support communication
```

Marketing emails require separate consent.

Do not merge marketing consent into general privacy checkbox.

---

## 24. Legal Claims Not Allowed

Do not write:

```txt
rechtssichere Supplement-Etiketten
EU-konforme Etiketten garantiert
rechtlich geprüfte Lebensmitteletiketten
Health Claims geprüft
wir übernehmen Lebensmittelkennzeichnung
zertifizierte Etikettenprüfung
```

Allowed:

```txt
technische Dateiprüfung
Druckproduktion
Layout-Unterstützung
Proof-Freigabe
Druckdatenprüfung
```

---

## 25. Implementation Requirements

Codex must create page skeletons with:

1. German H1.
2. German sections.
3. Clear TODO legal review note where needed.
4. No invented company details.
5. Footer links.
6. Metadata.
7. Sitemap inclusion.
8. No English visible copy.
9. No final legal guarantee language.
10. No copied legal text from unknown sources.

---

## 26. Legal Page Skeleton Components

Codex may create:

```txt
components/legal/LegalPageLayout.tsx
components/legal/LegalNoticeBox.tsx
components/legal/LegalReviewRequired.tsx
```

Suggested warning box:

```txt
Hinweis: Diese Seite enthält Platzhalter und muss vor Veröffentlichung rechtlich geprüft und vervollständigt werden.
```

For production, remove or replace after legal review.

---

## 27. Acceptance Criteria

Legal page implementation is accepted when:

| Check | Required Result |
|---|---|
| Impressum route exists | PASS |
| Datenschutz route exists | PASS |
| AGB route exists | PASS |
| Versand route exists | PASS |
| Widerruf route exists | PASS |
| Footer links exist | PASS |
| Metadata exists | PASS |
| Sitemap includes legal pages | PASS |
| No invented company details | PASS |
| Legal review TODO visible/internal | PASS |
| Compliance responsibility disclaimer exists | PASS |
| No legal overclaims | PASS |
| German content only | PASS |

---

## 28. Test Checklist

Codex must run available checks:

```txt
npm run lint
npm run typecheck
npm run build
```

Manual checks:

1. Visit `/de/impressum`.
2. Visit `/de/datenschutz`.
3. Visit `/de/agb`.
4. Visit `/de/versand`.
5. Visit `/de/widerruf`.
6. Check footer links.
7. Check metadata.
8. Check no English visible text.
9. Check no invented legal/company info.
10. Check disclaimer on regulated product pages.
11. Check checkout/form legal links if implemented.

---

## 29. Common Mistakes to Avoid

Do not:

1. Copy legal text from another site.
2. Invent company address or registry data.
3. Claim legal compliance service.
4. Forget privacy links on forms.
5. Forget custom product cancellation issue.
6. Hide Turkey production.
7. Use English legal copy.
8. Publish legal placeholder as final.
9. Add newsletter consent without explicit separate checkbox.
10. Leave footer without legal links.
11. Omit Stripe/payment privacy section.
12. Omit file upload/privacy section.

---

## 30. Codex Implementation Rules

Codex must:

1. Create German legal page skeletons.
2. Add review-needed TODOs.
3. Never invent missing company details.
4. Link legal pages in footer.
5. Add metadata and sitemap entries.
6. Add responsibility disclaimer where required.
7. Avoid legal overclaims.
8. Report that final legal review is required.
9. Not represent placeholder content as legally final.

---

## 31. Final Verdict

The correct legal page implementation is:

> German legal skeletons with transparent placeholders, clear responsibility boundaries and required links.

The wrong implementation is:

> Fake final legal compliance.

Labelpilot.de will handle custom printed labels, payments and private artwork files. Legal page quality is operational risk control, not decoration.
