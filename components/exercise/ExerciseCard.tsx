import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/theme';
import type { Exercise } from '../../types';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: (exercise: Exercise) => void;
  onLog: (exercise: Exercise) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  strength: '#E74C3C',
  cardio: '#3498DB',
  flexibility: '#2ECC71',
  balance: '#F39C12',
  endurance: '#9B59B6',
};

const DIFFICULTY_ICONS: Record<string, { count: number; color: string }> = {
  beginner: { count: 1, color: '#28A745' },
  intermediate: { count: 2, color: '#FFC107' },
  advanced: { count: 3, color: '#DC3545' },
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category.toLowerCase()] ?? '#6C757D';
}

function getDifficulty(level: string) {
  return DIFFICULTY_ICONS[level.toLowerCase()] ?? { count: 1, color: '#6C757D' };
}

export default function ExerciseCard({ exercise, onPress, onLog }: ExerciseCardProps) {
  const { colors, borderRadius } = useTheme();
  const difficulty = getDifficulty(exercise.difficulty_level);

  return (
    <Pressable
      onPress={() => onPress(exercise)}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
        },
      ]}
      accessibilityLabel={`${exercise.name}, ${exercise.category}, ${exercise.difficulty_level} difficulty`}
      accessibilityRole="button"
    >
      {/* Image or placeholder */}
      {exercise.image_uri ? (
        <Image
          source={{ uri: exercise.image_uri }}
          style={[styles.image, { borderTopLeftRadius: borderRadius.lg, borderTopRightRadius: borderRadius.lg }]}
          accessibilityLabel={`${exercise.name} image`}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              backgroundColor: colors.border,
              borderTopLeftRadius: borderRadius.lg,
              borderTopRightRadius: borderRadius.lg,
            },
          ]}
        >
          <Ionicons name="barbell-outline" size={40} color={colors.textSecondary} />
        </View>
      )}

      <View style={styles.content}>
        {/* Name */}
        <Text
          style={[styles.name, { color: colors.text }]}
          numberOfLines={2}
          accessibilityLabel={`Exercise: ${exercise.name}`}
        >
          {exercise.name}
        </Text>

        {/* Category badge + difficulty */}
        <View style={styles.meta}>
          <View
            style={[styles.categoryBadge, { backgroundColor: getCategoryColor(exercise.category) }]}
          >
            <Text style={styles.categoryText}>
              {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
            </Text>
          </View>

          <View
            style={styles.difficulty}
            accessibilityLabel={`Difficulty: ${exercise.difficulty_level}`}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <Ionicons
                key={i}
                name="flame"
                size={16}
                color={i < difficulty.count ? difficulty.color : colors.border}
              />
            ))}
          </View>
        </View>

        {/* Log button */}
        <Pressable
          onPress={() => onLog(exercise)}
          style={[
            styles.logButton,
            {
              backgroundColor: colors.success,
              borderRadius: borderRadius.sm,
            },
          ]}
          accessibilityLabel={`Log ${exercise.name}`}
          accessibilityRole="button"
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
          <Text style={styles.logButtonText}>Log</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  placeholder: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  difficulty: {
    flexDirection: 'row',
    gap: 2,
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    gap: 6,
  },
  logButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
