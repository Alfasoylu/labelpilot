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

export function buildLeadWhere(input: {
  status?: string;
  type?: string;
  q?: string;
}) {
  const where: Record<string, unknown> = {};

  if (input.status && input.status !== "all") {
    where.status = input.status;
  }

  if (input.type && input.type !== "all") {
    where.type = input.type;
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
