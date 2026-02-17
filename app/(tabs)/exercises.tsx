import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/theme';
import type { Exercise } from '../../types';

const CATEGORIES = ['All', 'Balance', 'Strength', 'Flexibility', 'Cardio'] as const;

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function ExercisesScreen() {
  const theme = useTheme();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[number]>('All');

  useEffect(() => {
    loadExercises();
  }, []);

  async function loadExercises() {
    try {
      const { useExerciseStore } = await import('../../stores/exercise-store');
      const all = useExerciseStore.getState().exercises ?? [];
      setExercises(all);
    } catch {}
  }

  const filtered = exercises.filter((e) => {
    const matchesCategory =
      selectedCategory === 'All' || e.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() || e.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLogExercise = useCallback(async (exercise: Exercise) => {
    try {
      const { useExerciseStore } = await import('../../stores/exercise-store');
      useExerciseStore.getState().logExercise({
        user_id: 1,
        date: getTodayString(),
        exercise_id: exercise.id,
        exercise_name: exercise.name,
        sets: 1,
        reps: 10,
        duration_seconds: null,
        notes: null,
      });
    } catch {}
  }, []);

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { flex: 1, padding: theme.spacing.md },
    searchInput: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 14,
      fontSize: 18,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    categoryRow: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    categoryBtn: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      minHeight: 48,
      justifyContent: 'center',
    },
    categoryBtnActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    categoryTextActive: {
      color: theme.colors.primaryText,
    },
    exerciseCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
    },
    exerciseImage: {
      width: '100%',
      height: 140,
      backgroundColor: theme.colors.border,
    },
    exerciseImagePlaceholder: {
      width: '100%',
      height: 140,
      backgroundColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    exerciseInfo: {
      padding: theme.spacing.md,
    },
    exerciseName: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 4,
    },
    exerciseMeta: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    cardActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    detailBtn: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: theme.borderRadius.sm,
      paddingVertical: 14,
      alignItems: 'center',
      minHeight: 56,
      justifyContent: 'center',
    },
    detailBtnText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    logBtn: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.sm,
      paddingVertical: 14,
      alignItems: 'center',
      minHeight: 56,
      justifyContent: 'center',
    },
    logBtnText: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.primaryText,
    },
    emptyText: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.xl,
    },
  });

  const renderExercise = ({ item }: { item: Exercise }) => (
    <View style={s.exerciseCard}>
      {item.image_uri ? (
        <Image source={{ uri: item.image_uri }} style={s.exerciseImage} resizeMode="cover" />
      ) : (
        <View style={s.exerciseImagePlaceholder}>
          <Ionicons name="fitness" size={48} color={theme.colors.textSecondary} />
        </View>
      )}
      <View style={s.exerciseInfo}>
        <Text style={s.exerciseName}>{item.name}</Text>
        <Text style={s.exerciseMeta}>
          {item.category} · {item.difficulty_level}
        </Text>
        <View style={s.cardActions}>
          <TouchableOpacity
            style={s.detailBtn}
            onPress={() =>
              router.push({
                pathname: '/exercise-detail',
                params: { id: item.id },
              })
            }
            accessibilityLabel={`View details for ${item.name}`}
          >
            <Text style={s.detailBtnText}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.logBtn}
            onPress={() => handleLogExercise(item)}
            accessibilityLabel={`Log ${item.name}`}
          >
            <Text style={s.logBtnText}>Log This</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.content}>
        {/* Search */}
        <TextInput
          style={s.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessibilityLabel="Search exercises"
        />

        {/* Category filters */}
        <FlatList
          horizontal
          data={CATEGORIES as unknown as typeof CATEGORIES[number][]}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.categoryRow}
          renderItem={({ item: cat }) => (
            <TouchableOpacity
              style={[s.categoryBtn, selectedCategory === cat && s.categoryBtnActive]}
              onPress={() => setSelectedCategory(cat)}
              accessibilityLabel={`Filter by ${cat}`}
            >
              <Text
                style={[s.categoryText, selectedCategory === cat && s.categoryTextActive]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Exercise list */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderExercise}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={s.emptyText}>No exercises found.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}
