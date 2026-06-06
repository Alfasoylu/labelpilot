import {
  designServicePrice,
  expressPrice,
  extraDesignPrice,
  physicalProofPrice,
  type AddonSettingsInput,
} from "./addons.ts";

export const DEFAULT_ADDON_SETTINGS: AddonSettingsInput = {
  designServiceNet: 40,
  designServiceFreeThresholdNet: 2000,
  physicalProofNet: 10,
  expressNet: 9.9,
  extraDesignNet: 19,
};

export type CheckoutAddonsInput = {
  designService?: boolean;
  physicalProof?: boolean;
  express?: boolean;
  extraDesignCount?: number;
  customerUploadsOwnData?: boolean;
};

export type NormalizedCheckoutAddons = {
  designService: boolean;
  physicalProof: boolean;
  express: boolean;
  extraDesignCount: number;
  customerUploadsOwnData: boolean;
};

export type CheckoutAddonLineItem = {
  key: "designService" | "physicalProof" | "express" | "extraDesign";
  name: string;
  description: string;
  netAmount: number;
  grossAmountCents: number;
};

export type CheckoutAddonComputation = {
  normalizedAddons: NormalizedCheckoutAddons;
  baseNetTotal: number;
  designServiceCents: number | null;
  physicalProofCents: number | null;
  expressCents: number | null;
  extraDesignCount: number;
  extraDesignCents: number | null;
  addonsTotalCents: number;
  lineItems: CheckoutAddonLineItem[];
};

export function normalizeCheckoutAddons(
  addons: CheckoutAddonsInput | null | undefined,
): NormalizedCheckoutAddons {
  return {
    designService: addons?.designService === true,
    physicalProof: addons?.physicalProof === true,
    express: addons?.express === true,
    extraDesignCount:
      typeof addons?.extraDesignCount === "number" && addons.extraDesignCount > 0
        ? Math.floor(addons.extraDesignCount)
        : 0,
    customerUploadsOwnData: addons?.customerUploadsOwnData === true,
  };
}

export function netEuroToGrossCents(amountNet: number) {
  return Math.round(amountNet * 119);
}

export function buildCheckoutAddons(input: {
  featureEnabled: boolean;
  addons: CheckoutAddonsInput | null | undefined;
  baseGrossAmountCents: number;
  settings?: AddonSettingsInput | null;
}) {
  const normalizedAddons = normalizeCheckoutAddons(input.addons);
  const baseNetTotal = Math.round(input.baseGrossAmountCents / 1.19) / 100;
  const settings = input.settings ?? DEFAULT_ADDON_SETTINGS;

  // physicalProof is always active regardless of featureEnabled
  const physicalProofNet = normalizedAddons.physicalProof ? physicalProofPrice(settings) : 0;
  const physicalProofCents = normalizedAddons.physicalProof
    ? netEuroToGrossCents(physicalProofNet)
    : null;

  if (!input.featureEnabled) {
    const lineItems: CheckoutAddonLineItem[] = [];
    if (normalizedAddons.physicalProof) {
      lineItems.push({
        key: "physicalProof",
        name: "Physischer Andruck",
        description: "Gedruckter Andruck auf dem abgestimmten Material; digitaler Proof bleibt inklusive",
        netAmount: physicalProofNet,
        grossAmountCents: netEuroToGrossCents(physicalProofNet),
      });
    }
    return {
      normalizedAddons: {
        designService: false,
        physicalProof: normalizedAddons.physicalProof,
        express: false,
        extraDesignCount: 0,
        customerUploadsOwnData: normalizedAddons.customerUploadsOwnData,
      },
      baseNetTotal,
      designServiceCents: null,
      physicalProofCents,
      expressCents: null,
      extraDesignCount: 0,
      extraDesignCents: null,
      addonsTotalCents: physicalProofCents ?? 0,
      lineItems,
    } satisfies CheckoutAddonComputation;
  }

  const lineItems: CheckoutAddonLineItem[] = [];

  const designServiceNet = normalizedAddons.designService
    ? designServicePrice({
        orderNetTotal: baseNetTotal,
        customerUploadsOwnData: normalizedAddons.customerUploadsOwnData,
        settings,
      })
    : 0;
  const expressNet = normalizedAddons.express ? expressPrice(settings) : 0;
  const extraDesignNet = extraDesignPrice(normalizedAddons.extraDesignCount, settings);

  if (normalizedAddons.designService) {
    lineItems.push({
      key: "designService",
      name: "Designservice",
      description:
        designServiceNet === 0
          ? "Kostenlos ab 2.000 EUR netto oder bei druckfertigen Daten"
          : "Dateiaufbereitung und Druckdatenservice vor dem Proof",
      netAmount: designServiceNet,
      grossAmountCents: netEuroToGrossCents(designServiceNet),
    });
  }

  if (normalizedAddons.physicalProof) {
    lineItems.push({
      key: "physicalProof",
      name: "Physischer Andruck",
      description: "Gedruckter Andruck auf dem abgestimmten Material; digitaler Proof bleibt inklusive",
      netAmount: physicalProofNet,
      grossAmountCents: netEuroToGrossCents(physicalProofNet),
    });
  }

  if (normalizedAddons.express) {
    lineItems.push({
      key: "express",
      name: "Express",
      description: "Priorisierte Auftragsbearbeitung nach Ihrer Freigabe, keine separate SLA",
      netAmount: expressNet,
      grossAmountCents: netEuroToGrossCents(expressNet),
    });
  }

  if (normalizedAddons.extraDesignCount > 0) {
    lineItems.push({
      key: "extraDesign",
      name:
        normalizedAddons.extraDesignCount === 1
          ? "Zusatzdesign"
          : "Zusatzdesigns",
      description: `${normalizedAddons.extraDesignCount} weiteres Design neben dem enthaltenen Hauptdesign`,
      netAmount: extraDesignNet,
      grossAmountCents: netEuroToGrossCents(extraDesignNet),
    });
  }

  const designServiceCents =
    normalizedAddons.designService ? netEuroToGrossCents(designServiceNet) : null;
  const expressCents = normalizedAddons.express ? netEuroToGrossCents(expressNet) : null;
  const extraDesignCents =
    normalizedAddons.extraDesignCount > 0 ? netEuroToGrossCents(extraDesignNet) : null;
  const addonsTotalCents = lineItems.reduce(
    (sum, item) => sum + item.grossAmountCents,
    0,
  );

  return {
    normalizedAddons,
    baseNetTotal,
    designServiceCents,
    physicalProofCents,
    expressCents,
    extraDesignCount: normalizedAddons.extraDesignCount,
    extraDesignCents,
    addonsTotalCents,
    lineItems,
  } satisfies CheckoutAddonComputation;
}
