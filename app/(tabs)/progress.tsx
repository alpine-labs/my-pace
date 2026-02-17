import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/theme';
import type { DailySummary } from '../../types';

let LineChart: any = null;
let BarChart: any = null;
try {
  const chartKit = require('react-native-chart-kit');
  LineChart = chartKit.LineChart;
  BarChart = chartKit.BarChart;
} catch {}

const SCREEN_WIDTH = Dimensions.get('window').width;

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function displayDate(dateStr: string): string {
  const parts = dateStr.split('-');
  return `${parts[1]}/${parts[2]}/${parts[0]}`;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

export default function ProgressScreen() {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [summary, setSummary] = useState<DailySummary>({
    totalCalories: 0,
    totalProtein: 0,
    totalSodium: 0,
    exerciseCount: 0,
    totalWalkSeconds: 0,
  });
  const [weeklyCalories, setWeeklyCalories] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [weeklyWalkMinutes, setWeeklyWalkMinutes] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [weekLabels, setWeekLabels] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

  useEffect(() => {
    loadDaySummary(selectedDate);
    loadWeeklyTrends(selectedDate);
  }, [selectedDate]);

  async function loadDaySummary(date: string) {
    try {
      const { useFoodStore } = await import('../../stores/food-store');
      const { useExerciseStore } = await import('../../stores/exercise-store');
      const { useWalkStore } = await import('../../stores/walk-store');

      useFoodStore.getState().loadDailyLog(date);
      useExerciseStore.getState().loadDailyLog(date);
      useWalkStore.getState().loadWalkLogs(date);

      const foodState = useFoodStore.getState();
      const exerciseState = useExerciseStore.getState();
      const walkState = useWalkStore.getState();

      setSummary({
        totalCalories: foodState.dailyCalories,
        totalProtein: foodState.dailyProtein,
        totalSodium: foodState.dailySodium,
        exerciseCount: exerciseState.dailyExerciseLog.length,
        totalWalkSeconds: walkState.walkLogs.reduce((s: number, e) => s + (e.duration_seconds ?? 0), 0),
      });
    } catch {
      setSummary({ totalCalories: 0, totalProtein: 0, totalSodium: 0, exerciseCount: 0, totalWalkSeconds: 0 });
    }
  }

  async function loadWeeklyTrends(date: string) {
    try {
      const { useFoodStore } = await import('../../stores/food-store');
      const { useWalkStore } = await import('../../stores/walk-store');

      const cals: number[] = [];
      const walks: number[] = [];
      const labels: string[] = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      for (let i = 6; i >= 0; i--) {
        const d = addDays(date, -i);
        const dayOfWeek = new Date(d + 'T00:00:00').getDay();
        labels.push(dayNames[dayOfWeek]);

        useFoodStore.getState().loadDailyLog(d);
        cals.push(useFoodStore.getState().dailyCalories);

        useWalkStore.getState().loadWalkLogs(d);
        const walkLogs = useWalkStore.getState().walkLogs;
        walks.push(
          Math.round(
            walkLogs.reduce((s: number, e) => s + (e.duration_seconds ?? 0), 0) / 60,
          ),
        );
      }

      setWeeklyCalories(cals);
      setWeeklyWalkMinutes(walks);
      setWeekLabels(labels);
    } catch {
      setWeeklyCalories([0, 0, 0, 0, 0, 0, 0]);
      setWeeklyWalkMinutes([0, 0, 0, 0, 0, 0, 0]);
    }
  }

  const formatWalkTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s2 = sec % 60;
    return `${m}m ${s2}s`;
  };

  const chartConfig = {
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: () => theme.colors.primary,
    labelColor: () => theme.colors.textSecondary,
    propsForBackgroundLines: {
      stroke: theme.colors.border,
    },
    barPercentage: 0.6,
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scroll: { padding: theme.spacing.lg },
    dateRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    dateArrow: {
      padding: theme.spacing.sm,
      minWidth: 56,
      minHeight: 56,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dateText: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: '700',
      color: theme.colors.text,
    },
    sectionTitle: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 6,
    },
    cardLabel: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
    },
    cardValue: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: '700',
      color: theme.colors.text,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.sm,
    },
    chartCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
    },
    chartTitle: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    noChartText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      paddingVertical: theme.spacing.lg,
    },
  });

  const chartWidth = SCREEN_WIDTH - theme.spacing.lg * 2 - theme.spacing.md * 2;

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Date selector */}
        <View style={s.dateRow}>
          <TouchableOpacity
            style={s.dateArrow}
            onPress={() => setSelectedDate(addDays(selectedDate, -1))}
            accessibilityLabel="Previous day"
          >
            <Ionicons name="chevron-back" size={28} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={s.dateText}>{displayDate(selectedDate)}</Text>
          <TouchableOpacity
            style={s.dateArrow}
            onPress={() => setSelectedDate(addDays(selectedDate, 1))}
            accessibilityLabel="Next day"
          >
            <Ionicons name="chevron-forward" size={28} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Daily summary */}
        <Text style={s.sectionTitle}>Daily Summary</Text>
        <View style={s.card}>
          <View style={s.cardRow}>
            <Text style={s.cardLabel}>Calories</Text>
            <Text style={s.cardValue}>{summary.totalCalories}</Text>
          </View>
          <View style={s.divider} />
          <View style={s.cardRow}>
            <Text style={s.cardLabel}>Protein</Text>
            <Text style={s.cardValue}>{summary.totalProtein}g</Text>
          </View>
          <View style={s.divider} />
          <View style={s.cardRow}>
            <Text style={s.cardLabel}>Sodium</Text>
            <Text style={s.cardValue}>{summary.totalSodium}mg</Text>
          </View>
          <View style={s.divider} />
          <View style={s.cardRow}>
            <Text style={s.cardLabel}>Exercises</Text>
            <Text style={s.cardValue}>{summary.exerciseCount}</Text>
          </View>
          <View style={s.divider} />
          <View style={s.cardRow}>
            <Text style={s.cardLabel}>Walk Time</Text>
            <Text style={s.cardValue}>{formatWalkTime(summary.totalWalkSeconds)}</Text>
          </View>
        </View>

        {/* Weekly charts */}
        <Text style={s.sectionTitle}>Weekly Trends</Text>

        <View style={s.chartCard}>
          <Text style={s.chartTitle}>Calorie Trend (7 Days)</Text>
          {LineChart ? (
            <LineChart
              data={{
                labels: weekLabels,
                datasets: [{ data: weeklyCalories.map((v) => v || 0) }],
              }}
              width={chartWidth}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={{ borderRadius: theme.borderRadius.sm }}
            />
          ) : (
            <Text style={s.noChartText}>Chart unavailable</Text>
          )}
        </View>

        <View style={s.chartCard}>
          <Text style={s.chartTitle}>Walk Duration (minutes, 7 Days)</Text>
          {BarChart ? (
            <BarChart
              data={{
                labels: weekLabels,
                datasets: [{ data: weeklyWalkMinutes.map((v) => v || 0) }],
              }}
              width={chartWidth}
              height={200}
              chartConfig={chartConfig}
              yAxisSuffix="m"
              yAxisLabel=""
              style={{ borderRadius: theme.borderRadius.sm }}
            />
          ) : (
            <Text style={s.noChartText}>Chart unavailable</Text>
          )}
        </View>

        <View style={{ height: theme.spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}
