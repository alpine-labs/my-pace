import { create } from 'zustand';
import {
  getAllExercises,
  getExerciseLogByDate,
  insertExerciseLog,
  deleteExerciseLog as dbDeleteExerciseLog,
} from '../lib/database';
import type { Exercise, ExerciseLogEntry } from '../types';

interface ExerciseState {
  exercises: Exercise[];
  dailyExerciseLog: ExerciseLogEntry[];
  selectedDate: string;

  loadCatalog: () => void;
  loadDailyLog: (date: string) => void;
  logExercise: (entry: Omit<ExerciseLogEntry, 'id' | 'created_at'>) => void;
  deleteExerciseLog: (id: number) => void;
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  exercises: [],
  dailyExerciseLog: [],
  selectedDate: new Date().toISOString().split('T')[0],

  loadCatalog: () => {
    try {
      const exercises = getAllExercises();
      set({ exercises });
    } catch (error) {
      console.error('Failed to load exercise catalog:', error);
    }
  },

  loadDailyLog: (date: string) => {
    try {
      const log = getExerciseLogByDate(date);
      set({ dailyExerciseLog: log, selectedDate: date });
    } catch (error) {
      console.error('Failed to load daily exercise log:', error);
    }
  },

  logExercise: (entry) => {
    try {
      insertExerciseLog(entry);
      const { selectedDate } = get();
      if (entry.date === selectedDate) {
        const log = getExerciseLogByDate(selectedDate);
        set({ dailyExerciseLog: log });
      }
    } catch (error) {
      console.error('Failed to log exercise:', error);
    }
  },

  deleteExerciseLog: (id: number) => {
    try {
      dbDeleteExerciseLog(id);
      const { selectedDate } = get();
      const log = getExerciseLogByDate(selectedDate);
      set({ dailyExerciseLog: log });
    } catch (error) {
      console.error('Failed to delete exercise log:', error);
    }
  },
}));
