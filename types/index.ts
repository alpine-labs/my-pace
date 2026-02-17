// ── Type aliases ──────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ExerciseCategory = 'balance' | 'strength' | 'flexibility' | 'cardio';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// ── Domain models ────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  calorie_goal: number;
  protein_goal: number;
  sodium_goal: number;
  walking_program_start_date: string | null;
  walking_program_week: number;
  theme_preference: ThemeMode;
  notifications_enabled: number;
  created_at: string;
}

export interface FoodLogEntry {
  id: number;
  user_id: number;
  date: string;
  meal_type: MealType | string;
  food_name: string;
  usda_fdc_id: string | null;
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein_g: number;
  sodium_mg: number;
  created_at: string;
}

export interface ExerciseLogEntry {
  id: number;
  user_id: number;
  date: string;
  exercise_id: string;
  exercise_name: string;
  sets: number | null;
  reps: number | null;
  duration_seconds: number | null;
  notes: string | null;
  created_at: string;
}

export interface WalkLogEntry {
  id: number;
  user_id: number;
  date: string;
  duration_seconds: number;
  program_week: number;
  goal_duration_seconds: number;
  notes: string | null;
  created_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  instructions: string | string[];
  category: ExerciseCategory | string;
  image_uri: string | null;
  difficulty_level: DifficultyLevel | string;
  source: string;
}

export interface FavoriteFood {
  id: number;
  user_id: number;
  food_name: string;
  usda_fdc_id: string | null;
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein_g: number;
  sodium_mg: number;
}

export interface WalkingWeek {
  week: number;
  dailyGoalMinutes: number;
  description: string;
  tips: string | string[];
}

export interface WalkingProgramWeek {
  weekNumber: number;
  dailyGoalMinutes: number;
  description: string;
  tips: string[];
}

export interface FavoriteFoodItem {
  id: string;
  userId: string;
  fdcId: number;
  foodName: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  addedAt: string;
}

export interface DailySummary {
  totalCalories: number;
  totalProtein: number;
  totalSodium: number;
  exerciseCount: number;
  totalWalkSeconds: number;
}

// ── USDA API types ───────────────────────────────────────────

export interface USDASearchResult {
  fdcId: string;
  description: string;
  brandOwner?: string;
  calories: number;
  protein_g: number;
  sodium_mg: number;
  servingSize?: number;
  servingSizeUnit?: string;
}

export interface USDAFoodDetail {
  fdcId: string;
  description: string;
  calories: number;
  protein_g: number;
  sodium_mg: number;
  servingSize?: number;
  servingSizeUnit?: string;
  foodNutrients: any[];
}

export interface USDAFoodNutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  value: number;
}

export interface USDAFoodSearchResult {
  fdcId: number;
  description: string;
  dataType: string;
  brandOwner?: string;
  ingredients?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  foodNutrients: USDAFoodNutrient[];
}
