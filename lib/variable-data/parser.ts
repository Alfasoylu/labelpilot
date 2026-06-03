import * as XLSX from "xlsx";

type ParsedVariableDataRow = {
  rowIndex: number;
  payload: Record<string, string>;
  validationErrors: string[];
  isValid: boolean;
};

export type ParsedVariableDataBatch = {
  fileType: "csv" | "tsv" | "xlsx" | "xls";
  detectedColumns: string[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
  rows: ParsedVariableDataRow[];
};

const REQUIRED_COLUMNS = ["lotNumber", "bestBeforeDate"] as const;

const COLUMN_ALIASES: Record<string, string> = {
  lot: "lotNumber",
  lotnumber: "lotNumber",
  lotnummer: "lotNumber",
  charge: "lotNumber",
  chargennummer: "lotNumber",
  bestbefore: "bestBeforeDate",
  bestbeforedate: "bestBeforeDate",
  mhd: "bestBeforeDate",
  skt: "bestBeforeDate",
  mindesthaltbarkeit: "bestBeforeDate",
  sku: "sku",
};

export function parseVariableDataFile(input: {
  fileName: string;
  buffer: Buffer;
}) {
  const fileType = getVariableDataFileType(input.fileName);
  const workbook =
    fileType === "csv" || fileType === "tsv"
      ? XLSX.read(input.buffer.toString("utf8"), {
          type: "string",
          FS: fileType === "tsv" ? "\t" : ",",
        })
      : XLSX.read(input.buffer, { type: "buffer" });

  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error("Die Datei enthaelt kein lesbares Tabellenblatt.");
  }

  const sheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  });

  const rows = rawRows.map((row, index) => normalizeVariableDataRow(row, index + 1));
  const detectedColumns = Array.from(
    new Set(rows.flatMap((row) => Object.keys(row.payload))),
  ).sort();
  const validRows = rows.filter((row) => row.isValid).length;

  return {
    fileType,
    detectedColumns,
    totalRows: rows.length,
    validRows,
    invalidRows: rows.length - validRows,
    rows,
  } satisfies ParsedVariableDataBatch;
}

function normalizeVariableDataRow(
  row: Record<string, unknown>,
  rowIndex: number,
): ParsedVariableDataRow {
  const payload = Object.fromEntries(
    Object.entries(row).map(([key, value]) => {
      const normalizedKey = normalizeColumnKey(key);
      return [normalizedKey, normalizeCellValue(normalizedKey, value)];
    }),
  );

  const validationErrors: string[] = [];

  for (const column of REQUIRED_COLUMNS) {
    if (!payload[column]) {
      validationErrors.push(`Pflichtfeld fehlt: ${column}`);
    }
  }

  if (payload.bestBeforeDate && !isSupportedDate(payload.bestBeforeDate)) {
    validationErrors.push("bestBeforeDate ist kein gueltiges Datum.");
  }

  return {
    rowIndex,
    payload,
    validationErrors,
    isValid: validationErrors.length === 0,
  };
}

function normalizeColumnKey(value: string) {
  const compact = value
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "");

  return COLUMN_ALIASES[compact] ?? compact;
}

function normalizeCellValue(columnKey: string, value: unknown) {
  if (columnKey === "bestBeforeDate" && typeof value === "number") {
    const date = excelSerialToDate(value);

    if (date) {
      const year = String(date.getUTCFullYear()).padStart(4, "0");
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const day = String(date.getUTCDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  }

  return String(value ?? "").trim();
}

function excelSerialToDate(value: number) {
  if (!Number.isFinite(value)) {
    return null;
  }

  const excelEpoch = Date.UTC(1899, 11, 30);
  return new Date(excelEpoch + Math.round(value) * 24 * 60 * 60 * 1000);
}

function isSupportedDate(value: string) {
  const normalized = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return !Number.isNaN(Date.parse(`${normalized}T00:00:00.000Z`));
  }

  if (/^\d{2}\.\d{2}\.\d{4}$/.test(normalized)) {
    const [day, month, year] = normalized.split(".");
    return !Number.isNaN(Date.parse(`${year}-${month}-${day}T00:00:00.000Z`));
  }

  return false;
}

function getVariableDataFileType(fileName: string) {
  const extension = fileName.toLowerCase().split(".").pop();

  if (extension === "csv") {
    return "csv";
  }

  if (extension === "tsv") {
    return "tsv";
  }

  if (extension === "xls") {
    return "xls";
  }

  if (extension === "xlsx") {
    return "xlsx";
  }

  throw new Error("Unterstuetzte Formate sind CSV, TSV, XLS und XLSX.");
}
