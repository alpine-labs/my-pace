import * as SQLite from 'expo-sqlite';
import type { SQLiteBindValue } from 'expo-sqlite';
import type {
  User,
  FoodLogEntry,
  ExerciseLogEntry,
  WalkLogEntry,
  Exercise,
  FavoriteFood,
  DailySummary,
} from '../types';
import { DEFAULT_EXERCISES } from '../constants/exercises';

const db = SQLite.openDatabaseSync('mypace.db');

// ── Schema ──────────────────────────────────────────────────────────────────

export function initDatabase(): void {
  try {
    db.runSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        calorie_goal INTEGER DEFAULT 2000,
        protein_goal INTEGER DEFAULT 50,
        sodium_goal INTEGER DEFAULT 2300,
        walking_program_start_date TEXT,
        walking_program_week INTEGER DEFAULT 1,
        theme_preference TEXT DEFAULT 'light',
        notifications_enabled INTEGER DEFAULT 1,
        usda_api_key TEXT DEFAULT '',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    db.runSync(`
      CREATE TABLE IF NOT EXISTS food_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        date TEXT,
        meal_type TEXT,
        food_name TEXT,
        usda_fdc_id TEXT,
        serving_size REAL,
        serving_unit TEXT,
        calories REAL,
        protein_g REAL,
        sodium_mg REAL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    db.runSync(`
      CREATE TABLE IF NOT EXISTS exercise_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        date TEXT,
        exercise_id TEXT,
        exercise_name TEXT,
        sets INTEGER,
        reps INTEGER,
        duration_seconds INTEGER,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    db.runSync(`
      CREATE TABLE IF NOT EXISTS walk_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        date TEXT,
        duration_seconds INTEGER,
        program_week INTEGER,
        goal_duration_seconds INTEGER,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    db.runSync(`
      CREATE TABLE IF NOT EXISTS exercise_catalog (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        instructions TEXT,
        category TEXT,
        image_uri TEXT,
        difficulty_level TEXT,
        source TEXT DEFAULT 'custom'
      );
    `);

    db.runSync(`
      CREATE TABLE IF NOT EXISTS favorite_foods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        food_name TEXT,
        usda_fdc_id TEXT,
        serving_size REAL,
        serving_unit TEXT,
        calories REAL,
        protein_g REAL,
        sodium_mg REAL
      );
    `);

    // Seed default exercises if catalog is empty
    const count = db.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) AS count FROM exercise_catalog'
    )?.count ?? 0;

    if (count === 0) {
      for (const exercise of DEFAULT_EXERCISES) {
        db.runSync(
          `INSERT OR REPLACE INTO exercise_catalog (id, name, description, instructions, category, image_uri, difficulty_level, source)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            exercise.id,
            exercise.name,
            exercise.description,
            typeof exercise.instructions === 'string'
              ? exercise.instructions
              : JSON.stringify(exercise.instructions),
            exercise.category,
            exercise.image_uri,
            exercise.difficulty_level,
            exercise.source,
          ]
        );
      }
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// ── Users ───────────────────────────────────────────────────────────────────

export function getOrCreateUser(): User {
  try {
    const existing = db.getFirstSync<User>('SELECT * FROM users LIMIT 1');
    if (existing) return existing;

    db.runSync(
      `INSERT INTO users (name, calorie_goal, protein_goal, sodium_goal, theme_preference, notifications_enabled)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['User', 2000, 50, 2300, 'light', 1]
    );
    return db.getFirstSync<User>('SELECT * FROM users ORDER BY id DESC LIMIT 1')!;
  } catch (error) {
    console.error('Failed to get or create user:', error);
    throw error;
  }
}

export function updateUser(
  id: number,
  fields: Partial<Omit<User, 'id' | 'created_at'>>
): void {
  try {
    const keys = Object.keys(fields) as (keyof typeof fields)[];
    if (keys.length === 0) return;

    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => fields[k] as SQLiteBindValue);
    db.runSync(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id]);
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
}

// ── Food Log ────────────────────────────────────────────────────────────────

export function insertFoodLog(
  entry: Omit<FoodLogEntry, 'id' | 'created_at'>
): number {
  try {
    const result = db.runSync(
      `INSERT INTO food_log (user_id, date, meal_type, food_name, usda_fdc_id, serving_size, serving_unit, calories, protein_g, sodium_mg)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entry.user_id,
        entry.date,
        entry.meal_type,
        entry.food_name,
        entry.usda_fdc_id,
        entry.serving_size,
        entry.serving_unit,
        entry.calories,
        entry.protein_g,
        entry.sodium_mg,
      ]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Failed to insert food log:', error);
    throw error;
  }
}

export function getFoodLogByDate(date: string): FoodLogEntry[] {
  try {
    return db.getAllSync<FoodLogEntry>(
      'SELECT * FROM food_log WHERE date = ? ORDER BY created_at DESC',
      [date]
    );
  } catch (error) {
    console.error('Failed to get food log by date:', error);
    throw error;
  }
}

