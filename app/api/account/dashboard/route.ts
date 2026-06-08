import { NextResponse } from "next/server";

import { getSupabaseUserFromRequest } from "@/lib/account/auth";
import { ensureCustomerForSupabaseUser } from "@/lib/account/customers";
import { getPrismaClient } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatOrderAmount(amountCents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amountCents / 100);
}

export async function GET(request: Request) {
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

  try {
    const customer = await ensureCustomerForSupabaseUser(prisma, auth.user);

    const [orders, storedDesigns] = await Promise.all([
      prisma.order.findMany({
        where: { customerId: customer.id },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          artworkStatus: true,
          productSlug: true,
          material: true,
          quantity: true,
          packageId: true,
          amountCents: true,
          currency: true,
          createdAt: true,
          updatedAt: true,
          reorderSourceDesignId: true,
          uploadToken: true,
          trackingUrl: true,
          proofFiles: {
            where: { status: "WAITING_CUSTOMER_APPROVAL" },
            select: {
              id: true,
              fileName: true,
              status: true,
              adminNote: true,
            },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        take: 25,
      }),
      prisma.storedDesign.findMany({
        where: {
          customerId: customer.id,
          archivedAt: null,
          status: "ACTIVE",
        },
        select: {
          id: true,
          name: true,
          productSlug: true,
          labelSize: true,
          material: true,
          defaultQuantity: true,
          status: true,
          currentArtworkVersionId: true,
          lastOrderedAt: true,
          totalOrders: true,
          lastOrder: {
            select: {
              id: true,
              orderNumber: true,
              createdAt: true,
            },
          },
          currentArtworkVersion: {
            select: {
              id: true,
              versionLabel: true,
              approvedAt: true,
              status: true,
              originalArtworkFile: {
                select: {
                  fileName: true,
                },
              },
              proofFile: {
                select: {
                  fileName: true,
                },
              },
            },
          },
          artworkVersions: {
            select: {
              id: true,
              versionLabel: true,
              approvedAt: true,
              status: true,
              originalArtworkFile: {
                select: {
                  fileName: true,
                },
              },
              proofFile: {
                select: {
                  fileName: true,
                },
              },
            },
            orderBy: { versionNumber: "desc" },
            take: 5,
          },
        },
        orderBy: [{ lastOrderedAt: "desc" }, { updatedAt: "desc" }],
        take: 50,
      }),
    ]);

    return NextResponse.json({
      customer: {
        email: customer.email,
        companyName: customer.companyName,
        contactName: customer.contactName,
        phone: customer.phone ?? null,
        street: customer.street ?? null,
        addressLine2: customer.addressLine2 ?? null,
        postalCode: customer.postalCode ?? null,
        city: customer.city ?? null,
        country: customer.country ?? null,
        vatId: customer.vatId ?? null,
        billingCompanyName: customer.billingCompanyName ?? null,
        billingStreet: customer.billingStreet ?? null,
        billingAddressLine2: customer.billingAddressLine2 ?? null,
        billingPostalCode: customer.billingPostalCode ?? null,
        billingCity: customer.billingCity ?? null,
        billingCountry: customer.billingCountry ?? null,
        notificationPrefs: (customer.notificationPrefs as Record<string, boolean> | null) ?? null,
        paymentTermsApproved: customer.paymentTermsApproved,
        paymentTermsNetDays: customer.paymentTermsNetDays ?? null,
      },
      orders: orders.map((order) => {
        const { uploadToken, proofFiles, ...rest } = order;
        const canOpenArtworkStep = !["PENDING_PAYMENT", "PAYMENT_FAILED", "CANCELLED"].includes(
          order.status,
        );
        return {
          ...rest,
          createdAt: order.createdAt.toISOString(),
          updatedAt: order.updatedAt.toISOString(),
          amountLabel: formatOrderAmount(order.amountCents),
          uploadHref:
            uploadToken && canOpenArtworkStep
              ? `/de/auftrag/${order.id}/druckdaten?token=${encodeURIComponent(uploadToken)}`
              : null,
          trackingUrl: order.trackingUrl ?? null,
          latestProof: proofFiles[0] ?? null,
        };
      }),
      storedDesigns: storedDesigns.map((design) => ({
        ...design,
        lastOrderedAt: design.lastOrderedAt?.toISOString() ?? null,
        lastOrder: design.lastOrder
          ? {
              ...design.lastOrder,
              createdAt: design.lastOrder.createdAt.toISOString(),
            }
          : null,
        currentArtworkVersion: design.currentArtworkVersion
          ? {
              ...design.currentArtworkVersion,
              approvedAt:
                design.currentArtworkVersion.approvedAt?.toISOString() ?? null,
            }
          : null,
        artworkVersions: design.artworkVersions.map((version) => ({
          ...version,
          approvedAt: version.approvedAt?.toISOString() ?? null,
        })),
      })),
    });
  } catch (error) {
    console.error("Kundenkonto-Dashboard fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Kundenkonto konnte nicht geladen werden." },
      { status: 500 },
    );
  }
}
