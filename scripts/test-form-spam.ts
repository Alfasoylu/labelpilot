/**
 * Tests für die Formular-Spam-Erkennung.
 *
 * Die Bot-Fälle sind echte Zeilen aus der Produktionsdatenbank (QuoteRequest,
 * August/September 2026). Die Positivfälle sind echte bzw. realistische
 * deutsche B2B-Anfragen — darunter die Chat-Anfrage vom 23.08.2026, die
 * verloren ging.
 *
 * Ein falsch positives Ergebnis ist hier teurer als ein durchgelassener Bot:
 * Es verwirft eine echte Anfrage lautlos. Deshalb prüft die zweite Hälfte
 * dieser Suite bewusst Grenzfälle (kurze Firmennamen, Abkürzungen,
 * zusammengesetzte deutsche Wörter, Nummern mit Vorwahl).
 */
import assert from "node:assert/strict";

import { evaluateFormSubmission } from "../lib/security/form-spam.ts";

const FRESH_FORM = String(Date.now() - 45_000); // 45 s Ausfüllzeit
let passed = 0;

function check(name: string, condition: boolean, detail?: string) {
  assert.ok(condition, `${name}${detail ? ` — ${detail}` : ""}`);
  passed += 1;
}

// ---------------------------------------------------------------------------
// 1. Echte Bot-Zeilen aus der Datenbank — müssen alle erkannt werden
// ---------------------------------------------------------------------------

const realBotRows = [
  {
    companyName: "Alpktymglt LLC",
    contactName: "gyUcxJZOomJRQzezzaqxAq",
    email: "do.dut.ah.i485@gmail.com",
    phone: "3932817414",
    website: "https://ozjkod.com",
    notes: "BedlsoAPvlDghTnfpbHp",
  },
  {
    companyName: "Hdykvuc LLC",
    contactName: "eLoxTisXzaOqHQfznfIaMIWB",
    email: "elukidej.8.9.2@gmail.com",
    phone: "5959858924",
    website: "https://apoqbi.com",
    notes: "BuuPsJVmxcziKScUlNAxvKcV",
  },
  {
    companyName: "Hcpmdvpow LLC",
    contactName: "EHTrJgEmwirpOFzvL",
    email: "uc.i.to.jabav.e.2.1@gmail.com",
    phone: "3874272271",
    website: "https://uuqveen.com",
    notes: "UDdvzOpFsyaCWIrvjo",
  },
  {
    companyName: "Skjvlttt LLC",
    contactName: "kSsUeOKMTJmfawhznGp",
    email: "i.la.s.u.god.os.i38@gmail.com",
    phone: "4909582821",
    website: "https://dxaxlirsja.com",
    notes: "rjAzIXUlRVlsszeGcLXUylXu",
  },
  {
    // Variante mit echter Fremd-E-Mail (kein Punkt-Trick) — muss trotzdem
    // über die übrigen Signale kippen.
    companyName: "Kdirouc LLC",
    contactName: "ToVreGYhzKjkgbXA",
    email: "klantenservice@ziggo.nl",
    phone: "8296764108",
    website: "https://lwhgbovvgg.com",
    notes: "KAAVWhOEJVuUlzWWfe",
  },
  {
    companyName: "Nttdby LLC",
    contactName: "lranMObUdqYDgmvAL",
    email: "arno@korper.nl",
    phone: "6662715577",
    website: "https://xuflmhn.com",
    notes: "LXJCcHIMBSAhQJbub",
  },
  {
    // Härtester Fall im gesamten Bestand: Als einzige der 434 Bot-Zeilen fällt
    // der Ansprechpartner ("JgaPSLOdiPZupepge": nur 2 Groß-/Kleinwechsel,
    // Vokalanteil 0,35) durch die Zufallserkennung, und die E-Mail nutzt keinen
    // Punkt-Trick. Die Zeile kippt nur noch über Nachricht + Domain + Telefon
    // und landet exakt auf der Schwelle. Wenn diese Prüfung bricht, ist die
    // Erkennung für die schwächsten Bot-Varianten zu locker geworden.
    companyName: "Dgfgqpuf LLC",
    contactName: "JgaPSLOdiPZupepge",
    email: "jessie@redlineasm.com",
    phone: "9033049424",
    website: "https://kkalczjxgssy.com",
    notes: "gfZUQHPLjupradIDv",
  },
];

for (const row of realBotRows) {
  // Selbst mit realistischer Ausfüllzeit und ohne Honeypot-Treffer.
  const verdict = evaluateFormSubmission({ ...row, renderedAt: FRESH_FORM });
  check(
    `Bot erkannt: ${row.companyName}`,
    verdict.isSpam,
    `Score ${verdict.score}, Signale: ${verdict.signals.join(", ") || "keine"}`,
  );
}

// ---------------------------------------------------------------------------
// 2. Echte Kundenanfragen — dürfen NIE als Spam gelten
// ---------------------------------------------------------------------------

