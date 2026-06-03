import assert from "node:assert/strict";

import * as XLSX from "xlsx";

import { buildGeneratedPrintFilePlaceholder } from "../lib/variable-data/generated-print-file.ts";
import { parseVariableDataFile } from "../lib/variable-data/parser.ts";

const csvBuffer = Buffer.from(
  ["lotNumber,bestBeforeDate,sku", "LOT-001,2026-12-31,SKU-1", "LOT-002,,SKU-2"].join("\n"),
  "utf8",
);

const parsedCsv = parseVariableDataFile({
  fileName: "variable-data.csv",
  buffer: csvBuffer,
});

assert.equal(parsedCsv.fileType, "csv");
assert.equal(parsedCsv.totalRows, 2);
assert.equal(parsedCsv.validRows, 1);
assert.equal(parsedCsv.invalidRows, 1);
assert.deepEqual(parsedCsv.detectedColumns, ["bestBeforeDate", "lotNumber", "sku"]);
assert.equal(parsedCsv.rows[1].validationErrors[0], "Pflichtfeld fehlt: bestBeforeDate");

const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet([
  { Lotnummer: "LOT-100", SKT: "31.01.2027", SKU: "SKU-100" },
  { Lotnummer: "", SKT: "31.02.2027", SKU: "SKU-200" },
]);
XLSX.utils.book_append_sheet(workbook, worksheet, "Batch");
const xlsxBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;

const parsedXlsx = parseVariableDataFile({
  fileName: "variable-data.xlsx",
  buffer: xlsxBuffer,
});

assert.equal(parsedXlsx.fileType, "xlsx");
assert.equal(parsedXlsx.totalRows, 2);
assert.equal(parsedXlsx.validRows, 1);
assert.equal(parsedXlsx.invalidRows, 1);
assert.equal(parsedXlsx.rows[0].payload.lotNumber, "LOT-100");
assert.equal(parsedXlsx.rows[0].payload.bestBeforeDate, "31.01.2027");
assert.equal(parsedXlsx.rows[1].validationErrors.includes("Pflichtfeld fehlt: lotNumber"), true);

const placeholder = buildGeneratedPrintFilePlaceholder({
  batchId: "batch-1",
  fileName: "supplement-lot.xlsx",
  rows: [
    {
      payload: {
        lotNumber: "LOT-900",
        bestBeforeDate: "2027-04-30",
        sku: "SKU-900",
      },
      isValid: true,
    },
  ],
});

assert.equal(placeholder.status, "PLACEHOLDER_READY");
assert.equal(placeholder.fileName, "supplement-lot-generated-placeholder.csv");
assert.equal(placeholder.rowCount, 1);
assert.equal(
  placeholder.content,
  "bestBeforeDate,lotNumber,sku\n2027-04-30,LOT-900,SKU-900\n",
);
assert.equal(placeholder.checksum.length, 64);

console.log("Variable-data parser tests passed.");
