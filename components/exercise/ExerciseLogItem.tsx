import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/theme';
import type { ExerciseLogEntry } from '../../types';

interface ExerciseLogItemProps {
  entry: ExerciseLogEntry;
  onDelete: (id: number) => void;
}

function formatSetsReps(entry: ExerciseLogEntry): string {
  if (entry.sets != null && entry.reps != null) {
    return `${entry.sets} × ${entry.reps} reps`;
  }
  if (entry.duration_seconds != null) {
    const minutes = Math.floor(entry.duration_seconds / 60);
    const seconds = entry.duration_seconds % 60;
    if (minutes > 0 && seconds > 0) return `${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes} min`;
    return `${seconds}s`;
  }
  return '';
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function ExerciseLogItem({ entry, onDelete }: ExerciseLogItemProps) {
  const { colors, borderRadius } = useTheme();
  const detail = formatSetsReps(entry);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
        },
      ]}
      accessibilityLabel={`${entry.exercise_name}, ${detail}`}
    >
      <View style={styles.content}>
        <Text
          style={[styles.name, { color: colors.text }]}
          numberOfLines={1}
          accessibilityLabel={`Exercise: ${entry.exercise_name}`}
        >
          {entry.exercise_name}
        </Text>

        {detail !== '' && (
          <Text
            style={[styles.detail, { color: colors.textSecondary }]}
            accessibilityLabel={detail}
          >
            {detail}
          </Text>
        )}

        <Text
          style={[styles.time, { color: colors.textSecondary }]}
          accessibilityLabel={`Logged at ${formatTime(entry.created_at)}`}
        >
          {formatTime(entry.created_at)}
        </Text>
      </View>

      <Pressable
        onPress={() => onDelete(entry.id)}
        style={styles.deleteButton}
        accessibilityLabel={`Delete ${entry.exercise_name}`}
        accessibilityRole="button"
        hitSlop={8}
      >
        <Ionicons name="trash-outline" size={22} color={colors.error} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  detail: {
    fontSize: 18,
    marginBottom: 2,
  },
  time: {
    fontSize: 14,
  },
  deleteButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
