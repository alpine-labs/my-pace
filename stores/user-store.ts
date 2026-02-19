import { create } from 'zustand';
import { getOrCreateUser, updateUser } from '../lib/database';
import type { User } from '../types';

interface UserState {
  userId: number;
  name: string;
  calorieGoal: number;
  proteinGoal: number;
  sodiumGoal: number;
  walkingProgramStartDate: string | null;
  walkingProgramWeek: number;
  themeMode: 'light' | 'dark';
  notificationsEnabled: boolean;
  usdaApiKey: string;
  isLoaded: boolean;

  initUser: () => void;
  setTheme: (mode: 'light' | 'dark') => void;
  setGoals: (goals: {
    calorieGoal?: number;
    proteinGoal?: number;
    sodiumGoal?: number;
  }) => void;
  setNotifications: (enabled: boolean) => void;
  setName: (name: string) => void;
  setWalkingProgramStart: (date: string) => void;
  setUsdaApiKey: (key: string) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  userId: 0,
  name: '',
  calorieGoal: 2000,
  proteinGoal: 50,
  sodiumGoal: 2300,
  walkingProgramStartDate: null,
  walkingProgramWeek: 1,
  themeMode: 'light',
  notificationsEnabled: true,
  usdaApiKey: '',
  isLoaded: false,

  initUser: () => {
    try {
      const user: User = getOrCreateUser();
      set({
        userId: user.id,
        name: user.name ?? '',
        calorieGoal: user.calorie_goal,
        proteinGoal: user.protein_goal,
        sodiumGoal: user.sodium_goal,
        walkingProgramStartDate: user.walking_program_start_date,
        walkingProgramWeek: user.walking_program_week,
        themeMode: (user.theme_preference as 'light' | 'dark') ?? 'light',
        notificationsEnabled: user.notifications_enabled === 1,
        usdaApiKey: user.usda_api_key ?? '',
        isLoaded: true,
      });
    } catch (error) {
      console.error('Failed to initialize user:', error);
    }
  },

  setTheme: (mode: 'light' | 'dark') => {
    const { userId } = get();
    try {
      updateUser(userId, { theme_preference: mode });
      set({ themeMode: mode });
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  },

  setGoals: (goals) => {
    const { userId } = get();
    const updates: Partial<User> = {};
    if (goals.calorieGoal !== undefined) updates.calorie_goal = goals.calorieGoal;
    if (goals.proteinGoal !== undefined) updates.protein_goal = goals.proteinGoal;
    if (goals.sodiumGoal !== undefined) updates.sodium_goal = goals.sodiumGoal;

    try {
      updateUser(userId, updates);
      set({
        ...(goals.calorieGoal !== undefined && { calorieGoal: goals.calorieGoal }),
        ...(goals.proteinGoal !== undefined && { proteinGoal: goals.proteinGoal }),
        ...(goals.sodiumGoal !== undefined && { sodiumGoal: goals.sodiumGoal }),
      });
    } catch (error) {
      console.error('Failed to set goals:', error);
    }
  },

  setNotifications: (enabled: boolean) => {
    const { userId } = get();
    try {
      updateUser(userId, { notifications_enabled: enabled ? 1 : 0 });
      set({ notificationsEnabled: enabled });
    } catch (error) {
      console.error('Failed to set notifications:', error);
    }
  },

  setName: (name: string) => {
    const { userId } = get();
    try {
      updateUser(userId, { name });
      set({ name });
    } catch (error) {
      console.error('Failed to set name:', error);
    }
  },

  setWalkingProgramStart: (date: string) => {
    const { userId } = get();
    try {
      updateUser(userId, { walking_program_start_date: date, walking_program_week: 1 });
      set({ walkingProgramStartDate: date, walkingProgramWeek: 1 });
    } catch (error) {
      console.error('Failed to set walking program start:', error);
    }
  },

  setUsdaApiKey: (key: string) => {
    const { userId } = get();
    try {
      updateUser(userId, { usda_api_key: key });
      set({ usdaApiKey: key });
    } catch (error) {
      console.error('Failed to set USDA API key:', error);
    }
  },
}));
