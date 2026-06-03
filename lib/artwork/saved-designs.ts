import type { PrismaClient } from "@prisma/client";

type CustomerAccessContext = {
  id: string;
  uploadToken: string;
  customerEmail: string;
  companyName: string | null;
  customerName: string | null;
};

function buildAccessibleStoredDesignWhere(customerEmail: string) {
  return {
    archivedAt: null,
    OR: [
      {
        lastOrder: {
          customerEmail,
        },
      },
      {
        artworkVersions: {
          some: {
            OR: [
              {
                originalArtworkFile: {
                  order: {
                    customerEmail,
                  },
                },
              },
              {
                proofFile: {
                  order: {
                    customerEmail,
                  },
                },
              },
            ],
          },
        },
      },
    ],
  };
}

export async function getCustomerAccessContext(
  prisma: PrismaClient,
  orderId: string,
  token: string,
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      uploadToken: true,
      customerEmail: true,
      companyName: true,
      customerName: true,
    },
  });

  if (!order || order.uploadToken !== token) {
    return null;
  }

  return order satisfies CustomerAccessContext;
}

export async function listAccessibleStoredDesigns(
  prisma: PrismaClient,
  access: CustomerAccessContext,
) {
  return prisma.storedDesign.findMany({
    where: buildAccessibleStoredDesignWhere(access.customerEmail),
    include: {
      currentArtworkVersion: {
        select: {
          id: true,
          versionLabel: true,
          approvedAt: true,
        },
      },
      lastOrder: {
        select: {
          id: true,
          orderNumber: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          artworkVersions: true,
        },
      },
    },
    orderBy: [{ lastOrderedAt: "desc" }, { updatedAt: "desc" }],
    take: 100,
  });
}

export async function getAccessibleStoredDesignDetail(
  prisma: PrismaClient,
  designId: string,
  access: CustomerAccessContext,
) {
  return prisma.storedDesign.findFirst({
    where: {
      id: designId,
      ...buildAccessibleStoredDesignWhere(access.customerEmail),
    },
    include: {
      currentArtworkVersion: {
        select: {
          id: true,
          versionLabel: true,
        },
      },
      lastOrder: {
        select: {
          id: true,
          orderNumber: true,
          createdAt: true,
          customerEmail: true,
        },
      },
      artworkVersions: {
        include: {
          originalArtworkFile: {
            select: {
              id: true,
              fileName: true,
              storagePath: true,
              createdAt: true,
              order: {
                select: {
                  id: true,
                  customerEmail: true,
                },
              },
            },
          },
          proofFile: {
            select: {
              id: true,
              fileName: true,
              storagePath: true,
              createdAt: true,
              order: {
                select: {
                  id: true,
                  customerEmail: true,
                },
              },
            },
          },
        },
        orderBy: [{ versionNumber: "desc" }],
      },
    },
  });
}

export function formatStoredDesignDate(value: Date | null) {
  if (!value) {
    return "Nicht vorhanden";
  }

  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}
