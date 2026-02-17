import { WalkingWeek } from '../types';

export const WALKING_PROGRAM: WalkingWeek[] = [
  { week: 1, dailyGoalMinutes: 5, description: 'Getting Started', tips: 'Start slow, focus on form and comfort' },
  { week: 2, dailyGoalMinutes: 8, description: 'Building Momentum', tips: 'Slight increase, maintain comfortable pace' },
  { week: 3, dailyGoalMinutes: 10, description: 'Building a Routine', tips: 'Consistency is key — try walking at the same time each day' },
  { week: 4, dailyGoalMinutes: 12, description: 'Stepping Up', tips: 'Adding a couple minutes — you\'re doing great!' },
  { week: 5, dailyGoalMinutes: 15, description: 'Quarter-Hour Milestone', tips: 'You reached 15 minutes — celebrate this milestone!' },
  { week: 6, dailyGoalMinutes: 18, description: 'Steady Progression', tips: 'Keep your comfortable pace — endurance matters more than speed' },
  { week: 7, dailyGoalMinutes: 20, description: 'Twenty Minutes!', tips: 'Great progress — 20 minutes is a major achievement' },
  { week: 8, dailyGoalMinutes: 22, description: 'Keep It Up', tips: 'You\'re well past the halfway mark' },
  { week: 9, dailyGoalMinutes: 25, description: 'Nearing the Goal', tips: 'Almost at 30 minutes — stay steady' },
  { week: 10, dailyGoalMinutes: 28, description: 'Almost There', tips: 'Just a couple more minutes to reach 30!' },
  { week: 11, dailyGoalMinutes: 30, description: 'Half-Hour Walks', tips: 'Excellent! You\'re walking 30 minutes a day' },
  { week: 12, dailyGoalMinutes: 35, description: 'Maintain & Enjoy', tips: 'Maintain your routine and enjoy the benefits of daily walking' },
];

export const TOTAL_PROGRAM_WEEKS = WALKING_PROGRAM.length;
