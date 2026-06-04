import { createHash } from "node:crypto";

type VariablePrintRow = {
  payload: Record<string, string>;
  isValid: boolean;
};

export function buildGeneratedPrintFilePlaceholder(input: {
  batchId: string;
  fileName: string;
  rows: VariablePrintRow[];
}) {
  const validRows = input.rows.filter((row) => row.isValid);

  if (validRows.length === 0) {
    throw new Error("Für den Platzhalter werden mindestens eine gültige Zeile benötigt.");
  }

  const columns = Array.from(
    new Set(validRows.flatMap((row) => Object.keys(row.payload))),
  ).sort();
  const lines = [
    columns.join(","),
    ...validRows.map((row) =>
      columns.map((column) => escapeCsvValue(row.payload[column] ?? "")).join(","),
    ),
  ];
  const content = `${lines.join("\n")}\n`;
  const checksum = createHash("sha256").update(content).digest("hex");
  const baseName = input.fileName.replace(/\.[^.]+$/, "");

  return {
    batchId: input.batchId,
    status: "PLACEHOLDER_READY" as const,
    fileName: `${baseName}-generated-placeholder.csv`,
    mimeType: "text/csv" as const,
    rowCount: validRows.length,
    checksum,
    content,
  };
}

function escapeCsvValue(value: string) {
  if (!/[",\n]/.test(value)) {
    return value;
  }

  return `"${value.replaceAll('"', '""')}"`;
}
