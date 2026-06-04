const artworkRules = {
  pdf: {
    maxBytes: 50 * 1024 * 1024,
    mimeTypes: ["application/pdf"],
  },
  ai: {
    maxBytes: 100 * 1024 * 1024,
    mimeTypes: [
      "application/postscript",
      "application/illustrator",
      "application/octet-stream",
      "application/pdf",
    ],
  },
  eps: {
    maxBytes: 100 * 1024 * 1024,
    mimeTypes: [
      "application/postscript",
      "application/eps",
      "application/octet-stream",
    ],
  },
  svg: {
    maxBytes: 25 * 1024 * 1024,
    mimeTypes: ["image/svg+xml", "application/svg+xml", "text/plain"],
  },
  png: {
    maxBytes: 50 * 1024 * 1024,
    mimeTypes: ["image/png"],
  },
  jpg: {
    maxBytes: 50 * 1024 * 1024,
    mimeTypes: ["image/jpeg"],
  },
  jpeg: {
    maxBytes: 50 * 1024 * 1024,
    mimeTypes: ["image/jpeg"],
  },
  zip: {
    maxBytes: 150 * 1024 * 1024,
    mimeTypes: [
      "application/zip",
      "application/x-zip-compressed",
      "application/octet-stream",
      "multipart/x-zip",
    ],
  },
} as const;

const proofRules = {
  pdf: {
    maxBytes: 25 * 1024 * 1024,
    mimeTypes: ["application/pdf"],
  },
  png: {
    maxBytes: 25 * 1024 * 1024,
    mimeTypes: ["image/png"],
  },
  jpg: {
    maxBytes: 25 * 1024 * 1024,
    mimeTypes: ["image/jpeg"],
  },
  jpeg: {
    maxBytes: 25 * 1024 * 1024,
    mimeTypes: ["image/jpeg"],
  },
} as const;

function getExtension(fileName: string) {
  const normalized = fileName.trim().toLowerCase();
  const dotIndex = normalized.lastIndexOf(".");

  if (dotIndex === -1) {
    return "";
  }

  return normalized.slice(dotIndex + 1);
}

export function sanitizeFileName(fileName: string) {
  const normalized = fileName.normalize("NFKD");
  const sanitized = normalized
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return sanitized.length > 0 ? sanitized.toLowerCase() : "druckdatei";
}

export function getArtworkFileRequirementsText() {
  return "Bevorzugte Formate: PDF, AI oder EPS. Weitere akzeptierte Formate: SVG, PNG, JPG oder ZIP.";
}

export function getProofFileRequirementsText() {
  return "Proof-Dateien: PDF, PNG oder JPG bis 25 MB.";
}

export function validateArtworkFile(file: File) {
  const extension = getExtension(file.name);

  if (!(extension in artworkRules)) {
    return {
      ok: false as const,
      message: "Dieses Dateiformat wird nicht unterstützt.",
    };
  }

  const rule = artworkRules[extension as keyof typeof artworkRules];
  const mimeTypes = [...rule.mimeTypes] as string[];

  if (file.size > rule.maxBytes) {
    return {
      ok: false as const,
      message:
        "Die Datei ist zu gross. Bitte laden Sie eine kleinere Datei hoch oder kontaktieren Sie uns.",
    };
  }

  if (file.type && !mimeTypes.includes(file.type)) {
    return {
      ok: false as const,
      message: "Dieses Dateiformat wird nicht unterstützt.",
    };
  }

  return {
    ok: true as const,
    extension,
    sanitizedFileName: sanitizeFileName(file.name),
  };
}

export function validateProofFile(file: File) {
  const extension = getExtension(file.name);

  if (!(extension in proofRules)) {
    return {
      ok: false as const,
      message: "Dieses Dateiformat wird nicht unterstützt.",
    };
  }

  const rule = proofRules[extension as keyof typeof proofRules];
  const mimeTypes = [...rule.mimeTypes] as string[];

  if (file.size > rule.maxBytes) {
    return {
      ok: false as const,
      message:
        "Die Datei ist zu gross. Bitte laden Sie eine kleinere Datei hoch oder kontaktieren Sie uns.",
    };
  }

  if (file.type && !mimeTypes.includes(file.type)) {
    return {
      ok: false as const,
      message: "Dieses Dateiformat wird nicht unterstützt.",
    };
  }

  return {
    ok: true as const,
    extension,
    sanitizedFileName: sanitizeFileName(file.name),
  };
}
