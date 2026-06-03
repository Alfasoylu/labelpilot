import { NextResponse } from "next/server";

import { getPrismaClient } from "@/lib/db/prisma";
import { buildGeneratedPrintFilePlaceholder } from "@/lib/variable-data/generated-print-file";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ batchId: string }> },
) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return NextResponse.json(
      { error: "Variable-Data-Download ist derzeit nicht verfuegbar." },
      { status: 503 },
    );
  }

  const { batchId } = await context.params;
  const batch = await prisma.variableDataBatch.findUnique({
    where: { id: batchId },
    include: {
      rows: {
        orderBy: {
          rowIndex: "asc",
        },
      },
    },
  });

  if (!batch) {
    return NextResponse.json({ error: "Batch wurde nicht gefunden." }, { status: 404 });
  }

  const placeholder = buildGeneratedPrintFilePlaceholder({
    batchId: batch.id,
    fileName: batch.fileName,
    rows: batch.rows.map((row: (typeof batch.rows)[number]) => ({
      payload: row.payload as Record<string, string>,
      isValid: row.isValid,
    })),
  });

  return new NextResponse(placeholder.content, {
    status: 200,
    headers: {
      "Content-Type": `${placeholder.mimeType}; charset=utf-8`,
      "Content-Disposition": `attachment; filename="${placeholder.fileName}"`,
      "X-Labelpilot-Checksum": placeholder.checksum,
    },
  });
}
