import type {
  CustomSizePriceInput,
  PricingMaterialKey,
  PricingMaterialParams,
  PricingSettingsInput,
} from "./custom-size";
import { computeCustomSizePrice } from "./custom-size.ts";

export const customSizeRequestSchemaValues = [
  "OPAQUE_PP",
  "TRANSPARENT_PP",
] as const satisfies readonly PricingMaterialKey[];

export type PublicCustomSizeRequest = {
  materialKey: PricingMaterialKey;
  widthMm: number;
  heightMm: number;
  quantity: number;
};

export type PublicCustomSizeResponse =
  | {
      configured: false;
    }
  | {
      configured: true;
      quoteRequired: boolean;
      netPrice: number;
      grossPrice: number;
    };

export function buildPublicCustomSizePriceResponse(input: {
  featureEnabled: boolean;
  request: PublicCustomSizeRequest;
  params: PricingMaterialParams | null;
  settings: PricingSettingsInput | null;
}) {
  if (!input.featureEnabled) {
    return {
      status: 404,
      body: null,
    } as const;
  }

  if (!input.params || !input.settings) {
    return {
      status: 200,
      body: {
        configured: false,
      } satisfies PublicCustomSizeResponse,
    } as const;
  }

  if (input.request.quantity >= 20_000) {
    return {
      status: 200,
      body: {
        configured: true,
        quoteRequired: true,
        netPrice: 0,
        grossPrice: 0,
      } satisfies PublicCustomSizeResponse,
    } as const;
  }

  const result = computeCustomSizePrice({
    materialKey: input.request.materialKey,
    widthMm: input.request.widthMm,
    heightMm: input.request.heightMm,
    quantity: input.request.quantity,
    params: input.params,
    settings: input.settings,
  } satisfies CustomSizePriceInput);

  return {
    status: 200,
    body: {
      configured: true,
      quoteRequired: result.quoteRequired,
      netPrice: result.netPrice,
      grossPrice: result.grossPrice,
    } satisfies PublicCustomSizeResponse,
  } as const;
}
