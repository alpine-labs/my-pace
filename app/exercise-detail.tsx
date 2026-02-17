import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../constants/theme';
import type { Exercise } from '../types';

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function ExerciseDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [sets, setSets] = useState('1');
  const [reps, setReps] = useState('10');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    loadExercise();
  }, [id]);

  async function loadExercise() {
    try {
      const { useExerciseStore } = await import('../stores/exercise-store');
      const all = useExerciseStore.getState().exercises ?? [];
      const found = all.find((e: Exercise) => e.id === id);
      if (found) setExercise(found);
    } catch {}
  }

  const handleLog = async () => {
    if (!exercise) return;
    try {
      const { useExerciseStore } = await import('../stores/exercise-store');
      useExerciseStore.getState().logExercise({
        user_id: 1,
        date: getTodayString(),
        exercise_id: exercise.id,
        exercise_name: exercise.name,
        sets: parseInt(sets, 10) || null,
        reps: parseInt(reps, 10) || null,
        duration_seconds: duration ? parseInt(duration, 10) : null,
        notes: null,
      });
      Alert.alert('Logged!', `${exercise.name} has been added to today's log.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Could not log exercise.');
    }
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scroll: { flex: 1 },
    image: {
      width: '100%',
      height: 240,
      backgroundColor: theme.colors.border,
    },
    imagePlaceholder: {
      width: '100%',
      height: 240,
      backgroundColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    body: { padding: theme.spacing.lg },
    name: {
      fontSize: theme.typography.h1.fontSize,
      fontWeight: theme.typography.h1.fontWeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    badge: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: 14,
      paddingVertical: 6,
      marginBottom: theme.spacing.lg,
    },
    badgeText: {
      color: theme.colors.primaryText,
      fontSize: 16,
      fontWeight: '600',
    },
    sectionTitle: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
    description: {
      fontSize: theme.typography.body.fontSize,
      lineHeight: theme.typography.body.lineHeight,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    },
    instructions: {
      fontSize: theme.typography.body.fontSize,
      lineHeight: theme.typography.body.lineHeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    },
    inputRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    inputGroup: { flex: 1 },
    inputLabel: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 14,
      fontSize: 20,
      color: theme.colors.text,
      textAlign: 'center',
      minHeight: 56,
    },
    logBtn: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: 18,
      alignItems: 'center',
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xl,
      minHeight: 60,
      justifyContent: 'center',
    },
    logBtnText: {
      color: theme.colors.primaryText,
      fontSize: 20,
      fontWeight: '700',
    },
    backBtn: {
      position: 'absolute',
      top: theme.spacing.md,
      left: theme.spacing.md,
      backgroundColor: '#00000050',
      borderRadius: 24,
      width: 48,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    notFound: {
      fontSize: 20,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.xl,
    },
  });

  if (!exercise) {
    return (
      <SafeAreaView style={s.container}>
        <Text style={s.notFound}>Exercise not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={['bottom']}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Image */}
        {exercise.image_uri ? (
          <Image source={{ uri: exercise.image_uri }} style={s.image} resizeMode="cover" />
        ) : (
          <View style={s.imagePlaceholder}>
            <Ionicons name="fitness" size={64} color={theme.colors.textSecondary} />
          </View>
        )}

        <TouchableOpacity
          style={s.backBtn}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={s.body}>
          <Text style={s.name}>{exercise.name}</Text>
          <View style={s.badge}>
            <Text style={s.badgeText}>{exercise.category}</Text>
          </View>

          <Text style={s.sectionTitle}>Description</Text>
          <Text style={s.description}>{exercise.description}</Text>

          <Text style={s.sectionTitle}>Instructions</Text>
          <Text style={s.instructions}>{exercise.instructions}</Text>

          <Text style={s.sectionTitle}>Log Exercise</Text>
          <View style={s.inputRow}>
            <View style={s.inputGroup}>
              <Text style={s.inputLabel}>Sets</Text>
              <TextInput
                style={s.input}
                value={sets}
                onChangeText={setSets}
                keyboardType="number-pad"
                accessibilityLabel="Number of sets"
              />
            </View>
            <View style={s.inputGroup}>
              <Text style={s.inputLabel}>Reps</Text>
              <TextInput
                style={s.input}
                value={reps}
                onChangeText={setReps}
                keyboardType="number-pad"
                accessibilityLabel="Number of reps"
              />
            </View>
            <View style={s.inputGroup}>
              <Text style={s.inputLabel}>Duration (s)</Text>
              <TextInput
                style={s.input}
                value={duration}
                onChangeText={setDuration}
                keyboardType="number-pad"
                placeholder="—"
                placeholderTextColor={theme.colors.textSecondary}
                accessibilityLabel="Duration in seconds"
              />
            </View>
          </View>

          <TouchableOpacity
            style={s.logBtn}
            onPress={handleLog}
            accessibilityLabel="Log exercise"
          >
            <Text style={s.logBtnText}>Log Exercise</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
