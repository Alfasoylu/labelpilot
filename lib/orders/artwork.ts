type ArtworkFileStatusValue =
  | "UPLOADED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "CORRECTION_REQUIRED";

type ArtworkStatusValue =
  | "AWAITING_ARTWORK"
  | "ARTWORK_UPLOADED"
  | "ARTWORK_APPROVED";

export function getArtworkFileStatusLabel(status: ArtworkFileStatusValue) {
  switch (status) {
    case "UPLOADED":
      return "Datei erhalten";
    case "UNDER_REVIEW":
      return "Wird geprueft";
    case "APPROVED":
      return "Freigegeben";
    case "CORRECTION_REQUIRED":
      return "Korrektur erforderlich";
    default:
      return status;
  }
}

export function getArtworkStatusLabel(status: ArtworkStatusValue | null) {
  switch (status) {
    case "ARTWORK_UPLOADED":
      return "Druckdaten erhalten";
    case "ARTWORK_APPROVED":
      return "Druckdaten freigegeben";
    case "AWAITING_ARTWORK":
    default:
      return "Druckdaten fehlen noch";
  }
}

export function getMaterialLabel(material: string) {
  return material === "TRANSPARENT" ? "Transparentes PP" : "Opakes PP";
}

export function getOrderStatusLabel(status: string) {
  switch (status) {
    case "PENDING_PAYMENT":
      return "Wartet auf Zahlung";
    case "PAID":
      return "Bezahlt";
    case "FILE_REVIEW":
      return "Dateipruefung";
    case "CORRECTION_REQUIRED":
      return "Korrektur erforderlich";
    case "ON_HOLD":
      return "Wartet auf Rueckmeldung";
    case "APPROVED_FOR_PRODUCTION":
      return "Fuer Produktion freigegeben";
    default:
      return status;
  }
}
