export type AddonSettingsInput = {
  designServiceNet: number;
  designServiceFreeThresholdNet: number;
  physicalProofNet: number;
  expressNet: number;
  extraDesignNet: number;
};

export function designServicePrice(input: {
  orderNetTotal: number;
  customerUploadsOwnData: boolean;
  settings: AddonSettingsInput;
}) {
  const { orderNetTotal, customerUploadsOwnData, settings } = input;

  if (
    customerUploadsOwnData ||
    orderNetTotal >= settings.designServiceFreeThresholdNet
  ) {
    return 0;
  }

  return settings.designServiceNet;
}

export function physicalProofPrice(settings: AddonSettingsInput) {
  return settings.physicalProofNet;
}

export function expressPrice(settings: AddonSettingsInput) {
  return settings.expressNet;
}

export function extraDesignPrice(
  extraDesignCount: number,
  settings: AddonSettingsInput,
) {
  if (extraDesignCount <= 0) {
    return 0;
  }

  return extraDesignCount * settings.extraDesignNet;
}
