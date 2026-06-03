export function formatLeadDate(value: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function getLeadStatusLabel(status: string) {
  switch (status) {
    case "NEW":
      return "Neu";
    case "QUALIFYING":
      return "In Qualifizierung";
    case "QUALIFIED":
      return "Qualifiziert";
    case "SAMPLE_SENT":
      return "Muster versendet";
    case "QUOTE_NEEDED":
      return "Angebot noetig";
    case "QUOTE_SENT":
      return "Angebot gesendet";
    case "FOLLOW_UP":
      return "Follow-up";
    case "WON":
      return "Gewonnen";
    case "LOST":
      return "Verloren";
    case "DISQUALIFIED":
      return "Disqualifiziert";
    default:
      return status;
  }
}

export function getLeadSourceTypeFilterValue(input: string | null | undefined) {
  return input === "wunschformat" ? "wunschformat" : "all";
}

export function getLeadSourceTypeLabel(input: string | null | undefined) {
  return input === "WUNSCHFORMAT" ? "Wunschformat" : input || "Nicht angegeben";
}

export function buildLeadWhere(input: {
  status?: string;
  type?: string;
  sourceType?: string;
  q?: string;
}) {
  const where: Record<string, unknown> = {};

  if (input.status && input.status !== "all") {
    where.status = input.status;
  }

  if (input.type && input.type !== "all") {
    where.type = input.type;
  }

  if (input.sourceType === "wunschformat") {
    where.sourceType = "WUNSCHFORMAT";
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