const realCustomers = [
  {
    label: "Trentzsch (Chat 23.08.2026, echter verlorener Lead)",
    companyName: "Geflügelhof Trentzsch",
    contactName: "Trentzsch",
    email: "info@gefluegelhof-trentzsch.de",
    phone: "+49 351 1234567",
    website: "https://gefluegelhof-trentzsch.de",
    notes:
      "Ich brauche ein Etikett mit meinem Wunschformat für unsere Eierpappen. Die Hauptfarben sind schwarz, rosa/pink, Gold. Was können sie mir als Material empfehlen? Gibt es auch Musterdrucke?",
  },
  {
    label: "Kurze Namen und Abkürzungen",
    companyName: "AH Bio GmbH",
    contactName: "Anna Hoff",
    email: "a.hoff@ah-bio.de",
    phone: "0151 23456789",
    website: "https://ah-bio.de/kontakt",
    notes: "Brauchen 5000 Etiketten.",
  },
  {
    label: "Zusammengesetzte deutsche Wörter ohne Leerzeichen",
    companyName: "Lebensmittelkennzeichnung",
    contactName: "Etikettendruckerei",
    email: "kontakt@beispielmanufaktur.de",
    phone: "+49 30 901820",
    website: "https://beispielmanufaktur.de",
    notes: "Mindesthaltbarkeitsdatum",
  },
  {
    label: "Supplement-Marke mit Fachbegriffen",
    companyName: "Nordlicht Supplements UG",
    contactName: "Jonas Brinkmann",
    email: "jonas.brinkmann@nordlicht-supplements.de",
    phone: "+49 40 55667788",
    website: "https://nordlicht-supplements.de",
    notes:
      "Wir benötigen opake PP-Rollenetiketten mit Chargennummer und MHD, 100x200 mm, wiederkehrend etwa alle acht Wochen.",
  },
  {
    label: "Österreichischer Kunde, Umlaute",
    companyName: "Müller & Söhne KG",
    contactName: "Jürgen Müller",
    email: "j.mueller@muellerundsoehne.at",
    phone: "+43 664 1234567",
    website: "https://muellerundsoehne.at",
    notes: "Grüße aus Wien – wir brauchen Etiketten für Honiggläser.",
  },
  {
    label: "Minimalausfüllung ohne optionale Felder",
    companyName: "Rösterei Nord",
    contactName: "",
    email: "hallo@roesterei-nord.de",
    phone: "",
    website: "",
    notes: "",
  },
  {
    label: "Doppelter Nachname mit Punkt im lokalen Teil",
    companyName: "Bio-Manufaktur Schmidt-Wagner",
    contactName: "Lena Schmidt-Wagner",
    email: "lena.schmidt-wagner@bio-manufaktur.de",
    phone: "+49 221 4455667",
    website: "https://bio-manufaktur.de",
    notes: "Bitte um ein Angebot für transparente Etiketten.",
  },
];

for (const { label, ...row } of realCustomers) {
  const verdict = evaluateFormSubmission({ ...row, renderedAt: FRESH_FORM });
  check(
    `Kein Fehlalarm: ${label}`,
    !verdict.isSpam,
    `Score ${verdict.score}, Signale: ${verdict.signals.join(", ") || "keine"}`,
  );
}

// ---------------------------------------------------------------------------
// 3. Einzelne Schichten
// ---------------------------------------------------------------------------

// Honeypot schlägt sofort an, egal wie echt der Rest aussieht.
const honeypotVerdict = evaluateFormSubmission({
  honeypot: "https://spam.example",
  renderedAt: FRESH_FORM,
  companyName: "Rösterei Nord",
  contactName: "Lena Schmidt",
  email: "hallo@roesterei-nord.de",
});
check("Honeypot greift sofort", honeypotVerdict.isSpam && honeypotVerdict.score === 100);
check(
  "Honeypot meldet das richtige Signal",
  honeypotVerdict.signals.includes("honeypot"),
);

// Sofort-Absenden allein reicht noch nicht (Score 3 < Schwelle 4) …
const instantOnly = evaluateFormSubmission({
  renderedAt: String(Date.now()),
  companyName: "Rösterei Nord",
  contactName: "Lena Schmidt",
  email: "hallo@roesterei-nord.de",
  notes: "Bitte um ein Angebot.",
});
check(
  "Schnelles Absenden allein verwirft keine echte Anfrage",
  !instantOnly.isSpam,
  `Score ${instantOnly.score}`,
);

// … aber zusammen mit einem Inhaltssignal schon.
const instantPlusContent = evaluateFormSubmission({
  renderedAt: String(Date.now()),
  companyName: "Rösterei Nord",
  contactName: "Lena Schmidt",
  email: "l.e.n.a.schmidt@gmail.com",
  notes: "Bitte um ein Angebot.",
});
check(
  "Schnelles Absenden plus Punkt-Alias kippt",
  instantPlusContent.isSpam,
  `Score ${instantPlusContent.score}`,
);

// Direkter POST ohne gerendertes Formular: verdächtig, aber allein kein Urteil.
const noTimestamp = evaluateFormSubmission({
  companyName: "Rösterei Nord",
  contactName: "Lena Schmidt",
  email: "hallo@roesterei-nord.de",
  notes: "Bitte um ein Angebot für 5.000 Etiketten.",
});
check(
  "Fehlender Zeitstempel allein verwirft nicht (JS deaktiviert)",
  !noTimestamp.isSpam,
  `Score ${noTimestamp.score}`,
);

// Liegengebliebener Tab darf nicht bestraft werden.
const staleTab = evaluateFormSubmission({
  renderedAt: String(Date.now() - 9 * 60 * 60 * 1000),
  companyName: "Rösterei Nord",
  contactName: "Lena Schmidt",
  email: "hallo@roesterei-nord.de",
  notes: "Bitte um ein Angebot.",
});
check("Alter Tab wird nicht als Spam gewertet", !staleTab.isSpam);

console.log(`✓ Formular-Spam-Erkennung: ${passed} Prüfungen bestanden.`);
