import { NextResponse } from "next/server";

import { getSupabaseUserFromRequest } from "@/lib/account/auth";
import { ensureCustomerForSupabaseUser } from "@/lib/account/customers";
import {
  getAccessibleStoredDesignDetail,
  getCustomerAccountAccessContext,
} from "@/lib/artwork/saved-designs";
import { getPrismaClient } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ designId: string }> },
) {
  const auth = await getSupabaseUserFromRequest(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const prisma = getPrismaClient();

  if (!prisma) {
    return NextResponse.json(
      { error: "Kundenkonto ist derzeit nicht verfügbar." },
      { status: 503 },
    );
  }

  const { designId } = await context.params;

  try {
    const customer = await ensureCustomerForSupabaseUser(prisma, auth.user);
    const access = await getCustomerAccountAccessContext(prisma, customer.id);

    if (!access) {
      return NextResponse.json(
        { error: "Kundenkonto wurde nicht gefunden." },
        { status: 404 },
      );
    }

    const design = await getAccessibleStoredDesignDetail(prisma, designId, access);

    if (!design) {
      return NextResponse.json(
        { error: "Design wurde nicht gefunden." },
        { status: 404 },
      );
    }

    // Never expose storagePath to the client; downloads go through the signed-URL endpoint.
    return NextResponse.json({
      id: design.id,
      name: design.name,
      productSlug: design.productSlug,
      labelSize: design.labelSize,
      material: design.material,
      defaultQuantity: design.defaultQuantity,
      status: design.status,
      currentArtworkVersionId: design.currentArtworkVersionId,
      lastOrderedAt: design.lastOrderedAt?.toISOString() ?? null,
      totalOrders: design.totalOrders,
      lastOrder: design.lastOrder
        ? {
            id: design.lastOrder.id,
            orderNumber: design.lastOrder.orderNumber,
            createdAt: design.lastOrder.createdAt.toISOString(),
          }
        : null,
      versions: design.artworkVersions.map((version) => ({
        id: version.id,
        versionNumber: version.versionNumber,
        versionLabel: version.versionLabel,
        approvedAt: version.approvedAt?.toISOString() ?? null,
        status: version.status,
        sourceType: version.sourceType,
        changeSummary: version.changeSummary ?? null,
        artwork: version.originalArtworkFile
          ? { id: version.originalArtworkFile.id, fileName: version.originalArtworkFile.fileName }
          : null,
        proof: version.proofFile
          ? { id: version.proofFile.id, fileName: version.proofFile.fileName }
          : null,
      })),
    });
  } catch (error) {
    console.error("Design-Detail-API fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Design konnte nicht geladen werden." },
      { status: 500 },
    );
  }
}
