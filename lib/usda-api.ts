import type { USDASearchResult, USDAFoodDetail } from '../types';

const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

// Nutrient IDs from the USDA FoodData Central API
const NUTRIENT_IDS = {
  ENERGY: 1008,
  PROTEIN: 1003,
  SODIUM: 1093,
} as const;

/**
 * Extract calories, protein_g, and sodium_mg from a USDA nutrient array.
 */
export function extractNutrients(food: any): {
  calories: number;
  protein_g: number;
  sodium_mg: number;
} {
  const nutrients: any[] = food.foodNutrients ?? [];
  let calories = 0;
  let protein_g = 0;
  let sodium_mg = 0;

  for (const n of nutrients) {
    const id = n.nutrientId ?? n.nutrient?.id;
    const value = n.value ?? n.amount ?? 0;

    switch (id) {
      case NUTRIENT_IDS.ENERGY:
        calories = value;
        break;
      case NUTRIENT_IDS.PROTEIN:
        protein_g = value;
        break;
      case NUTRIENT_IDS.SODIUM:
        sodium_mg = value;
        break;
    }
  }

  return { calories, protein_g, sodium_mg };
}

/**
 * Search foods via the USDA FoodData Central API.
 */
export async function searchFoods(
  query: string,
  apiKey: string = 'DEMO_KEY',
  pageSize: number = 25
): Promise<USDASearchResult[]> {
  try {
    const response = await fetch(`${BASE_URL}/foods/search?api_key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        pageSize,
        dataType: ['Foundation', 'SR Legacy', 'Branded'],
      }),
    });

    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const foods: any[] = data.foods ?? [];

    return foods.map((food) => {
      const { calories, protein_g, sodium_mg } = extractNutrients(food);
      return {
        fdcId: String(food.fdcId),
        description: food.description ?? '',
        brandOwner: food.brandOwner,
        calories,
        protein_g,
        sodium_mg,
        servingSize: food.servingSize,
        servingSizeUnit: food.servingSizeUnit,
      };
    });
  } catch (error) {
    console.error('Failed to search foods:', error);
    throw error;
  }
}

/**
 * Get detailed nutrient information for a specific food item.
 */
export async function getFoodDetails(
  fdcId: string,
  apiKey: string = 'DEMO_KEY'
): Promise<USDAFoodDetail> {
  try {
    const response = await fetch(
      `${BASE_URL}/food/${fdcId}?api_key=${apiKey}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
    }

    const food = await response.json();
    const { calories, protein_g, sodium_mg } = extractNutrients(food);

    return {
      fdcId: String(food.fdcId),
      description: food.description ?? '',
      calories,
      protein_g,
      sodium_mg,
      servingSize: food.servingSize,
      servingSizeUnit: food.servingSizeUnit,
      foodNutrients: food.foodNutrients ?? [],
    };
  } catch (error) {
    console.error('Failed to get food details:', error);
    throw error;
  }
}
