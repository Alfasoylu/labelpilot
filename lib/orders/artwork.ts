type ArtworkFileStatusValue =
  | "UPLOADED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "CORRECTION_REQUIRED";

type ArtworkStatusValue =
  | "AWAITING_ARTWORK"
  | "ARTWORK_UPLOADED"
  | "ARTWORK_APPROVED";

type ProofFileStatusValue =
  | "NOT_REQUIRED"
  | "PENDING_ADMIN_UPLOAD"
  | "WAITING_CUSTOMER_APPROVAL"
  | "APPROVED"
  | "CHANGES_REQUESTED"
  | "SUPERSEDED";

export function getArtworkFileStatusLabel(status: ArtworkFileStatusValue) {
  switch (status) {
    case "UPLOADED":
      return "Datei erhalten";
    case "UNDER_REVIEW":
      return "Wird geprüft";
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

export function getProofFileStatusLabel(status: ProofFileStatusValue) {
  switch (status) {
    case "NOT_REQUIRED":
      return "Kein Proof erforderlich";
    case "PENDING_ADMIN_UPLOAD":
      return "Proof wird vorbereitet";
    case "WAITING_CUSTOMER_APPROVAL":
      return "Proof wartet auf Freigabe";
    case "APPROVED":
      return "Proof freigegeben";
    case "CHANGES_REQUESTED":
      return "Änderungswunsch gesendet";
    case "SUPERSEDED":
      return "Durch neueren Proof ersetzt";
    default:
      return status;
  }
}

export function getMaterialLabel(material: string) {
  return material === "TRANSPARENT" ? "Transparentes PP" : "Opakes PP";
}

export function formatFinishing(finishing: string | null | undefined) {
  return finishing === "GLAENZEND" ? "Glänzend" : "Matt";
}

export function getOrderStatusLabel(status: string) {
  switch (status) {
    case "PENDING_PAYMENT":
      return "Wartet auf Zahlung";
    case "PAID":
      return "Bezahlt";
    case "FILE_REVIEW":
      return "Dateiprüfung";
    case "CORRECTION_REQUIRED":
      return "Korrektur erforderlich";
    case "ON_HOLD":
      return "Wartet auf Rückmeldung";
    case "APPROVED_FOR_PRODUCTION":
      return "Für Produktion freigegeben";
    case "PROOF_REQUIRED":
      return "Proof wird vorbereitet";
    case "WAITING_CUSTOMER_APPROVAL":
      return "Proof wartet auf Freigabe";
    default:
      return status;
  }
}
