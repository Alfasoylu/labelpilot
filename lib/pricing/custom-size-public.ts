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
  colorCount: number;
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
      breakdown: {
        inkCostNet: number;
        plateCostNet: number;
        materialCostNet: number;
      };
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

  const result = computeCustomSizePrice({
    materialKey: input.request.materialKey,
    widthMm: input.request.widthMm,
    heightMm: input.request.heightMm,
    quantity: input.request.quantity,
    colorCount: input.request.colorCount,
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
      breakdown: {
        inkCostNet: result.breakdown.inkCost,
        plateCostNet: result.breakdown.plateCost,
        materialCostNet: result.breakdown.materialCost,
      },
    } satisfies PublicCustomSizeResponse,
  } as const;
}
