import { NextResponse } from "next/server";

import { getSupabaseUserFromRequest } from "@/lib/account/auth";
import { ensureCustomerForSupabaseUser } from "@/lib/account/customers";
import { getPrismaClient } from "@/lib/db/prisma";
import {
  type CustomerAccessContext,
  getAccessibleStoredDesignDetail,
  getCustomerAccountAccessContext,
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
      { error: "Gespeicherte Druckdaten sind derzeit nicht verfügbar." },
      { status: 503 },
    );
  }

  const { designId, versionId } = await context.params;
  const url = new URL(request.url);
  const orderId = url.searchParams.get("order");
  const token = url.searchParams.get("token");
  const asset = url.searchParams.get("asset") === "proof" ? "proof" : "artwork";
  const wantsJson = request.headers.get("accept")?.includes("application/json") ?? false;
  const authHeader = request.headers.get("authorization") ?? "";

  let access: CustomerAccessContext | null = null;

  if (authHeader.startsWith("Bearer ")) {
    const auth = await getSupabaseUserFromRequest(request);

    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const customer = await ensureCustomerForSupabaseUser(prisma, auth.user);
    access = await getCustomerAccountAccessContext(prisma, customer.id);
  } else if (orderId && token) {
    access = await getCustomerAccessContext(prisma, orderId, token);
  }

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
      { error: "Diese Datei steht für den Download nicht bereit." },
      { status: 404 },
    );
  }

  try {
    const signedUrl = await getSignedUrl(file.storagePath, 60);
    if (wantsJson) {
      return NextResponse.json({ url: signedUrl });
    }

    return NextResponse.redirect(signedUrl, { status: 302 });
  } catch (error) {
    console.error("Stored-Design-Download fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Datei konnte nicht bereitgestellt werden." },
      { status: 500 },
    );
  }
}
