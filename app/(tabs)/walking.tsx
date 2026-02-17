import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/theme';
import { WALKING_PROGRAM, TOTAL_PROGRAM_WEEKS } from '../../constants/walking-program';
import type { WalkLogEntry } from '../../types';

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function WalkingScreen() {
  const theme = useTheme();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [weekLog, setWeekLog] = useState<WalkLogEntry[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const weekData = WALKING_PROGRAM[currentWeek - 1] ?? WALKING_PROGRAM[0];
  const goalSeconds = weekData.dailyGoalMinutes * 60;

  useEffect(() => {
    loadData();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  async function loadData() {
    try {
      const { useUserStore } = await import('../../stores/user-store');
      const { useWalkStore } = await import('../../stores/walk-store');
      const userState = useUserStore.getState();
      const week = userState.walkingProgramWeek ?? 1;
      setCurrentWeek(week);

      const walkState = useWalkStore.getState();
      walkState.loadWalkLogs(getTodayString());
      setWeekLog(walkState.walkLogs);
    } catch {}
  }

  const startWalk = useCallback(() => {
    setIsRunning(true);
    setElapsed(0);
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopWalk = useCallback(async () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (elapsed > 0) {
      try {
        const { useWalkStore } = await import('../../stores/walk-store');
        useWalkStore.getState().saveWalk({
          user_id: 1,
          date: getTodayString(),
          duration_seconds: elapsed,
          program_week: currentWeek,
          goal_duration_seconds: goalSeconds,
          notes: null,
        });
        await loadData();
      } catch {}
    }
    setElapsed(0);
  }, [elapsed, currentWeek, goalSeconds]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  // Week completions
  const completedToday = weekLog.filter((w) => w.date === getTodayString());
  const totalWeekSeconds = weekLog.reduce((s, w) => s + w.duration_seconds, 0);
  const weekGoalTotal = weekData.dailyGoalMinutes * 7 * 60;
  const weekProgress = weekGoalTotal > 0 ? Math.min(totalWeekSeconds / weekGoalTotal, 1) : 0;

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scroll: { padding: theme.spacing.lg },
    weekBadge: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    weekText: {
      color: theme.colors.primaryText,
      fontSize: theme.typography.h2.fontSize,
      fontWeight: '700',
    },
    weekDesc: {
      color: theme.colors.primaryText,
      fontSize: theme.typography.body.fontSize,
      marginTop: 4,
      opacity: 0.9,
    },
    goalCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    goalLabel: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    goalValue: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text,
    },
    timerDisplay: {
      fontSize: 56,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
      marginVertical: theme.spacing.lg,
      fontVariant: ['tabular-nums'],
    },
    startBtn: {
      backgroundColor: theme.colors.success,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: 22,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
      minHeight: 80,
    },
    stopBtn: {
      backgroundColor: theme.colors.error,
    },
    btnText: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: '700',
    },
    sectionTitle: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
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
    logItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    logDate: {
      fontSize: 18,
      color: theme.colors.text,
      fontWeight: '600',
    },
    logDuration: {
      fontSize: 18,
      color: theme.colors.primary,
      fontWeight: '700',
    },
    emptyText: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    tip: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
  });

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Current week */}
        <View style={s.weekBadge}>
          <Text style={s.weekText}>
            Week {currentWeek} of {TOTAL_PROGRAM_WEEKS}
          </Text>
          <Text style={s.weekDesc}>{weekData.description}</Text>
        </View>

        {/* Today's goal */}
        <View style={s.goalCard}>
          <Text style={s.goalLabel}>Today's Goal</Text>
          <Text style={s.goalValue}>Walk for {weekData.dailyGoalMinutes} minutes</Text>
        </View>

        {/* Timer */}
        <Text style={s.timerDisplay}>{formatTimer(elapsed)}</Text>

        {/* Start/Stop */}
        <TouchableOpacity
          style={[s.startBtn, isRunning && s.stopBtn]}
          onPress={isRunning ? stopWalk : startWalk}
          accessibilityLabel={isRunning ? 'Stop Walk' : 'Start Walk'}
        >
          <Ionicons
            name={isRunning ? 'stop-circle' : 'play-circle'}
            size={36}
            color="#FFFFFF"
            style={{ marginBottom: 4 }}
          />
          <Text style={s.btnText}>{isRunning ? 'Stop Walk' : 'Start Walk'}</Text>
        </TouchableOpacity>

        <Text style={s.tip}>{weekData.tips}</Text>

        {/* Week progress */}
        <Text style={s.sectionTitle}>This Week's Progress</Text>
        <View style={s.progressContainer}>
          <Text style={s.progressLabel}>
            {formatDuration(totalWeekSeconds)} / {weekData.dailyGoalMinutes * 7}m goal
          </Text>
          <View style={s.progressBarBg}>
            <View
              style={[s.progressBarFill, { width: `${Math.round(weekProgress * 100)}%` }]}
            />
          </View>
        </View>

        {/* Walk history */}
        <Text style={s.sectionTitle}>This Week's Walks</Text>
        {weekLog.length === 0 ? (
          <Text style={s.emptyText}>No walks recorded this week yet.</Text>
        ) : (
          weekLog.map((walk) => (
            <View key={walk.id} style={s.logItem}>
              <Text style={s.logDate}>{walk.date}</Text>
              <Text style={s.logDuration}>{formatDuration(walk.duration_seconds)}</Text>
            </View>
          ))
        )}

        <View style={{ height: theme.spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}