export function getAllFoodLogs(): FoodLogEntry[] {
  try {
    return db.getAllSync<FoodLogEntry>(
      'SELECT * FROM food_log ORDER BY date DESC, created_at DESC'
    );
  } catch (error) {
    console.error('Failed to get all food logs:', error);
    throw error;
  }
}

export function deleteFoodLog(id: number): void {
  try {
    db.runSync('DELETE FROM food_log WHERE id = ?', [id]);
  } catch (error) {
    console.error('Failed to delete food log:', error);
    throw error;
  }
}

export function updateFoodLog(
  id: number,
  fields: Partial<Omit<FoodLogEntry, 'id' | 'created_at'>>
): void {
  try {
    const keys = Object.keys(fields) as (keyof typeof fields)[];
    if (keys.length === 0) return;

    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => fields[k] as SQLiteBindValue);
    db.runSync(`UPDATE food_log SET ${setClause} WHERE id = ?`, [...values, id]);
  } catch (error) {
    console.error('Failed to update food log:', error);
    throw error;
  }
}

// ── Exercise Log ────────────────────────────────────────────────────────────

export function insertExerciseLog(
  entry: Omit<ExerciseLogEntry, 'id' | 'created_at'>
): number {
  try {
    const result = db.runSync(
      `INSERT INTO exercise_log (user_id, date, exercise_id, exercise_name, sets, reps, duration_seconds, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entry.user_id,
        entry.date,
        entry.exercise_id,
        entry.exercise_name,
        entry.sets,
        entry.reps,
        entry.duration_seconds,
        entry.notes,
      ]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Failed to insert exercise log:', error);
    throw error;
  }
}

export function getExerciseLogByDate(date: string): ExerciseLogEntry[] {
  try {
    return db.getAllSync<ExerciseLogEntry>(
      'SELECT * FROM exercise_log WHERE date = ? ORDER BY created_at DESC',
      [date]
    );
  } catch (error) {
    console.error('Failed to get exercise log by date:', error);
    throw error;
  }
}

export function getAllExerciseLogs(): ExerciseLogEntry[] {
  try {
    return db.getAllSync<ExerciseLogEntry>(
      'SELECT * FROM exercise_log ORDER BY date DESC, created_at DESC'
    );
  } catch (error) {
    console.error('Failed to get all exercise logs:', error);
    throw error;
  }
}

export function deleteExerciseLog(id: number): void {
  try {
    db.runSync('DELETE FROM exercise_log WHERE id = ?', [id]);
  } catch (error) {
    console.error('Failed to delete exercise log:', error);
    throw error;
  }
}

export function updateExerciseLog(
  id: number,
  fields: Partial<Omit<ExerciseLogEntry, 'id' | 'created_at'>>
): void {
  try {
    const keys = Object.keys(fields) as (keyof typeof fields)[];
    if (keys.length === 0) return;

    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => fields[k] as SQLiteBindValue);
    db.runSync(`UPDATE exercise_log SET ${setClause} WHERE id = ?`, [...values, id]);
  } catch (error) {
    console.error('Failed to update exercise log:', error);
    throw error;
  }
}

// ── Walk Log ────────────────────────────────────────────────────────────────

export function insertWalkLog(
  entry: Omit<WalkLogEntry, 'id' | 'created_at'>
): number {
  try {
    const result = db.runSync(
      `INSERT INTO walk_log (user_id, date, duration_seconds, program_week, goal_duration_seconds, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        entry.user_id,
        entry.date,
        entry.duration_seconds,
        entry.program_week,
        entry.goal_duration_seconds,
        entry.notes,
      ]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Failed to insert walk log:', error);
    throw error;
  }
}

export function getWalkLogByDate(date: string): WalkLogEntry[] {
  try {
    return db.getAllSync<WalkLogEntry>(
      'SELECT * FROM walk_log WHERE date = ? ORDER BY created_at DESC',
      [date]
    );
  } catch (error) {
    console.error('Failed to get walk log by date:', error);
    throw error;
  }
}

export function getAllWalkLogs(): WalkLogEntry[] {
  try {
    return db.getAllSync<WalkLogEntry>(
      'SELECT * FROM walk_log ORDER BY date DESC, created_at DESC'
    );
  } catch (error) {
    console.error('Failed to get all walk logs:', error);
    throw error;
  }
}

export function deleteWalkLog(id: number): void {
  try {
    db.runSync('DELETE FROM walk_log WHERE id = ?', [id]);
  } catch (error) {
    console.error('Failed to delete walk log:', error);
    throw error;
  }
}

export function updateWalkLog(
  id: number,
  fields: Partial<Omit<WalkLogEntry, 'id' | 'created_at'>>
): void {
  try {
    const keys = Object.keys(fields) as (keyof typeof fields)[];
    if (keys.length === 0) return;

    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => fields[k] as SQLiteBindValue);
    db.runSync(`UPDATE walk_log SET ${setClause} WHERE id = ?`, [...values, id]);
  } catch (error) {
    console.error('Failed to update walk log:', error);
    throw error;
  }
}

