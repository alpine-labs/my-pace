import type { Exercise } from '../types';

const BASE_URL = 'https://wger.de/api/v2';
const WGER_IMAGE_BASE = 'https://wger.de';

// Map wger categories to our app categories
const CATEGORY_MAP: Record<string, string> = {
  Abs: 'strength',
  Arms: 'strength',
  Back: 'strength',
  Calves: 'strength',
  Cardio: 'cardio',
  Chest: 'strength',
  Legs: 'strength',
  Shoulders: 'strength',
};

interface WgerSearchSuggestion {
  value: string;
  data: {
    id: number;
    base_id: number;
    name: string;
    category: string;
    image: string | null;
    image_thumbnail: string | null;
  };
}

interface WgerTranslation {
  name: string;
  description: string;
  language: number;
}

/**
 * Search exercises via the wger.de API.
 */
export async function searchExercises(term: string): Promise<Exercise[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/exercise/search/?term=${encodeURIComponent(term)}&language=english&format=json`
    );

    if (!response.ok) {
      throw new Error(`wger API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const suggestions: WgerSearchSuggestion[] = data.suggestions ?? [];

    // Deduplicate by base_id (same exercise can appear with different translation IDs)
    const seen = new Set<number>();
    const unique = suggestions.filter((s) => {
      if (seen.has(s.data.base_id)) return false;
      seen.add(s.data.base_id);
      return true;
    });

    return unique.slice(0, 20).map((s) => ({
      id: `wger-${s.data.base_id}`,
      name: s.data.name,
      description: '',
      instructions: '',
      category: CATEGORY_MAP[s.data.category] ?? 'strength',
      image_uri: s.data.image ? `${WGER_IMAGE_BASE}${s.data.image}` : null,
      difficulty_level: 'beginner',
      source: 'wger',
    }));
  } catch (error) {
    console.error('Failed to search wger exercises:', error);
    throw error;
  }
}

/**
 * Get detailed exercise info (description + images) by base exercise ID.
 */
export async function getExerciseDetail(baseId: number): Promise<{
  description: string;
  images: string[];
}> {
  try {
    const response = await fetch(
      `${BASE_URL}/exerciseinfo/${baseId}/?format=json`
    );

    if (!response.ok) {
      throw new Error(`wger API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Find English translation (language ID 2)
    const english: WgerTranslation | undefined =
      data.translations?.find((t: WgerTranslation) => t.language === 2);

    // Strip HTML tags from description
    const rawDesc = english?.description ?? '';
    const description = rawDesc.replace(/<[^>]*>/g, '').trim();

    // Collect image URLs
    const images: string[] = (data.images ?? [])
      .map((img: { image: string }) => img.image)
      .filter(Boolean);

    return { description, images };
  } catch (error) {
    console.error('Failed to get wger exercise detail:', error);
    throw error;
  }
}
