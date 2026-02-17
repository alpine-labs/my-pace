import { WALKING_PROGRAM, TOTAL_PROGRAM_WEEKS } from '../constants/walking-program';
import type { WalkLogEntry } from '../types';

/**
 * Calculate the current program week based on the start date.
 * Returns a value clamped between 1 and TOTAL_PROGRAM_WEEKS.
 */
export function getCurrentWeek(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;
  return Math.max(1, Math.min(week, TOTAL_PROGRAM_WEEKS));
}

/**
 * Get the daily goal in minutes for a given week.
 * Falls back to the last week's goal if the week exceeds the program length.
 */
export function getDailyGoalMinutes(week: number): number {
  const clampedWeek = Math.max(1, Math.min(week, TOTAL_PROGRAM_WEEKS));
  const weekData = WALKING_PROGRAM.find((w) => w.week === clampedWeek);
  return weekData?.dailyGoalMinutes ?? WALKING_PROGRAM[WALKING_PROGRAM.length - 1].dailyGoalMinutes;
}

/**
 * Calculate the completion percentage for a given week's walk logs.
 * Compares total walk seconds against (7 days × dailyGoalMinutes × 60).
 */
export function getWeekProgress(walkLogs: WalkLogEntry[], week: number): number {
  const goalMinutes = getDailyGoalMinutes(week);
  const weeklyGoalSeconds = goalMinutes * 60 * 7;
  if (weeklyGoalSeconds <= 0) return 100;

  const totalSeconds = walkLogs
    .filter((log) => log.program_week === week)
    .reduce((sum, log) => sum + log.duration_seconds, 0);

  return Math.min(100, Math.round((totalSeconds / weeklyGoalSeconds) * 100));
}

/**
 * Format seconds into a human-readable duration string.
 * Returns "MM:SS" for durations under an hour, "H:MM:SS" otherwise.
 */
export function formatDuration(seconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}
