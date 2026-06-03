export function isAddonsEnabled() {
  return process.env.NEXT_PUBLIC_FEATURE_ADDONS === "true";
}

export const addonsFeatureEnabled =
  process.env.NEXT_PUBLIC_FEATURE_ADDONS === "true";
