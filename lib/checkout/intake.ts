import { z } from "zod";

import type { PackageMaterial, ProductSlug } from "@/lib/commerce/packages";

export const checkoutAddonSchema = z.object({
  designService: z.boolean().optional(),
  physicalProof: z.boolean().optional(),
  express: z.boolean().optional(),
  extraDesignCount: z.number().int().min(0).optional(),
  customerUploadsOwnData: z.boolean().optional(),
});

export const checkoutArtworkInputStatusSchema = z.enum([
  "artwork_ready",
  "upload_after_order",
  "needs_help",
]);

export const checkoutIntakeSchema = z.object({
  packageId: z.string().min(1),
  productSlug: z.enum(["opake-pp-etiketten", "transparente-pp-etiketten"]),
  material: z.enum(["OPAQUE", "TRANSPARENT"]),
  quantity: z.number().int().positive(),
  companyName: z.string().trim().min(1).max(160),
  contactName: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1).max(60),
  vatId: z.string().trim().max(80).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  streetAddress: z.string().trim().min(1).max(160),
  addressLine2: z.string().trim().max(160).optional().or(z.literal("")),
  postalCode: z.string().trim().min(1).max(20),
  city: z.string().trim().min(1).max(120),
  country: z.string().trim().min(1).max(60).default("DE"),
  artworkStatus: checkoutArtworkInputStatusSchema,
  addons: checkoutAddonSchema.optional(),
});

export type CheckoutIntakeInput = z.infer<typeof checkoutIntakeSchema>;
export type CheckoutAddonInput = z.infer<typeof checkoutAddonSchema>;
export type CheckoutArtworkInputStatus = z.infer<
  typeof checkoutArtworkInputStatusSchema
>;

export type CheckoutSearchParams = {
  packageId: string;
  productSlug: ProductSlug;
  material: PackageMaterial;
  quantity: number;
  addons: CheckoutAddonInput;
};

export function parseCheckoutSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): CheckoutSearchParams | null {
  const getSingle = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const productSlug = getSingle("productSlug");
  const material = getSingle("material");
  const packageId = getSingle("packageId");
  const quantity = Number.parseInt(getSingle("quantity") ?? "", 10);

  if (
    !packageId ||
    (productSlug !== "opake-pp-etiketten" &&
      productSlug !== "transparente-pp-etiketten") ||
    (material !== "OPAQUE" && material !== "TRANSPARENT") ||
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    return null;
  }

  const parseBoolean = (key: string) => getSingle(key) === "1";
  const extraDesignCount = Math.max(
    0,
    Number.parseInt(getSingle("extraDesignCount") ?? "0", 10) || 0,
  );

  return {
    packageId,
    productSlug,
    material,
    quantity,
    addons: {
      designService: parseBoolean("designService"),
      physicalProof: parseBoolean("physicalProof"),
      express: parseBoolean("express"),
      customerUploadsOwnData: parseBoolean("customerUploadsOwnData"),
      extraDesignCount,
    },
  };
}
