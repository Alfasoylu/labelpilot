import type { Prisma } from "@prisma/client";

import { getPackageById } from "@/lib/commerce/packages";

type SyncStoredDesignInput = {
  tx: Prisma.TransactionClient;
  order: {
    id: string;
    customerId: string | null;
    customerEmail: string;
    companyName: string | null;
    customerName: string | null;
    productSlug: string;
    material: string;
    quantity: number;
    packageId: string;
    createdAt: Date;
  };
  sourceType: "CUSTOMER_UPLOAD" | "ADMIN_UPLOAD";
  originalArtworkFileId?: string | null;
  proofFileId?: string | null;
  changeSummary?: string | null;
};

function buildStoredDesignName(input: {
  companyName: string | null;
  customerName: string | null;
  productSlug: string;
  material: string;
  labelSize: string | null;
}) {
  const prefix = input.companyName || input.customerName || "Labelpilot";
  const product = input.productSlug.replaceAll("-", " ");
  const material =
    input.material === "TRANSPARENT" ? "Transparent PP" : "Opak PP";

  return [prefix, product, input.labelSize, material].filter(Boolean).join(" - ");
}

function deriveLabelSizeFromPackageId(packageId: string) {
  const sizeMatch = packageId.match(/(\d+x\d+)/i);
  return sizeMatch ? sizeMatch[1] : null;
}

export async function syncStoredDesignFromApprovedOrder(input: SyncStoredDesignInput) {
  const pkg = getPackageById(input.order.packageId);
  const labelSize = deriveLabelSizeFromPackageId(pkg?.id ?? input.order.packageId);

  const existing = await input.tx.storedDesign.findFirst({
    where: input.order.customerId
      ? {
          customerId: input.order.customerId,
          productSlug: input.order.productSlug,
          material: input.order.material,
          labelSize,
          archivedAt: null,
        }
      : {
          customerId: null,
          productSlug: input.order.productSlug,
          material: input.order.material,
          labelSize,
          archivedAt: null,
          lastOrder: {
            customerEmail: input.order.customerEmail,
          },
        },
    include: {
      artworkVersions: {
        orderBy: {
          versionNumber: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const storedDesign =
    existing ??
    (await input.tx.storedDesign.create({
      data: {
        customerId: input.order.customerId,
        name: buildStoredDesignName({
          companyName: input.order.companyName,
          customerName: input.order.customerName,
          productSlug: input.order.productSlug,
          material: input.order.material,
          labelSize,
        }),
        productSlug: input.order.productSlug,
        labelSize,
        material: input.order.material,
        defaultQuantity: input.order.quantity,
        status: "ACTIVE",
        lastOrderedAt: input.order.createdAt,
        lastOrderId: input.order.id,
        totalOrders: 0,
      },
    }));

  const latestVersionNumber = existing?.artworkVersions[0]?.versionNumber ?? 0;

  const artworkVersion = await input.tx.artworkVersion.create({
    data: {
      storedDesignId: storedDesign.id,
      versionNumber: latestVersionNumber + 1,
      versionLabel: `v${latestVersionNumber + 1}`,
      sourceType: input.sourceType,
      originalArtworkFileId: input.originalArtworkFileId ?? null,
      proofFileId: input.proofFileId ?? null,
      status: "APPROVED",
      changeSummary: input.changeSummary ?? null,
      approvedAt: new Date(),
    },
  });

  await input.tx.storedDesign.update({
    where: { id: storedDesign.id },
    data: {
      currentArtworkVersionId: artworkVersion.id,
      currentProofFileId: input.proofFileId ?? storedDesign.currentProofFileId,
      defaultQuantity: input.order.quantity,
      lastOrderedAt: input.order.createdAt,
      lastOrderId: input.order.id,
      totalOrders:
        existing && existing.lastOrderId !== input.order.id
          ? existing.totalOrders + 1
          : existing
            ? existing.totalOrders
            : 1,
      status: "ACTIVE",
    },
  });

  return artworkVersion;
}
