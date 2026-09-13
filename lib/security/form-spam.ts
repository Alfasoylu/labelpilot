/**
 * Spam-Erkennung für öffentliche Formulare (Angebot, Musterbox).
 *
 * Hintergrund: Zwischen Juni und September 2026 wurden über die öffentlichen
 * Formulare 218 von 220 Angebotsanfragen und 216 von 216 Musterbox-Anfragen von
 * einem Bot erzeugt. Echte Anfragen gingen darin unter, jede erzeugte zusätzlich
 * eine Kunden- und eine Ops-E-Mail (inkl. Bounces auf gefälschte Adressen).
 *
 * Die Erkennung arbeitet in drei Schichten, damit kein einzelnes Signal allein
 * über eine echte Anfrage entscheidet:
 *
 *   1. Honeypot  — ein für Menschen unsichtbares Feld. Ausgefüllt = immer Bot.
 *   2. Zeitfalle — ein Formular, das in unter MIN_FILL_SECONDS abgeschickt wird,
 *                  wurde nicht von Hand ausgefüllt.
 *   3. Inhalt    — Punktesystem über die eingegebenen Werte (Zufallszeichen-
 *                  ketten, Wegwerf-Domains, Punkt-Trick bei Gmail-Adressen).
 *
 * Erkannte Anfragen werden verworfen, ohne dass der Absender es merkt: keine
 * Datenbankzeile, keine E-Mail, aber dieselbe Erfolgsmeldung. Ein Bot, der eine
 * Fehlermeldung sieht, passt sich sonst an.
 */

/** Feldname des Honeypots. Bots füllen URL-artige Felder bevorzugt aus. */
export const HONEYPOT_FIELD = "homepageUrl";

/** Feldname des Zeitstempels, den das Formular beim Rendern setzt. */
export const RENDERED_AT_FIELD = "renderedAt";

/** Schneller als das füllt kein Mensch ein mehrzeiliges B2B-Formular aus. */
const MIN_FILL_SECONDS = 4;

/** Älter als das ist ein liegengebliebener Tab — Zeitsignal dann ungültig. */
const MAX_FORM_AGE_SECONDS = 6 * 60 * 60;

/** Ab dieser Punktzahl gilt eine Anfrage als Bot. */
const SPAM_SCORE_THRESHOLD = 4;

export type SpamVerdict = {
  isSpam: boolean;
  score: number;
  /** Für das Server-Log — nie an den Absender ausgeben. */
  signals: string[];
};

export type SpamCheckInput = {
  honeypot?: FormDataEntryValue | string | null;
  renderedAt?: FormDataEntryValue | string | null;
  email?: string | null;
  companyName?: string | null;
  contactName?: string | null;
  website?: string | null;
  phone?: string | null;
  notes?: string | null;
};

