# 89-2026-09-SPAM-SCHUTZ-UND-LEAD-ERFASSUNG.md

# Labelpilot.de — Spam-Schutz, Lead-Erfassung und RLS, September 2026

**Auslöser:** Im Resend-Log stapelten sich Benachrichtigungen an
`kontakt@labelpilot.de`. Die Prüfung der Datenquellen ergab, dass fast alle
davon von einem Bot stammten — und dass die eine echte Anfrage im selben
Zeitraum unbeantwortet geblieben war.

---

## 1. Befund

| Tabelle | Gesamt | Bot | Echt |
|---|---|---|---|
| QuoteRequest | 220 | 218 | 0 (2 eigene Tests, Juni) |
| Lead | 436 | 434 | 0 (2 eigene Tests, Juni) |
| Order | 5 | – | 0 (alle 5 eigene Tests, Juni) |

Alle 434 Bot-Zeilen tragen dieselbe Signatur: Firmenname aus Zufallsbuchstaben
plus „ LLC", Ansprechpartner und Nachricht als Zufallszeichenkette,
Wegwerf-Domain nach dem Muster `https://<zufall>.com`, zehnstellige Telefonnummer
ohne Vorwahl und durchgehend dieselben Formularvorgaben (Deutschland /
Lebensmittel / 100×200 mm / Opakes PP / 5.000 / „Ja, regelmäßig"). Viele
E-Mail-Adressen nutzen den Punkt-Trick bei Gmail
(`d.o.d.u.t.ah.i485@gmail.com`), wodurch dieselbe Mailbox wie viele
verschiedene Adressen aussieht — daher auch die Bounces im Resend-Log.

Spitze der Welle: 23.–30.08.2026 mit 13–32 Anfragen pro Tag, danach abflachend
auf etwa eine pro Tag. Der Angriff lief zum Zeitpunkt der Analyse weiter.

**Die eine echte Anfrage** kam nicht über ein Formular, sondern über den Chat
(23.08.2026, von `/de/musterbox`): Etiketten im Wunschformat für Eierpappen,
Frage nach Materialempfehlung und Musterdrucken, Aussicht auf eine größere
Bestellung, zwei Minuten später Interesse an laufender Zusammenarbeit und
Folgebedarf für Wurstwaren. Die Sitzung blieb unbeantwortet
(`resolved_at IS NULL`), und es gab keinerlei Kontaktdaten: Der Chat erfasste
keine, und die einzige Benachrichtigung lief über Telegram — ohne Spur im
Betriebspostfach. Der Kontakt ist nicht mehr erreichbar.

---

## 2. Maßnahmen

### 2.1 Spam-Schutz für die öffentlichen Formulare

`lib/security/form-spam.ts`, aktiv in `submitQuoteRequest` und
`submitSampleBoxRequest`. Drei Schichten, damit kein einzelnes Signal allein
über eine echte Anfrage entscheidet:

1. **Honeypot** (`homepageUrl`) — bewusst nicht per `display: none` versteckt,
   weil Bots ausgeblendete Felder überspringen; stattdessen außerhalb des
   sichtbaren Bereichs, `aria-hidden`, `tabIndex={-1}`. Ausgefüllt = sofort Bot.
2. **Zeitfalle** — unter 4 Sekunden Ausfüllzeit ist kein Mensch. Ein
   liegengebliebener Tab wird nicht bestraft; das Zeitsignal verfällt dann nur.
3. **Inhalt** — Punktesystem über Zufallszeichenketten (Groß-/Kleinwechsel und
   Vokalanteil), Punkt-Trick in der E-Mail, Wegwerf-Domain und schematische
   Telefonnummer. Schwelle 4, es braucht also immer mindestens zwei unabhängige
   Signale.

Erkannte Anfragen werden verworfen, ohne dass der Absender es merkt: keine
Datenbankzeile, keine E-Mail, aber dieselbe Erfolgsmeldung. Eine Fehlermeldung
würde dem Bot nur verraten, worauf er sich einstellen muss. Jede Ablehnung
landet als `[form-spam]`-Warnung im Server-Log.

**Validierung** (`scripts/test-form-spam.ts`, läuft in CI): Alle 434 Bot-Zeilen
der Produktionsdatenbank werden erkannt. Der schwächste Fall — eine Zeile, deren
Ansprechpartner knapp durch die Zufallserkennung fällt und deren E-Mail keinen
Punkt-Trick nutzt — landet exakt auf der Schwelle und ist als Regressionstest
festgehalten. Sieben echte bzw. realistische deutsche B2B-Anfragen bleiben
unangetastet, darunter zusammengesetzte Wörter ohne Leerzeichen
(„Lebensmittelkennzeichnung"), Abkürzungen („AH Bio GmbH") und Umlaut-Adressen.

> Ein Fehlalarm ist hier teurer als ein durchgelassener Bot: Er verwirft eine
> echte Anfrage lautlos. Deshalb die Schwelle von zwei Signalen und die
> Positivfälle in der Testsuite.

### 2.2 Kontakterfassung im Chat

- `chat_sessions` erhält `contact_email` und `contact_name` (beide optional —
  der Chat funktioniert unverändert, wenn niemand etwas hinterlässt).
- Nach der ersten Nachricht fragt der Chat die E-Mail-Adresse ab, mit Hinweis
  zur Zweckbindung. Im `sessionStorage` liegt nur ein Erledigt-Merker, nie die
  Adresse selbst.
- `/api/chat/message` nimmt jetzt entweder eine Nachricht oder eine
  nachgereichte Kontaktadresse entgegen und benachrichtigt **zusätzlich zum
  Telegram-Kanal** das Betriebspostfach per E-Mail. Damit taucht künftig jede
  Chat-Anfrage auch in `kontakt@labelpilot.de` und im Resend-Log auf.

### 2.3 Bestandsdaten aussortiert (nicht gelöscht)

218 QuoteRequests auf `REJECTED` mit erklärendem `adminNote`, 434 Leads auf
`DISQUALIFIED`. Vorher geprüft: alle betroffenen Zeilen standen unangetastet auf
`NEW` ohne Admin-Notiz, es ging also keine Handarbeit verloren.

Die Standardliste in `/admin/quotes` und `/admin/leads` blendet diese Status
jetzt aus („Alle offenen"). Über den Statusfilter „Abgelehnt" bzw.
„Disqualifiziert" bleiben sie vollständig einsehbar — bewusst kein `DELETE`,
damit die Einstufung reversibel ist.

### 2.4 Row Level Security

`SupportRequest`, `ConsentRecord` und `VisitorEvent` hatten RLS deaktiviert und
waren damit für jeden mit dem anon-Key les- und schreibbar — bei `ConsentRecord`
ein Datenschutzproblem. Alle drei werden ausschließlich serverseitig über Prisma
genutzt; Prisma verbindet sich als Tabelleneigentümer (`postgres`) und ist von
RLS ausgenommen, solange `FORCE ROW LEVEL SECURITY` nicht gesetzt ist. RLS ist
jetzt aktiv, ohne Policy — dasselbe Muster, das `Lead`, `QuoteRequest` und
`Order` bereits nutzen.

Zusätzlich entfernt: die Policy `public read chat_sessions`. Seit der
Kontakterfassung stehen dort E-Mail-Adressen; das Frontend liest die Tabelle
nicht, der Server nutzt den Service-Role-Key.

Nachgeprüft per `set role anon`: `ConsentRecord`, `VisitorEvent`,
`SupportRequest` und `chat_sessions` liefern 0 Zeilen, `chat_messages`
weiterhin alle — Letzteres ist für den Chat notwendig (siehe unten).

---

## 3. Offene Punkte

1. **`chat_messages` ist für jeden mit dem anon-Key vollständig lesbar.** Die
   Policy `public read chat_messages` schränkt nicht auf die eigene Sitzung ein.
   Der Live-Chat liest und abonniert die Tabelle im Browser mit dem anon-Key und
   würde ohne Policy nicht mehr funktionieren, deshalb in diesem Durchgang
   bewusst unverändert. Saubere Lösung: sitzungsgebundenes Token statt blankem
   anon-Key im Chat-Client, dann Policy auf die eigene `session_id`
   einschränken. Bis dahin gilt: keine sensiblen Daten im Chat austauschen.
2. **Chat-Antworten laufen weiterhin nur über Telegram.** Die neue
   E-Mail-Benachrichtigung stellt sicher, dass nichts unbemerkt bleibt, ersetzt
   aber keine Antwortmöglichkeit aus dem Admin-Panel. Ein Chat-Verlauf im
   Admin-Bereich fehlt bislang.
3. **Wirksamkeit beobachten.** Die `[form-spam]`-Warnungen im Vercel-Log zeigen,
   ob die Welle weiterläuft und ob die Erkennung greift. Bleiben neue Zeilen mit
   der bekannten Signatur in der Datenbank, ist die Schwelle zu hoch angesetzt.
4. **Die Anfrage vom 23.08.2026 ist verloren.** Ohne Kontaktdaten gibt es keinen
   Rückweg. Sollte sich „Trentzsch" erneut melden, ist es ein Bestandskontakt mit
   Bedarf an Eierpappen- und Wurstwaren-Etiketten.
