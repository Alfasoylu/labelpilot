import { NextResponse } from "next/server";

import { getPrismaClient } from "@/lib/db/prisma";
import { getSignedUrl } from "@/lib/storage/artwork";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ orderId: string; fileId: string }> },
) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return NextResponse.json({ error: "Datei ist derzeit nicht verfügbar." }, { status: 503 });
  }

  const { orderId, fileId } = await context.params;
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Sie haben keinen Zugriff auf diese Datei." }, { status: 403 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      uploadToken: true,
      uploadTokenExpiresAt: true,
    },
  });

  if (!order || order.uploadToken !== token) {
    return NextResponse.json({ error: "Sie haben keinen Zugriff auf diese Datei." }, { status: 403 });
  }

  if (order.uploadTokenExpiresAt && Date.now() > order.uploadTokenExpiresAt.getTime()) {
    return NextResponse.json({ error: "Ihr Zugangs-Link ist abgelaufen. Bitte fordern Sie einen neuen Link an." }, { status: 403 });
  }

  const artworkFile = await prisma.artworkFile.findFirst({
    where: {
      id: fileId,
      orderId: order.id,
    },
    select: {
      storagePath: true,
    },
  });

  if (!artworkFile) {
    return NextResponse.json({ error: "Datei konnte nicht gefunden werden." }, { status: 404 });
  }

  try {
    const signedUrl = await getSignedUrl(artworkFile.storagePath, 60);
    return NextResponse.redirect(signedUrl, {
      status: 302,
      headers: {
        "Cache-Control": "no-store, private",
      },
    });
  } catch (error) {
    console.error("Signed URL fehlgeschlagen:", error);
    return NextResponse.json({ error: "Datei ist derzeit nicht verfügbar." }, { status: 500 });
  }
}
