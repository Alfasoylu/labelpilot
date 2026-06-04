export function formatQuoteDate(value: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function getQuoteStatusLabel(status: string) {
  switch (status) {
    case "NEW":
      return "Neu";
    case "UNDER_REVIEW":
      return "In Prüfung";
    case "NEEDS_MORE_INFO":
      return "Weitere Informationen benötigt";
    case "QUOTE_SENT":
      return "Angebot gesendet";
    case "ACCEPTED":
      return "Akzeptiert";
    case "REJECTED":
      return "Abgelehnt";
    case "EXPIRED":
      return "Abgelaufen";
    case "CONVERTED_TO_ORDER":
      return "In Bestellung umgewandelt";
    default:
      return status;
  }
}

export function getQuoteSourceFilterValue(input: string | null | undefined) {
  return input === "wunschformat" ? "wunschformat" : "all";
}

export function buildQuoteWhere(input: {
  status?: string;
  source?: string;
  q?: string;
}) {
  const where: Record<string, unknown> = {};

  if (input.status && input.status !== "all") {
    where.status = input.status;
  }

  if (input.source === "wunschformat") {
    where.source = "WUNSCHFORMAT";
  }

  if (input.q) {
    where.OR = [
      { companyName: { contains: input.q, mode: "insensitive" } },
      { contactName: { contains: input.q, mode: "insensitive" } },
      { email: { contains: input.q, mode: "insensitive" } },
    ];
  }

  return where;
}