function toText(value: FormDataEntryValue | string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

const VOWELS = new Set(["a", "e", "i", "o", "u", "ä", "ö", "ü", "y"]);

/**
 * Erkennt zufällig erzeugte Zeichenketten wie "gyUcxJZOomJRQzezzaqxAq" oder
 * "Alpktymglt", ohne echte deutsche Wörter zu treffen.
 *
 * Zwei unabhängige Merkmale, von denen eines reicht:
 *   - unregelmäßige Groß-/Kleinschreibung (>= 3 Wechsel klein -> groß). Echte
 *     Namen haben einen Wechsel am Wortanfang, Abkürzungen einen Block.
 *   - sehr niedriger Vokalanteil (< 25 %). "Etikettendruck" liegt bei 36 %,
 *     "Alpktymglt" bei 10 %.
 */
function looksLikeRandomString(value: string) {
  const word = value.trim();

  // Zu kurz für eine verlässliche Aussage (z. B. "GmbH", "Bio", "AH").
  if (word.length < 10) {
    return false;
  }

  // Mehrere Wörter deuten auf echten Text hin.
  if (/\s/.test(word)) {
    return false;
  }

  const letters = word.replace(/[^a-zA-ZäöüÄÖÜß]/g, "");

  if (letters.length < 10) {
    return false;
  }

  let lowerToUpperSwitches = 0;
  for (let i = 1; i < letters.length; i += 1) {
    const previous = letters[i - 1];
    const current = letters[i];
    if (previous === previous.toLowerCase() && current === current.toUpperCase()) {
      lowerToUpperSwitches += 1;
    }
  }

  if (lowerToUpperSwitches >= 3) {
    return true;
  }

  let vowelCount = 0;
  for (const character of letters.toLowerCase()) {
    if (VOWELS.has(character)) {
      vowelCount += 1;
    }
  }

  return vowelCount / letters.length < 0.25;
}

/** Prüft nur das erste Wort — "Alpktymglt LLC" soll anschlagen. */
function firstWordLooksRandom(value: string) {
  const [firstWord] = value.trim().split(/\s+/);
  return firstWord ? looksLikeRandomString(firstWord) : false;
}

/**
 * Der Punkt-Trick bei Gmail: "d.o.d.u.t.ah.i485@gmail.com" landet im selben
 * Postfach wie "doduta hi485@gmail.com", sieht für Formulare aber jedes Mal
 * nach einer neuen Adresse aus. Drei oder mehr Punkte im lokalen Teil sind bei
 * einer echten Geschäftsadresse praktisch ausgeschlossen.
 */
function usesDottedAliasTrick(email: string) {
  const [localPart] = email.toLowerCase().split("@");
  if (!localPart) {
    return false;
  }

  return (localPart.match(/\./g)?.length ?? 0) >= 3;
}

/** Wegwerf-Domain ohne Pfad, z. B. "https://ozjkod.com". */
function looksLikeThrowawayDomain(website: string) {
  const match = website.match(/^https?:\/\/([a-z]{5,14})\.com\/?$/i);
  return match ? looksLikeRandomString(match[1]) || !/[aeiou]{1}/i.test(match[1]) : false;
}

export function evaluateFormSubmission(input: SpamCheckInput): SpamVerdict {
  const signals: string[] = [];
  let score = 0;

  // Schicht 1 — Honeypot. Kein Mensch sieht dieses Feld, also ist jeder Inhalt
  // ein Bot. Kein Punktesystem, sofortige Entscheidung.
  if (toText(input.honeypot).length > 0) {
    return { isSpam: true, score: 100, signals: ["honeypot"] };
  }

  // Schicht 2 — Zeitfalle.
  const renderedAtRaw = toText(input.renderedAt);
  if (!renderedAtRaw) {
    // Ein direkter POST auf die Server-Action ohne gerendertes Formular.
    // Allein kein Beweis (JS deaktiviert), deshalb nur ein Teilsignal.
    score += 2;
    signals.push("kein Zeitstempel");
  } else {
    const renderedAt = Number.parseInt(renderedAtRaw, 10);

    if (!Number.isFinite(renderedAt)) {
      score += 2;
      signals.push("ungültiger Zeitstempel");
    } else {
      const elapsedSeconds = (Date.now() - renderedAt) / 1000;

      if (elapsedSeconds < MIN_FILL_SECONDS) {
        score += 3;
        signals.push(`zu schnell (${Math.max(0, Math.round(elapsedSeconds))}s)`);
      } else if (elapsedSeconds > MAX_FORM_AGE_SECONDS) {
        // Liegengebliebener Tab ist harmlos — Zeitsignal verfällt nur.
        signals.push("Formular veraltet");
      }
    }
  }

  // Schicht 3 — Inhalt.
  const companyName = toText(input.companyName);
  if (companyName && firstWordLooksRandom(companyName)) {
    score += 2;
    signals.push("Firmenname zufällig");
  }

  const contactName = toText(input.contactName);
  if (contactName && looksLikeRandomString(contactName)) {
    score += 2;
    signals.push("Ansprechpartner zufällig");
  }

  const notes = toText(input.notes);
  if (notes && looksLikeRandomString(notes)) {
    score += 2;
    signals.push("Nachricht zufällig");
  }

  const email = toText(input.email);
  if (email && usesDottedAliasTrick(email)) {
    score += 2;
    signals.push("Punkt-Alias in E-Mail");
  }

  const website = toText(input.website);
  if (website && looksLikeThrowawayDomain(website)) {
    score += 1;
    signals.push("Wegwerf-Domain");
  }

  const phone = toText(input.phone);
  if (phone && /^\d{10}$/.test(phone)) {
    // Zehn Ziffern ohne Vorwahl, Leerzeichen oder Trennung — in Deutschland
    // schreibt praktisch niemand seine Nummer so.
    score += 1;
    signals.push("Telefonnummer schematisch");
  }

  return { isSpam: score >= SPAM_SCORE_THRESHOLD, score, signals };
}

/** Einheitliches Server-Log, damit sich Angriffswellen nachvollziehen lassen. */
export function logSpamRejection(form: string, verdict: SpamVerdict) {
  console.warn(
    `[form-spam] ${form} abgewiesen (Score ${verdict.score}): ${verdict.signals.join(", ")}`,
  );
}
