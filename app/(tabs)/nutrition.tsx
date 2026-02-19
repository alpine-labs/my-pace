import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/theme';
import { getUsdaApiKey } from '../../lib/config';
import type { FoodLogEntry, USDASearchResult } from '../../types';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function NutritionScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<USDASearchResult[]>([]);
  const [todayLog, setTodayLog] = useState<FoodLogEntry[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<typeof MEAL_TYPES[number]>('Breakfast');
  const [searching, setSearching] = useState(false);
  const [goals, setGoals] = useState({ calories: 2000, protein: 50, sodium: 2300 });

  useEffect(() => {
    loadTodayLog();
    loadGoals();
  }, []);

  async function loadGoals() {
    try {
      const { useUserStore } = await import('../../stores/user-store');
      const state = useUserStore.getState();
      setGoals({
        calories: state.calorieGoal ?? 2000,
        protein: state.proteinGoal ?? 50,
        sodium: state.sodiumGoal ?? 2300,
      });
    } catch {}
  }

  async function loadTodayLog() {
    try {
      const { useFoodStore } = await import('../../stores/food-store');
      useFoodStore.getState().loadDailyLog(getTodayString());
      setTodayLog(useFoodStore.getState().dailyFoodLog);
    } catch {}
  }

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const { useFoodStore } = await import('../../stores/food-store');
      await useFoodStore.getState().searchFoods(query.trim(), getUsdaApiKey());
      setResults(useFoodStore.getState().searchResults);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [query]);

  const handleAdd = useCallback(async (food: USDASearchResult) => {
    try {
      const { useFoodStore } = await import('../../stores/food-store');
      useFoodStore.getState().addFoodEntry({
        user_id: 1,
        date: getTodayString(),
        meal_type: selectedMeal,
        food_name: food.description,
        usda_fdc_id: food.fdcId,
        serving_size: food.servingSize ?? 1,
        serving_unit: food.servingSizeUnit ?? 'serving',
        calories: food.calories,
        protein_g: food.protein_g,
        sodium_mg: food.sodium_mg,
      });
      setTodayLog(useFoodStore.getState().dailyFoodLog);
    } catch {}
  }, [selectedMeal]);

  const handleDelete = useCallback(async (id: number) => {
    Alert.alert('Delete', 'Remove this food entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const { useFoodStore } = await import('../../stores/food-store');
            useFoodStore.getState().deleteFoodEntry(id);
            setTodayLog(useFoodStore.getState().dailyFoodLog);
          } catch {}
        },
      },
    ]);
  }, []);

  const totals = todayLog.reduce(
    (acc, e) => ({
      calories: acc.calories + (e.calories ?? 0),
      protein: acc.protein + (e.protein_g ?? 0),
      sodium: acc.sodium + (e.sodium_mg ?? 0),
    }),
    { calories: 0, protein: 0, sodium: 0 },
  );

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { flex: 1, padding: theme.spacing.md },
    searchRow: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 14,
      fontSize: 18,
      color: theme.colors.text,
    },
    searchBtn: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 56,
    },
    mealRow: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    mealBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      minHeight: 56,
      justifyContent: 'center',
    },
    mealBtnActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    mealBtnText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    mealBtnTextActive: {
      color: theme.colors.primaryText,
    },
    totalsBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    totalItem: { alignItems: 'center' },
    totalLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    totalValue: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
    },
    totalGoal: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    sectionTitle: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    resultItem: {
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
    resultInfo: { flex: 1, marginRight: theme.spacing.sm },
    resultName: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    resultDetails: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    addBtn: {
      backgroundColor: theme.colors.success,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: 18,
      paddingVertical: 12,
      minHeight: 56,
      justifyContent: 'center',
    },
    addBtnText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
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
    logInfo: { flex: 1 },
    logName: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    logMeta: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    deleteBtn: {
      padding: theme.spacing.sm,
      minWidth: 48,
      minHeight: 48,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.lg,
    },
  });

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.content}>
        {/* Search bar */}
        <View style={s.searchRow}>
          <TextInput
            style={s.searchInput}
            placeholder="Search foods..."
            placeholderTextColor={theme.colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            accessibilityLabel="Search foods"
          />
          <TouchableOpacity
            style={s.searchBtn}
            onPress={handleSearch}
            accessibilityLabel="Search button"
          >
            <Ionicons name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Meal type selector */}
        <View style={s.mealRow}>
          {MEAL_TYPES.map((meal) => (
            <TouchableOpacity
              key={meal}
              style={[s.mealBtn, selectedMeal === meal && s.mealBtnActive]}
              onPress={() => setSelectedMeal(meal)}
              accessibilityLabel={`Select ${meal}`}
            >
              <Text
                style={[s.mealBtnText, selectedMeal === meal && s.mealBtnTextActive]}
              >
                {meal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Running totals */}
        <View style={s.totalsBar}>
          <View style={s.totalItem}>
            <Text style={s.totalLabel}>Calories</Text>
            <Text style={s.totalValue}>{totals.calories}</Text>
            <Text style={s.totalGoal}>/ {goals.calories}</Text>
          </View>
          <View style={s.totalItem}>
            <Text style={s.totalLabel}>Protein</Text>
            <Text style={s.totalValue}>{totals.protein}g</Text>
            <Text style={s.totalGoal}>/ {goals.protein}g</Text>
          </View>
          <View style={s.totalItem}>
            <Text style={s.totalLabel}>Sodium</Text>
            <Text style={s.totalValue}>{totals.sodium}mg</Text>
            <Text style={s.totalGoal}>/ {goals.sodium}mg</Text>
          </View>
        </View>

        <FlatList
          data={results.length > 0 ? undefined : undefined}
          ListHeaderComponent={
            <>
              {/* Search results */}
              {searching && <ActivityIndicator size="large" color={theme.colors.primary} />}
              {results.length > 0 && (
                <>
                  <Text style={s.sectionTitle}>Search Results</Text>
                  {results.map((item) => (
                    <View key={item.fdcId} style={s.resultItem}>
                      <View style={s.resultInfo}>
                        <Text style={s.resultName} numberOfLines={2}>
                          {item.description}
                        </Text>
                        <Text style={s.resultDetails}>
                          {item.calories} cal · {item.protein_g}g protein · {item.sodium_mg}mg sodium
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={s.addBtn}
                        onPress={() => handleAdd(item)}
                        accessibilityLabel={`Add ${item.description}`}
                      >
                        <Text style={s.addBtnText}>Add</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </>
              )}

              {/* Today's log */}
              <Text style={s.sectionTitle}>Today's Food Log</Text>
            </>
          }
          renderItem={null}
          ListFooterComponent={
            todayLog.length === 0 ? (
              <Text style={s.emptyText}>No foods logged today. Search above to add!</Text>
            ) : (
              <>
                {todayLog.map((entry) => (
                  <View key={entry.id} style={s.logItem}>
                    <View style={s.logInfo}>
                      <Text style={s.logName}>{entry.food_name}</Text>
                      <Text style={s.logMeta}>
                        {entry.meal_type} · {entry.calories} cal · {entry.protein_g}g P · {entry.sodium_mg}mg Na
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={s.deleteBtn}
                      onPress={() => handleDelete(entry.id)}
                      accessibilityLabel={`Delete ${entry.food_name}`}
                    >
                      <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
