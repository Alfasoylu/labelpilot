import type { PrismaClient } from "@prisma/client";

export type CustomerAccessContext = {
  id?: string;
  uploadToken?: string;
  customerId: string | null;
  customerEmail: string;
  companyName: string | null;
  customerName: string | null;
};

function buildAccessibleStoredDesignWhere(access: CustomerAccessContext) {
  // REORDER-002: Only ACTIVE designs are reorderable. Designs under review or in other
  // non-active states must not be accessible for reorder.
  const baseFilter: Record<string, unknown> = {
    archivedAt: null,
    status: "ACTIVE",
  };

  // REORDER-004: When the caller is an authenticated Supabase user (customerId is non-null),
  // scope the query exclusively by customerId. The email-based ownership clauses are only
  // active for token-based (unauthenticated) access to prevent cross-customer design leakage
  // when two customers share the same email address.
  if (access.customerId) {
    return {
      ...baseFilter,
      customerId: access.customerId,
    };
  }

  const ownershipClauses: Array<Record<string, unknown>> = [
    {
      lastOrder: {
        customerEmail: access.customerEmail,
      },
    },
    {
      artworkVersions: {
        some: {
          OR: [
            {
              originalArtworkFile: {
                order: {
                  customerEmail: access.customerEmail,
                },
              },
            },
            {
              proofFile: {
                order: {
                  customerEmail: access.customerEmail,
                },
              },
            },
          ],
        },
      },
    },
  ];

  return {
    ...baseFilter,
    OR: ownershipClauses,
  };
}

// REORDER-001: Only orders in a completed/active lifecycle grant token-based reorder access.
// CANCELLED, PENDING_PAYMENT, and PAYMENT_FAILED orders must not allow a token holder to
// place a new real order charged to the customer's email.
const INELIGIBLE_TOKEN_ACCESS_STATUSES = new Set([
  "CANCELLED",
  "PENDING_PAYMENT",
  "PAYMENT_FAILED",
]);

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
      status: true,
      customerId: true,
      customerEmail: true,
      companyName: true,
      customerName: true,
    },
  });

  if (!order || order.uploadToken !== token) {
    return null;
  }

  if (INELIGIBLE_TOKEN_ACCESS_STATUSES.has(order.status)) {
    return null;
  }

  return {
    id: order.id,
    uploadToken: order.uploadToken,
    customerId: order.customerId,
    customerEmail: order.customerEmail,
    companyName: order.companyName,
    customerName: order.customerName,
  } satisfies CustomerAccessContext;
}

export async function getCustomerAccountAccessContext(
  prisma: PrismaClient,
  customerId: string,
) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: {
      id: true,
      email: true,
      companyName: true,
      contactName: true,
    },
  });

  if (!customer) {
    return null;
  }

  return {
    customerId: customer.id,
    customerEmail: customer.email,
    companyName: customer.companyName,
    customerName: customer.contactName,
  } satisfies CustomerAccessContext;
}

export async function listAccessibleStoredDesigns(
  prisma: PrismaClient,
  access: CustomerAccessContext,
) {
  return prisma.storedDesign.findMany({
    where: buildAccessibleStoredDesignWhere(access),
    include: {
      currentArtworkVersion: {
        select: {
          id: true,
          versionLabel: true,
          approvedAt: true,
          status: true,
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
      ...buildAccessibleStoredDesignWhere(access),
    },
    include: {
      currentArtworkVersion: {
        select: {
          id: true,
          versionLabel: true,
          approvedAt: true,
          status: true,
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
        select: {
          id: true,
          versionNumber: true,
          versionLabel: true,
          approvedAt: true,
          status: true,
          sourceType: true,
          changeSummary: true,
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
