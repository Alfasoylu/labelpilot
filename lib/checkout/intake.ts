import { z } from "zod";

import type { PackageMaterial, ProductSlug } from "@/lib/commerce/packages";

// Optional separate billing address (Rechnungsadresse). When billingDiffers is
// true the billing fields are required; otherwise billing equals the delivery
// address and the fields are ignored.
const billingAddressFields = {
  billingDiffers: z.boolean().optional(),
  billingCompanyName: z.string().trim().max(160).optional().or(z.literal("")),
  billingStreetAddress: z.string().trim().max(160).optional().or(z.literal("")),
  billingAddressLine2: z.string().trim().max(160).optional().or(z.literal("")),
  billingPostalCode: z.string().trim().max(20).optional().or(z.literal("")),
  billingCity: z.string().trim().max(120).optional().or(z.literal("")),
  billingCountry: z.string().trim().max(60).optional().or(z.literal("")),
} as const;

function requireBillingWhenDiffering(
  data: {
    billingDiffers?: boolean;
    billingStreetAddress?: string;
    billingPostalCode?: string;
    billingCity?: string;
  },
  ctx: z.RefinementCtx,
) {
  if (!data.billingDiffers) return;
  if (!data.billingStreetAddress) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["billingStreetAddress"], message: "Rechnungsadresse: Straße erforderlich." });
  }
  if (!data.billingCity) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["billingCity"], message: "Rechnungsadresse: Stadt erforderlich." });
  }
  if (!data.billingPostalCode || !/^\d{5}$/.test(data.billingPostalCode)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["billingPostalCode"], message: "Rechnungsadresse: gültige 5-stellige PLZ erforderlich." });
  }
}

export const checkoutAddonSchema = z.object({
  designService: z.boolean().optional(),
  physicalProof: z.boolean().optional(),
  express: z.boolean().optional(),
  extraDesignCount: z.number().int().min(0).max(4).optional(),
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
  // CHK-006: Require at least 7 characters for a plausible phone number.
  phone: z.string().trim().min(7).max(60),
  vatId: z.string().trim().max(80).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  streetAddress: z.string().trim().min(1).max(160),
  addressLine2: z.string().trim().max(160).optional().or(z.literal("")),
  // CHK-006: Enforce 5-digit German postal code.
  postalCode: z.string().trim().regex(/^\d{5}$/, "Ungültige PLZ – bitte eine gültige 5-stellige Postleitzahl eingeben."),
  city: z.string().trim().min(1).max(120),
  country: z.string().trim().min(1).max(60).default("DE"),
  finishing: z.enum(["MATT", "GLAENZEND"]).optional(),
  rollKern: z.string().trim().max(60).optional().or(z.literal("")),
  abrollrichtung: z.string().trim().max(80).optional().or(z.literal("")),
  maxRollendurchmesser: z.string().trim().max(60).optional().or(z.literal("")),
  maschineName: z.string().trim().max(200).optional().or(z.literal("")),
  artworkStatus: checkoutArtworkInputStatusSchema,
  addons: checkoutAddonSchema.optional(),
  ...billingAddressFields,
}).superRefine(requireBillingWhenDiffering);

export type CheckoutIntakeInput = z.infer<typeof checkoutIntakeSchema>;
export type CheckoutAddonInput = z.infer<typeof checkoutAddonSchema>;
export type CheckoutArtworkInputStatus = z.infer<
  typeof checkoutArtworkInputStatusSchema
>;

const contactAddressFields = {
  companyName: z.string().trim().min(1).max(160),
  contactName: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  // CHK-006: Require at least 7 characters for a plausible phone number.
  phone: z.string().trim().min(7).max(60),
  vatId: z.string().trim().max(80).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  streetAddress: z.string().trim().min(1).max(160),
  addressLine2: z.string().trim().max(160).optional().or(z.literal("")),
  // CHK-006: Enforce 5-digit German postal code.
  postalCode: z.string().trim().regex(/^\d{5}$/, "Ungültige PLZ – bitte eine gültige 5-stellige Postleitzahl eingeben."),
  city: z.string().trim().min(1).max(120),
  country: z.string().trim().min(1).max(60).default("DE"),
  rollKern: z.string().trim().max(60).optional().or(z.literal("")),
  abrollrichtung: z.string().trim().max(80).optional().or(z.literal("")),
  maxRollendurchmesser: z.string().trim().max(60).optional().or(z.literal("")),
  maschineName: z.string().trim().max(200).optional().or(z.literal("")),
  artworkStatus: checkoutArtworkInputStatusSchema,
  addons: checkoutAddonSchema.optional(),
} as const;

export const customSizeCheckoutIntakeSchema = z.object({
  materialKey: z.enum(["OPAQUE_PP", "TRANSPARENT_PP"]),
  form: z.enum(["RECHTECKIG", "OVAL"]).optional(),
  widthMm: z.number().int().min(10).max(500),
  heightMm: z.number().int().min(10).max(1000),
  quantity: z.number().int().positive(),
  finishing: z.enum(["MATT", "GLAENZEND"]).optional(),
  tiefkuehlgeeignet: z.boolean().optional().default(false),
  farbigkeit: z.number().int().min(1).max(4).optional(),
  weissunterdruck: z.boolean().optional(),
  anzahlSorten: z.number().int().min(1).max(20).optional(),
  klebertyp: z.enum(["PERMANENT", "WIEDERABLOESBAR"]).optional(),
  uvLack: z.enum(["KEIN", "GLAENZEND"]).optional(),
  cornerRadius: z.number().int().min(0).max(3).optional(),
  designService: z.boolean().optional(),
  ...contactAddressFields,
  ...billingAddressFields,
}).superRefine(requireBillingWhenDiffering);

export type CustomSizeCheckoutIntakeInput = z.infer<typeof customSizeCheckoutIntakeSchema>;

export type CheckoutSearchParams = {
  packageId: string;
  productSlug: ProductSlug;
  material: PackageMaterial;
  quantity: number;
  finishing: "MATT" | "GLAENZEND";
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
  const finishingParam = getSingle("finishing");
  const finishing: "MATT" | "GLAENZEND" =
    finishingParam === "GLAENZEND" ? "GLAENZEND" : "MATT";

  return {
    packageId,
    productSlug,
    material,
    quantity,
    finishing,
    addons: {
      designService: parseBoolean("designService"),
      physicalProof: parseBoolean("physicalProof"),
      express: parseBoolean("express"),
      customerUploadsOwnData: parseBoolean("customerUploadsOwnData"),
      extraDesignCount,
    },
  };
}
