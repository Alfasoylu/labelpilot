import { NextResponse } from "next/server";

import { getPrismaClient } from "@/lib/db/prisma";
import { getSignedUrl } from "@/lib/storage/artwork";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ orderId: string; fileId: string }> },
) {
  const prisma = getPrismaClient();

  if (!prisma) {
    console.error("Admin-Dateidownload nicht verfuegbar: DATABASE_URL fehlt.");
    return NextResponse.json(
      { error: "Datei konnte nicht geladen werden." },
      { status: 503 },
    );
  }

  const { orderId, fileId } = await context.params;
  const artworkFile = await prisma.artworkFile.findFirst({
    where: {
      id: fileId,
      orderId,
    },
    select: {
      storagePath: true,
    },
  });

  if (!artworkFile) {
    return NextResponse.json({ error: "Datei wurde nicht gefunden." }, { status: 404 });
  }

  try {
    const signedUrl = await getSignedUrl(artworkFile.storagePath);
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error("Admin-Dateidownload fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Datei konnte nicht geladen werden." },
      { status: 500 },
    );
  }
}
