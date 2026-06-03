export const QUOTE_SOURCE_WUNSCHFORMAT = "WUNSCHFORMAT";

const allowedQuoteSources = [QUOTE_SOURCE_WUNSCHFORMAT] as const;

export type QuoteSourceMarker = (typeof allowedQuoteSources)[number];

export function normalizeQuoteSource(input: string | null | undefined) {
  if (!input) {
    return null;
  }

  const normalized = input.trim().toUpperCase();
  return allowedQuoteSources.includes(normalized as QuoteSourceMarker)
    ? (normalized as QuoteSourceMarker)
    : null;
}

export function getQuoteSourceLabel(input: string | null | undefined) {
  return normalizeQuoteSource(input) === QUOTE_SOURCE_WUNSCHFORMAT
    ? "Wunschformat"
    : "Standard";
}