// ── Exercise Catalog ────────────────────────────────────────────────────────

export function insertExercise(exercise: Exercise): void {
  try {
    db.runSync(
      `INSERT OR REPLACE INTO exercise_catalog (id, name, description, instructions, category, image_uri, difficulty_level, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        exercise.id,
        exercise.name,
        exercise.description,
        typeof exercise.instructions === 'string'
          ? exercise.instructions
          : JSON.stringify(exercise.instructions),
        exercise.category,
        exercise.image_uri,
        exercise.difficulty_level,
        exercise.source,
      ]
    );
  } catch (error) {
    console.error('Failed to insert exercise:', error);
    throw error;
  }
}

export function getAllExercises(): Exercise[] {
  try {
    return db.getAllSync<Exercise>(
      'SELECT * FROM exercise_catalog ORDER BY name ASC'
    );
  } catch (error) {
    console.error('Failed to get all exercises:', error);
    throw error;
  }
}

export function getExercisesByCategory(category: string): Exercise[] {
  try {
    return db.getAllSync<Exercise>(
      'SELECT * FROM exercise_catalog WHERE category = ? ORDER BY name ASC',
      [category]
    );
  } catch (error) {
    console.error('Failed to get exercises by category:', error);
    throw error;
  }
}

export function deleteExercise(id: string): void {
  try {
    db.runSync('DELETE FROM exercise_catalog WHERE id = ?', [id]);
  } catch (error) {
    console.error('Failed to delete exercise:', error);
    throw error;
  }
}

export function updateExercise(
  id: string,
  fields: Partial<Omit<Exercise, 'id'>>
): void {
  try {
    const keys = Object.keys(fields) as (keyof typeof fields)[];
    if (keys.length === 0) return;

    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => fields[k] as SQLiteBindValue);
    db.runSync(`UPDATE exercise_catalog SET ${setClause} WHERE id = ?`, [...values, id]);
  } catch (error) {
    console.error('Failed to update exercise:', error);
    throw error;
  }
}

// ── Favorite Foods ──────────────────────────────────────────────────────────

export function insertFavoriteFood(
  entry: Omit<FavoriteFood, 'id'>
): number {
  try {
    const result = db.runSync(
      `INSERT INTO favorite_foods (user_id, food_name, usda_fdc_id, serving_size, serving_unit, calories, protein_g, sodium_mg)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entry.user_id,
        entry.food_name,
        entry.usda_fdc_id,
        entry.serving_size,
        entry.serving_unit,
        entry.calories,
        entry.protein_g,
        entry.sodium_mg,
      ]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Failed to insert favorite food:', error);
    throw error;
  }
}

export function getAllFavoriteFoods(userId: number): FavoriteFood[] {
  try {
    return db.getAllSync<FavoriteFood>(
      'SELECT * FROM favorite_foods WHERE user_id = ? ORDER BY food_name ASC',
      [userId]
    );
  } catch (error) {
    console.error('Failed to get favorite foods:', error);
    throw error;
  }
}

export function deleteFavoriteFood(id: number): void {
  try {
    db.runSync('DELETE FROM favorite_foods WHERE id = ?', [id]);
  } catch (error) {
    console.error('Failed to delete favorite food:', error);
    throw error;
  }
}

// ── Daily Summary ───────────────────────────────────────────────────────────

export function getDailySummary(date: string): DailySummary {
  try {
    const foodTotals = db.getFirstSync<{
      totalCalories: number;
      totalProtein: number;
      totalSodium: number;
    }>(
      `SELECT
         COALESCE(SUM(calories), 0) AS totalCalories,
         COALESCE(SUM(protein_g), 0) AS totalProtein,
         COALESCE(SUM(sodium_mg), 0) AS totalSodium
       FROM food_log WHERE date = ?`,
      [date]
    ) ?? { totalCalories: 0, totalProtein: 0, totalSodium: 0 };

    const exerciseCount =
      db.getFirstSync<{ count: number }>(
        'SELECT COUNT(*) AS count FROM exercise_log WHERE date = ?',
        [date]
      )?.count ?? 0;

    const walkTotal =
      db.getFirstSync<{ total: number }>(
        'SELECT COALESCE(SUM(duration_seconds), 0) AS total FROM walk_log WHERE date = ?',
        [date]
      )?.total ?? 0;

    return {
      totalCalories: foodTotals.totalCalories,
      totalProtein: foodTotals.totalProtein,
      totalSodium: foodTotals.totalSodium,
      exerciseCount,
      totalWalkSeconds: walkTotal,
    };
  } catch (error) {
    console.error('Failed to get daily summary:', error);
    throw error;
  }
}
