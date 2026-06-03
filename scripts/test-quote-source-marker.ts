import assert from "node:assert/strict";

import {
  getQuoteSourceLabel,
  normalizeQuoteSource,
} from "../lib/quotes/source.ts";

assert.equal(normalizeQuoteSource("wunschformat"), "WUNSCHFORMAT");
assert.equal(normalizeQuoteSource("WUNSCHFORMAT"), "WUNSCHFORMAT");
assert.equal(normalizeQuoteSource("unknown"), null);
assert.equal(normalizeQuoteSource(""), null);
assert.equal(getQuoteSourceLabel("WUNSCHFORMAT"), "Wunschformat");
assert.equal(getQuoteSourceLabel("unknown"), "Standard");

console.log("Quote source marker tests passed.");
