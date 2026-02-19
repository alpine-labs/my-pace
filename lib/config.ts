/**
 * Returns the USDA FoodData Central API key.
 * Priority: user setting (SQLite) > EXPO_PUBLIC env var > DEMO_KEY fallback.
 */
export function getUsdaApiKey(): string {
  try {
    const { useUserStore } = require('../stores/user-store');
    const storeKey = useUserStore.getState().usdaApiKey;
    if (storeKey && storeKey.trim() !== '') return storeKey.trim();
  } catch {}

  // Read from EXPO_PUBLIC_* env var (set via .env.local or Vercel)
  const envKey = process.env.EXPO_PUBLIC_USDA_API_KEY;
  if (envKey && envKey !== 'DEMO_KEY') return envKey;

  return 'DEMO_KEY';
}
