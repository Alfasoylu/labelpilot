export const ADMIN_REVIEWABLE_STATUSES = [
  "FILE_REVIEW",
  "CORRECTION_REQUIRED",
  "PROOF_REQUIRED",
  "WAITING_CUSTOMER_APPROVAL",
  "APPROVED_FOR_PRODUCTION",
] as const;

export const ADMIN_ORDER_ADDONS_OR = [
  { designServiceCents: { not: null } },
  { physicalProofCents: { not: null } },
  { expressCents: { not: null } },
  { extraDesignCount: { gt: 0 } },
  { addonsTotalCents: { not: null } },
] as const;

export function buildAdminOrdersWhere(input: {
  status?: string;
  artworkStatus?: string;
}) {
  const where: Record<string, unknown> = {};

  if (input.status === "review-needed") {
    where.OR = [
      {
        status: {
          in: ["FILE_REVIEW", "CORRECTION_REQUIRED"],
        },
      },
      {
        artworkStatus: "ARTWORK_UPLOADED",
      },
    ];
  } else if (input.status && input.status !== "all") {
    where.status = input.status as never;
  }

  if (
    input.artworkStatus &&
    input.artworkStatus !== "all" &&
    input.artworkStatus !== "undefined"
  ) {
    where.artworkStatus = input.artworkStatus as never;
  }

  return where;
}

export function buildAdminOrdersListWhere(input: {
  status?: string;
  artworkStatus?: string;
  q?: string;
  addons?: string;
}) {
  const where = buildAdminOrdersWhere(input) as Record<string, unknown>;
  const andClauses: Array<Record<string, unknown>> = [];
  const query = input.q?.trim() ?? "";

  if (query) {
    andClauses.push({
      OR: [
        { orderNumber: { contains: query, mode: "insensitive" } },
        { customerEmail: { contains: query, mode: "insensitive" } },
        { companyName: { contains: query, mode: "insensitive" } },
      ],
    });
  }

  if (input.addons === "with") {
    andClauses.push({
      OR: [...ADMIN_ORDER_ADDONS_OR],
    });
  }

  if (andClauses.length > 0) {
    where.AND = andClauses;
  }

  return where;
}

export function hasOrderAddons(order: {
  designServiceCents: number | null;
  physicalProofCents: number | null;
  expressCents: number | null;
  extraDesignCount: number;
  addonsTotalCents: number | null;
}) {
  return (
    order.designServiceCents != null ||
    order.physicalProofCents != null ||
    order.expressCents != null ||
    order.extraDesignCount > 0 ||
    order.addonsTotalCents != null
  );
}

export function formatAdminDate(value: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function formatCurrencyFromCents(amountCents: number, currency = "EUR") {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
  }).format(amountCents / 100);
}

export function getShippingModeLabel(value: string | null | undefined) {
  switch (value) {
    case "DIRECT_TR":
      return "Direktversand Türkei → Deutschland";
    case "CONSOLIDATED":
      return "Sammelversand / Teilladung";
    case "DE_HUB":
      return "Versand über Deutschland-Hub";
    default:
      return value ?? "Nicht angegeben";
  }
}
