export function isCustomSizeEnabled() {
  return process.env.NEXT_PUBLIC_FEATURE_CUSTOM_SIZE === "true";
}

export const customSizeFeatureEnabled =
  process.env.NEXT_PUBLIC_FEATURE_CUSTOM_SIZE === "true";
