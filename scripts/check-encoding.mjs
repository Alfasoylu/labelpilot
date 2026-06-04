/**
 * Encoding guard — customer-facing files must be clean UTF-8 German.
 *
 * The language guard (check-language.mjs) only catches Turkish letters. It does
 * NOT catch the encoding corruption that file-editing tooling repeatedly
 * introduced into this repo, and `next build` happily compiles all of it
 * because the bytes are still valid (just wrong glyphs). This guard closes that
 * gap and FAILS the build on:
 *
 *   1. Mojibake — double-encoded UTF-8 (CP1252-misread-as-UTF-8), e.g. "fÃ¼r",
 *      "GetrÃ¤nke", "GrÃ¶ÃŸe", "â€"". Lead bytes Ã (U+00C3) / Â (U+00C2) and the
 *      "â€" cluster never occur in correct German or English copy.
 *   2. Replacement characters (U+FFFD "�") — lossy decode artifacts.
 *   3. Word-internal literal "?" (U+003F between two letters) — what happens
 *      when an umlaut is dropped, e.g. "pr?fen", "N?chster". URL query strings
 *      ("...?token=", "...?session_id=") are explicitly NOT flagged.
 *   4. UTF-8 BOM (U+FEFF) at the start of a file.
 *
 * Scans the same customer-facing dirs as the language guard. docs/ excluded.
 * Runs automatically as part of `npm run build` (prebuild) and in test:safety.
 */
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, extname } from "node:path";

const SCAN_DIRS = ["app", "components", "content", "messages", "emails", "lib"];
const EXTENSIONS = new Set([
  ".tsx", ".ts", ".jsx", ".js", ".mjs", ".cjs",
  ".mdx", ".md", ".json", ".html", ".css",
]);

// Mojibake + replacement char. These code points never appear in legitimate
// German/English customer copy.
const MOJIBAKE = /[ÃÂ]|â€|�/;

// A "?" sitting between two letters, where it is NOT the start of a query
// string (key=value). That signature means a dropped umlaut, not a URL.
const QUESTION_BETWEEN = /[A-Za-zäöüßÄÖÜ]\?(?=[A-Za-zäöüßÄÖÜ])/g;
const QUERY_KEY_AFTER = /^[A-Za-z0-9_]*=/;

function hasCorruptQuestionMark(line) {
  let m;
  QUESTION_BETWEEN.lastIndex = 0;
  while ((m = QUESTION_BETWEEN.exec(line)) !== null) {
    const after = line.slice(m.index + 2); // text following the "?"
    if (QUERY_KEY_AFTER.test(after)) continue; // "?key=..." → real URL param
    return true;
  }
  return false;
}

const offenders = [];

function flag(full, i, line, reason) {
  offenders.push(`  ${full}:${i + 1}  [${reason}]  ${line.trim().slice(0, 100)}`);
}

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return; // directory does not exist yet — fine
  }
  for (const name of entries) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      walk(full);
    } else if (EXTENSIONS.has(extname(name))) {
      const raw = readFileSync(full, "utf8");
      if (raw.charCodeAt(0) === 0xfeff) {
        flag(full, 0, "(file starts with a UTF-8 BOM)", "BOM");
      }
      raw.split(/\r?\n/).forEach((line, i) => {
        if (MOJIBAKE.test(line)) flag(full, i, line, "mojibake");
        if (hasCorruptQuestionMark(line)) flag(full, i, line, "dropped-umlaut '?'");
      });
    }
  }
}

for (const dir of SCAN_DIRS) walk(dir);

if (offenders.length > 0) {
  console.error("\n❌  Encoding corruption detected in customer-facing files.");
  console.error(
    "   Mojibake (Ã/Â/â€), replacement chars (�), dropped-umlaut '?', or a BOM.\n"
  );
  console.error(offenders.join("\n"));
  console.error(
    `\n   ${offenders.length} line(s) flagged. Build stopped. Files must be clean UTF-8 with proper umlauts (ä/ö/ü/ß).\n`
  );
  process.exit(1);
}

console.log("✓ Encoding guard: no mojibake, dropped-umlaut '?', replacement chars or BOM.");
