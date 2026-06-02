import { NextResponse } from "next/server";

import { getPrismaClient } from "@/lib/db/prisma";
import { getSignedUrl } from "@/lib/storage/artwork";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ orderId: string; proofId: string }> },
) {
  const prisma = getPrismaClient();

  if (!prisma) {
    console.error("Admin-Proofdownload nicht verfuegbar: DATABASE_URL fehlt.");
    return NextResponse.json(
      { error: "Datei konnte nicht geladen werden." },
      { status: 503 },
    );
  }

  const { orderId, proofId } = await context.params;
  const proofFile = await prisma.proofFile.findFirst({
    where: {
      id: proofId,
      orderId,
    },
    select: {
      storagePath: true,
    },
  });

  if (!proofFile) {
    return NextResponse.json({ error: "Datei wurde nicht gefunden." }, { status: 404 });
  }

  try {
    const signedUrl = await getSignedUrl(proofFile.storagePath);
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error("Admin-Proofdownload fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Datei konnte nicht geladen werden." },
      { status: 500 },
    );
  }
}
