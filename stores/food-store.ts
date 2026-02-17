import { create } from 'zustand';
import {
  insertFoodLog,
  getFoodLogByDate,
  deleteFoodLog as dbDeleteFoodLog,
} from '../lib/database';
import { searchFoods as usdaSearchFoods } from '../lib/usda-api';
import type { FoodLogEntry } from '../types';

interface FoodState {
  dailyFoodLog: FoodLogEntry[];
  searchResults: any[];
  isSearching: boolean;
  selectedDate: string;

  // Computed totals
  dailyCalories: number;
  dailyProtein: number;
  dailySodium: number;

  loadDailyLog: (date: string) => void;
  addFoodEntry: (entry: Omit<FoodLogEntry, 'id' | 'created_at'>) => void;
  deleteFoodEntry: (id: number) => void;
  searchFoods: (query: string, apiKey?: string) => Promise<void>;
  clearSearchResults: () => void;
}

function computeTotals(log: FoodLogEntry[]) {
  return {
    dailyCalories: log.reduce((sum, e) => sum + (e.calories ?? 0), 0),
    dailyProtein: log.reduce((sum, e) => sum + (e.protein_g ?? 0), 0),
    dailySodium: log.reduce((sum, e) => sum + (e.sodium_mg ?? 0), 0),
  };
}

export const useFoodStore = create<FoodState>((set, get) => ({
  dailyFoodLog: [],
  searchResults: [],
  isSearching: false,
  selectedDate: new Date().toISOString().split('T')[0],
  dailyCalories: 0,
  dailyProtein: 0,
  dailySodium: 0,

  loadDailyLog: (date: string) => {
    try {
      const log = getFoodLogByDate(date);
      set({ dailyFoodLog: log, selectedDate: date, ...computeTotals(log) });
    } catch (error) {
      console.error('Failed to load daily food log:', error);
    }
  },

  addFoodEntry: (entry) => {
    try {
      insertFoodLog(entry);
      const { selectedDate } = get();
      // Reload log if the entry is for the currently displayed date
      if (entry.date === selectedDate) {
        const log = getFoodLogByDate(selectedDate);
        set({ dailyFoodLog: log, ...computeTotals(log) });
      }
    } catch (error) {
      console.error('Failed to add food entry:', error);
    }
  },

  deleteFoodEntry: (id: number) => {
    try {
      dbDeleteFoodLog(id);
      const { selectedDate } = get();
      const log = getFoodLogByDate(selectedDate);
      set({ dailyFoodLog: log, ...computeTotals(log) });
    } catch (error) {
      console.error('Failed to delete food entry:', error);
    }
  },

  searchFoods: async (query: string, apiKey?: string) => {
    set({ isSearching: true });
    try {
      const results = await usdaSearchFoods(query, apiKey);
      set({ searchResults: results, isSearching: false });
    } catch (error) {
      console.error('Failed to search foods:', error);
      set({ searchResults: [], isSearching: false });
    }
  },

  clearSearchResults: () => {
    set({ searchResults: [] });
  },
}));
