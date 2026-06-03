import { NextResponse } from "next/server";

import { getPrismaClient } from "@/lib/db/prisma";
import {
  getAccessibleStoredDesignDetail,
  getCustomerAccessContext,
} from "@/lib/artwork/saved-designs";
import { getSignedUrl } from "@/lib/storage/artwork";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ designId: string; versionId: string }> },
) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return NextResponse.json(
      { error: "Gespeicherte Druckdaten sind derzeit nicht verfuegbar." },
      { status: 503 },
    );
  }

  const { designId, versionId } = await context.params;
  const url = new URL(request.url);
  const orderId = url.searchParams.get("order");
  const token = url.searchParams.get("token");
  const asset = url.searchParams.get("asset") === "proof" ? "proof" : "artwork";

  if (!orderId || !token) {
    return NextResponse.json(
      { error: "Sie haben keinen Zugriff auf diese Datei." },
      { status: 403 },
    );
  }

  const access = await getCustomerAccessContext(prisma, orderId, token);

  if (!access) {
    return NextResponse.json(
      { error: "Sie haben keinen Zugriff auf diese Datei." },
      { status: 403 },
    );
  }

  const design = await getAccessibleStoredDesignDetail(prisma, designId, access);
  const version = design?.artworkVersions.find(
    (item: NonNullable<typeof design>["artworkVersions"][number]) => item.id === versionId,
  );

  if (!design || !version) {
    return NextResponse.json({ error: "Druckdatenversion wurde nicht gefunden." }, { status: 404 });
  }

  const file =
    asset === "proof"
      ? version.proofFile
      : version.originalArtworkFile ?? version.proofFile;

  if (!file?.storagePath) {
    return NextResponse.json(
      { error: "Diese Datei steht fuer den Download nicht bereit." },
      { status: 404 },
    );
  }

  try {
    const signedUrl = await getSignedUrl(file.storagePath, 60);
    return NextResponse.redirect(signedUrl, { status: 302 });
  } catch (error) {
    console.error("Stored-Design-Download fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Datei konnte nicht bereitgestellt werden." },
      { status: 500 },
    );
  }
}
