import type { PrismaClient } from "@prisma/client";
import type { User } from "@supabase/supabase-js";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getMetadataString(
  metadata: Record<string, unknown> | undefined,
  keys: string[],
) {
  for (const key of keys) {
    const value = metadata?.[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

export async function ensureCustomerForSupabaseUser(
  prisma: PrismaClient,
  user: User,
) {
  if (!user.email) {
    throw new Error("Supabase user has no email.");
  }

  const email = normalizeEmail(user.email);
  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const companyName = getMetadataString(metadata, ["companyName", "company_name", "firma"]);
  const contactName = getMetadataString(metadata, ["contactName", "contact_name", "name"]);
  const phone = getMetadataString(metadata, ["phone", "telefon"]);

  const existing =
    (await prisma.customer.findUnique({
      where: { authUserId: user.id },
    })) ??
    (await prisma.customer.findUnique({
      where: { email },
    }));

  const customer = existing
    ? await prisma.customer.update({
        where: { id: existing.id },
        data: {
          authUserId: existing.authUserId ?? user.id,
          companyName: existing.companyName ?? companyName,
          contactName: existing.contactName ?? contactName,
          phone: existing.phone ?? phone,
        },
      })
    : await prisma.customer.create({
        data: {
          authUserId: user.id,
          email,
          companyName,
          contactName,
          phone,
        },
      });

  const matchingOrders = await prisma.order.findMany({
    where: {
      customerEmail: {
        equals: email,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
    },
    take: 500,
  });
  const orderIds = matchingOrders.map((order) => order.id);

  if (orderIds.length > 0) {
    await prisma.$transaction([
      prisma.order.updateMany({
        where: {
          id: { in: orderIds },
          OR: [{ customerId: null }, { customerId: customer.id }],
        },
        data: {
          customerId: customer.id,
        },
      }),
      prisma.storedDesign.updateMany({
        where: {
          lastOrderId: { in: orderIds },
          OR: [{ customerId: null }, { customerId: customer.id }],
        },
        data: {
          customerId: customer.id,
        },
      }),
    ]);
  }

  return customer;
}
