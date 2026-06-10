export type ProductSlug = "opake-pp-etiketten" | "transparente-pp-etiketten";
export type PackageMaterial = "OPAQUE" | "TRANSPARENT";

export type CommercePackage = {
  id: string;
  productSlug: ProductSlug;
  material: PackageMaterial;
  quantity: number;
  label: string;
  grossAmountCents: number;
};

export const PACKAGES: CommercePackage[] = [
  {
    id: "test-10-eur",
    productSlug: "opake-pp-etiketten",
    material: "OPAQUE",
    quantity: 1,
    label: "Interner Testauftrag",
    grossAmountCents: 1000,
  },
  {
    id: "opaque-pp-100x200-1000",
    productSlug: "opake-pp-etiketten",
    material: "OPAQUE",
    quantity: 1000,
    label: "Pilotauflage",
    grossAmountCents: 21301,
  },
  {
    id: "opaque-pp-100x200-2000",
    productSlug: "opake-pp-etiketten",
    material: "OPAQUE",
    quantity: 2000,
    label: "Folgeauflage",
    grossAmountCents: 33201,
  },
  {
    id: "opaque-pp-100x200-5000",
    productSlug: "opake-pp-etiketten",
    material: "OPAQUE",
    quantity: 5000,
    label: "Standard",
    grossAmountCents: 57001,
  },
  {
    id: "opaque-pp-100x200-10000",
    productSlug: "opake-pp-etiketten",
    material: "OPAQUE",
    quantity: 10000,
    label: "Serie",
    grossAmountCents: 95081,
  },
  {
    id: "transparent-pp-100x200-1000",
    productSlug: "transparente-pp-etiketten",
    material: "TRANSPARENT",
    quantity: 1000,
    label: "Pilotauflage",
    grossAmountCents: 23681,
  },
  {
    id: "transparent-pp-100x200-2000",
    productSlug: "transparente-pp-etiketten",
    material: "TRANSPARENT",
    quantity: 2000,
    label: "Folgeauflage",
    grossAmountCents: 36771,
  },
  {
    id: "transparent-pp-100x200-5000",
    productSlug: "transparente-pp-etiketten",
    material: "TRANSPARENT",
    quantity: 5000,
    label: "Standard",
    grossAmountCents: 61761,
  },
  {
    id: "transparent-pp-100x200-10000",
    productSlug: "transparente-pp-etiketten",
    material: "TRANSPARENT",
    quantity: 10000,
    label: "Serie",
    grossAmountCents: 101031,
  },
];

const expectedGrossCentsById: Record<string, number> = {
  "test-10-eur": 1000,
  "opaque-pp-100x200-1000": 21301,
  "opaque-pp-100x200-2000": 33201,
  "opaque-pp-100x200-5000": 57001,
  "opaque-pp-100x200-10000": 95081,
  "transparent-pp-100x200-1000": 23681,
  "transparent-pp-100x200-2000": 36771,
  "transparent-pp-100x200-5000": 61761,
  "transparent-pp-100x200-10000": 101031,
};

for (const pkg of PACKAGES) {
  if (expectedGrossCentsById[pkg.id] !== pkg.grossAmountCents) {
    throw new Error(`Ungültige Paketkonfiguration für ${pkg.id}.`);
  }
}

export function findPackageByConfig(input: {
  productSlug: ProductSlug;
  material: PackageMaterial;
  quantity: number;
  packageId?: string;
}) {
  return PACKAGES.find((pkg) => {
    const matchesCore =
      pkg.productSlug === input.productSlug &&
      pkg.material === input.material &&
      pkg.quantity === input.quantity;

    if (!matchesCore) {
      return false;
    }

    if (input.packageId) {
      return pkg.id === input.packageId;
    }

    return true;
  });
}

export function getPackageById(packageId: string) {
  return PACKAGES.find((pkg) => pkg.id === packageId) ?? null;
}

export function formatGrossAmountForStripe(amountCents: number) {
  return amountCents;
}
