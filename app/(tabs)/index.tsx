import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/theme';
import type { DailySummary } from '../../types';

const MOTIVATIONAL_MESSAGES = [
  'Every step counts — keep going!',
  'You are stronger than you think!',
  'Great things start with small steps.',
  'Stay consistent, stay healthy!',
  'Your body will thank you for moving today.',
];

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function HomeScreen() {
  const theme = useTheme();
  const [summary, setSummary] = useState<DailySummary>({
    totalCalories: 0,
    totalProtein: 0,
    totalSodium: 0,
    exerciseCount: 0,
    totalWalkSeconds: 0,
  });
  const [walkWeek, setWalkWeek] = useState(1);
  const [motivation] = useState(
    () => MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)],
  );

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { useFoodStore } = await import('../../stores/food-store');
      const { useExerciseStore } = await import('../../stores/exercise-store');
      const { useWalkStore } = await import('../../stores/walk-store');
      const { useUserStore } = await import('../../stores/user-store');

      const today = getTodayString();

      // Load data into stores
      useFoodStore.getState().loadDailyLog(today);
      useExerciseStore.getState().loadDailyLog(today);
      useWalkStore.getState().loadWalkLogs(today);

      const foodState = useFoodStore.getState();
      const exerciseState = useExerciseStore.getState();
      const walkState = useWalkStore.getState();
      const userState = useUserStore.getState();

      setSummary({
        totalCalories: foodState.dailyCalories,
        totalProtein: foodState.dailyProtein,
        totalSodium: foodState.dailySodium,
        exerciseCount: exerciseState.dailyExerciseLog.length,
        totalWalkSeconds: walkState.walkLogs.reduce((s, e) => s + (e.duration_seconds ?? 0), 0),
      });
      setWalkWeek(userState.walkingProgramWeek ?? 1);
    } catch {
      // stores may not be ready yet
    }
  }

  const formatWalkTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scroll: { padding: theme.spacing.lg },
    greeting: {
      fontSize: theme.typography.h1.fontSize,
      fontWeight: theme.typography.h1.fontWeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    motivation: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.primary,
      fontStyle: 'italic',
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: theme.typography.h2.fontWeight,
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
    },
    cardLabel: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
    },
    cardValue: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: '700',
      color: theme.colors.text,
    },
    quickActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    actionBtn: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: 18,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 56,
    },
    actionBtnText: {
      color: theme.colors.primaryText,
      fontSize: theme.typography.body.fontSize,
      fontWeight: '700',
      marginTop: 4,
    },
    progressContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    progressLabel: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    progressBarBg: {
      height: 16,
      backgroundColor: theme.colors.border,
      borderRadius: 8,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: 16,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
    },
  });

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.greeting}>Good Day!</Text>
        <Text style={s.motivation}>{motivation}</Text>

        <Text style={s.sectionTitle}>Today's Summary</Text>

        <View style={s.card}>
          <View style={s.cardRow}>
            <Text style={s.cardLabel}>Calories</Text>
            <Text style={s.cardValue}>{summary.totalCalories}</Text>
          </View>
        </View>

        <View style={s.card}>
          <View style={s.cardRow}>
            <Text style={s.cardLabel}>Protein</Text>
            <Text style={s.cardValue}>{summary.totalProtein}g</Text>
          </View>
        </View>

        <View style={s.card}>
          <View style={s.cardRow}>
            <Text style={s.cardLabel}>Sodium</Text>
            <Text style={s.cardValue}>{summary.totalSodium}mg</Text>
          </View>
        </View>

        <View style={s.card}>
          <View style={s.cardRow}>
            <Text style={s.cardLabel}>Exercises Done</Text>
            <Text style={s.cardValue}>{summary.exerciseCount}</Text>
          </View>
        </View>

        <View style={s.card}>
          <View style={s.cardRow}>
            <Text style={s.cardLabel}>Walk Time</Text>
            <Text style={s.cardValue}>{formatWalkTime(summary.totalWalkSeconds)}</Text>
          </View>
        </View>

        <Text style={s.sectionTitle}>Quick Actions</Text>
        <View style={s.quickActions}>
          <TouchableOpacity
            style={s.actionBtn}
            onPress={() => router.push('/(tabs)/nutrition')}
            accessibilityLabel="Log Food"
          >
            <Ionicons name="nutrition" size={24} color="#FFFFFF" />
            <Text style={s.actionBtnText}>Log Food</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.actionBtn}
            onPress={() => router.push('/(tabs)/exercises')}
            accessibilityLabel="Log Exercise"
          >
            <Ionicons name="fitness" size={24} color="#FFFFFF" />
            <Text style={s.actionBtnText}>Log Exercise</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.actionBtn}
            onPress={() => router.push('/(tabs)/walking')}
            accessibilityLabel="Start Walk"
          >
            <Ionicons name="walk" size={24} color="#FFFFFF" />
            <Text style={s.actionBtnText}>Start Walk</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.sectionTitle}>Walking Program</Text>
        <View style={s.progressContainer}>
          <Text style={s.progressLabel}>
            Week {walkWeek} of 12
          </Text>
          <View style={s.progressBarBg}>
            <View
              style={[s.progressBarFill, { width: `${Math.round((walkWeek / 12) * 100)}%` }]}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
