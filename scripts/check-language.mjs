/**
 * Language guard — customer-facing files must be GERMAN ONLY.
 *
 * The site language is German (see docs/00-PROJECT-BRIEF.md §2 — hard rule).
 * Turkish must NEVER appear in any customer-facing page, component, email or
 * content file. This script scans those directories for Turkish-specific
 * characters (ş ğ ı İ ç) — letters that never occur in German — and FAILS the
 * build if any are found, so Turkish can never be deployed.
 *
 * Allowed German letters (ä ö ü ß) are NOT flagged.
 * docs/ is intentionally NOT scanned (internal notes may contain Turkish).
 *
 * Runs automatically as part of `npm run build` (and in CI).
 */
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, extname } from "node:path";

// Customer-facing directories only. docs/ and scripts/ are excluded on purpose.
const SCAN_DIRS = ["app", "components", "content", "messages", "emails", "lib"];
const EXTENSIONS = new Set([
  ".tsx", ".ts", ".jsx", ".js", ".mjs", ".cjs",
  ".mdx", ".md", ".json", ".html", ".css",
]);

// Letters unique to Turkish (absent from German and English). Strong signal.
const TURKISH = /[şŞğĞıİçÇ]/;

const offenders = [];

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
      const lines = readFileSync(full, "utf8").split(/\r?\n/);
      lines.forEach((line, i) => {
        if (TURKISH.test(line)) {
          offenders.push(`  ${full}:${i + 1}  ${line.trim().slice(0, 100)}`);
        }
      });
    }
  }
}

for (const dir of SCAN_DIRS) walk(dir);

if (offenders.length > 0) {
  console.error(
    "\n❌  Turkish characters detected. The site must be GERMAN ONLY."
  );
  console.error(
    "   No Turkish is allowed in customer-facing files. Offending lines:\n"
  );
  console.error(offenders.join("\n"));
  console.error(
    `\n   ${offenders.length} line(s) flagged. Build stopped. See docs/00-PROJECT-BRIEF.md §2.\n`
  );
  process.exit(1);
}

console.log("✓ Language guard: no Turkish in customer-facing files (German only).");
