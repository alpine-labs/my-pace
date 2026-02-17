import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../constants/theme';
import { useWalkStore } from '../../stores/walk-store';

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

export default function WalkTimer() {
  const { colors, spacing, borderRadius } = useTheme();
  const { isWalking, currentDuration, dailyGoalMinutes, startWalk, stopWalk, updateCurrentDuration } =
    useWalkStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isWalking) {
      intervalRef.current = setInterval(() => {
        updateCurrentDuration();
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isWalking, updateCurrentDuration]);

  const goalSeconds = dailyGoalMinutes * 60;
  const goalReached = currentDuration >= goalSeconds;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface }]}
      accessibilityLabel="Walk timer section"
    >
      <Text
        style={[styles.goalText, { color: colors.textSecondary }]}
        accessibilityLabel={`Today's goal: ${dailyGoalMinutes} minutes`}
      >
        Today's Goal: {dailyGoalMinutes} min
      </Text>

      <Text
        style={[
          styles.timer,
          { color: goalReached ? colors.success : colors.text },
        ]}
        accessibilityLabel={`Elapsed time: ${formatTime(currentDuration)}`}
        accessibilityRole="timer"
      >
        {formatTime(currentDuration)}
      </Text>

      {goalReached && (
        <Text
          style={[styles.goalReachedText, { color: colors.success }]}
          accessibilityLabel="Goal reached!"
        >
          🎉 Goal Reached!
        </Text>
      )}

      <Pressable
        onPress={isWalking ? stopWalk : startWalk}
        style={[
          styles.button,
          {
            backgroundColor: isWalking ? colors.error : colors.success,
            borderRadius: borderRadius.lg,
          },
        ]}
        accessibilityLabel={isWalking ? 'Stop walk' : 'Start walk'}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>
          {isWalking ? 'Stop' : 'Start'}
        </Text>
      </Pressable>

      <Text
        style={[styles.progressText, { color: colors.textSecondary }]}
        accessibilityLabel={`${Math.floor(currentDuration / 60)} of ${dailyGoalMinutes} minutes completed`}
      >
        {Math.floor(currentDuration / 60)} / {dailyGoalMinutes} min
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
  },
  goalText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  timer: {
    fontSize: 56,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginVertical: 16,
  },
  goalReachedText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  button: {
    width: '100%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  progressText: {
    fontSize: 18,
    marginTop: 16,
  },
});
