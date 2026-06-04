type LeadScoringInput = {
  type:
    | "QUOTE_REQUEST"
    | "SAMPLE_BOX_REQUEST"
    | "CONTACT_REQUEST"
    | "OUTBOUND_PROSPECT"
    | "REORDER_INTEREST"
    | "BULK_ORDER_INTEREST";
  country?: string | null;
  industry?: string | null;
  quantity?: string | null;
  recurringNeed?: string | null;
  website?: string | null;
  hasArtwork?: boolean | null;
  notes?: string | null;
};

function includesAny(value: string | null | undefined, terms: string[]) {
  if (!value) {
    return false;
  }

  const normalized = value.toLowerCase();
  return terms.some((term) => normalized.includes(term));
}

export function computeLeadScore(input: LeadScoringInput) {
  let score = 0;

  if (includesAny(input.country, ["deutschland", "germany"])) {
    score += 15;
  }

  if (
    includesAny(input.industry, [
      "lebensmittel",
      "getr",
      "supplement",
      "kaffee",
      "tee",
      "gew",
      "honig",
      "marmelade",
    ])
  ) {
    score += 20;
  }

  if (includesAny(input.quantity, ["10.000", "10000", "20.000", "20000", "+"])) {
    score += 25;
  } else if (includesAny(input.quantity, ["5.000", "5000"])) {
    score += 20;
  }

  if (
    includesAny(input.recurringNeed, ["ja", "regelm", "wiederkehrend"]) ||
    input.type === "REORDER_INTEREST"
  ) {
    score += 20;
  }

  if (input.website?.trim()) {
    score += 10;
  }

  if (input.hasArtwork) {
    score += 10;
  }

  if (input.type === "SAMPLE_BOX_REQUEST") {
    score += 5;
  }

  if (includesAny(input.notes, ["billig", "günstig", "günstig", "cheapest", "nur preis"])) {
    score -= 15;
  }

  if (includesAny(input.quantity, ["100", "250", "500"])) {
    score -= 20;
  }

  if (includesAny(input.notes, ["heute", "same day", "sofort", "dringend"])) {
    score -= 20;
  }

  if (
    includesAny(input.notes, [
      "sticker",
      "hochzeit",
      "wedding",
      "einmalig",
      "hobby",
    ])
  ) {
    score -= 20;
  }

  const normalizedScore = Math.max(0, Math.min(100, score));

  return {
    score: normalizedScore,
    quality:
      normalizedScore >= 80
        ? "High"
        : normalizedScore >= 60
          ? "Good"
          : normalizedScore >= 30
            ? "Medium"
            : "Low",
  };
}
