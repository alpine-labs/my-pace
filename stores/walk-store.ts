import { create } from 'zustand';
import {
  insertWalkLog,
  getWalkLogByDate,
  deleteWalkLog as dbDeleteWalkLog,
} from '../lib/database';
import {
  getCurrentWeek,
  getDailyGoalMinutes,
} from '../lib/walking-program';
import type { WalkLogEntry } from '../types';

interface WalkState {
  walkLogs: WalkLogEntry[];
  isWalking: boolean;
  currentDuration: number;
  walkStartTime: number | null;
  selectedDate: string;

  // Computed from user's walking program start date
  currentWeek: number;
  dailyGoalMinutes: number;

  startWalk: () => void;
  stopWalk: () => number;
  saveWalk: (entry: Omit<WalkLogEntry, 'id' | 'created_at'>) => void;
  loadWalkLogs: (date: string) => void;
  updateCurrentDuration: () => void;
  syncProgramWeek: (startDate: string | null) => void;
}

export const useWalkStore = create<WalkState>((set, get) => ({
  walkLogs: [],
  isWalking: false,
  currentDuration: 0,
  walkStartTime: null,
  selectedDate: new Date().toISOString().split('T')[0],
  currentWeek: 1,
  dailyGoalMinutes: 5,

  startWalk: () => {
    set({
      isWalking: true,
      currentDuration: 0,
      walkStartTime: Date.now(),
    });
  },

  stopWalk: () => {
    const { walkStartTime } = get();
    const elapsed = walkStartTime
      ? Math.floor((Date.now() - walkStartTime) / 1000)
      : 0;
    set({
      isWalking: false,
      currentDuration: elapsed,
      walkStartTime: null,
    });
    return elapsed;
  },

  saveWalk: (entry) => {
    try {
      insertWalkLog(entry);
      const { selectedDate } = get();
      if (entry.date === selectedDate) {
        const logs = getWalkLogByDate(selectedDate);
        set({ walkLogs: logs });
      }
    } catch (error) {
      console.error('Failed to save walk:', error);
    }
  },

  loadWalkLogs: (date: string) => {
    try {
      const logs = getWalkLogByDate(date);
      set({ walkLogs: logs, selectedDate: date });
    } catch (error) {
      console.error('Failed to load walk logs:', error);
    }
  },

  updateCurrentDuration: () => {
    const { walkStartTime, isWalking } = get();
    if (isWalking && walkStartTime) {
      const elapsed = Math.floor((Date.now() - walkStartTime) / 1000);
      set({ currentDuration: elapsed });
    }
  },

  syncProgramWeek: (startDate: string | null) => {
    if (!startDate) {
      set({ currentWeek: 1, dailyGoalMinutes: 5 });
      return;
    }
    const week = getCurrentWeek(startDate);
    const goalMinutes = getDailyGoalMinutes(week);
    set({ currentWeek: week, dailyGoalMinutes: goalMinutes });
  },
}));
