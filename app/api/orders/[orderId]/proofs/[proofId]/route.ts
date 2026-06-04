import { NextResponse } from "next/server";

import { getPrismaClient } from "@/lib/db/prisma";
import { getSignedUrl } from "@/lib/storage/artwork";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ orderId: string; proofId: string }> },
) {
  const prisma = getPrismaClient();

  if (!prisma) {
    console.error("Proof-Download nicht verfügbar: DATABASE_URL fehlt.");
    return NextResponse.json(
      { error: "Proof ist derzeit nicht verfügbar." },
      { status: 503 },
    );
  }

  const { orderId, proofId } = await context.params;
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Sie haben keinen Zugriff auf diese Datei." }, { status: 403 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      uploadToken: true,
      proofFiles: {
        where: { id: proofId },
        take: 1,
      },
    },
  });

  if (!order || order.uploadToken !== token || order.proofFiles.length === 0) {
    return NextResponse.json({ error: "Sie haben keinen Zugriff auf diese Datei." }, { status: 403 });
  }

  try {
    const signedUrl = await getSignedUrl(order.proofFiles[0].storagePath);
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error("Proof-Download fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Proof konnte nicht bereitgestellt werden." },
      { status: 500 },
    );
  }
}
