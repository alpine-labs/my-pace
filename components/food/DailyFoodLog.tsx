import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/theme';
import type { FoodLogEntry } from '../../types';

interface DailyFoodLogProps {
  entries: FoodLogEntry[];
  onDelete: (id: number) => void;
}

const MEAL_COLORS: Record<string, string> = {
  breakfast: '#FF9F43',
  lunch: '#54A0FF',
  dinner: '#5F27CD',
  snack: '#01A3A4',
};

function getMealColor(mealType: string): string {
  return MEAL_COLORS[mealType.toLowerCase()] ?? '#6C757D';
}

export default function DailyFoodLog({ entries, onDelete }: DailyFoodLogProps) {
  const { colors, borderRadius } = useTheme();

  const totals = entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein_g,
      sodium: acc.sodium + entry.sodium_mg,
    }),
    { calories: 0, protein: 0, sodium: 0 },
  );

  const renderItem = ({ item }: { item: FoodLogEntry }) => (
    <View
      style={[
        styles.item,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
        },
      ]}
      accessibilityLabel={`${item.food_name}, ${item.meal_type}, ${Math.round(item.calories)} calories`}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text
            style={[styles.foodName, { color: colors.text }]}
            numberOfLines={1}
            accessibilityLabel={`Food: ${item.food_name}`}
          >
            {item.food_name}
          </Text>
          <View
            style={[
              styles.mealBadge,
              { backgroundColor: getMealColor(item.meal_type) },
            ]}
          >
            <Text style={styles.mealBadgeText}>
              {item.meal_type.charAt(0).toUpperCase() + item.meal_type.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.itemNutrients}>
          <Text style={[styles.nutrientText, { color: colors.textSecondary }]}>
            {Math.round(item.calories)} cal
          </Text>
          <Text style={[styles.nutrientText, { color: colors.textSecondary }]}>
            {item.protein_g.toFixed(1)}g protein
          </Text>
          <Text style={[styles.nutrientText, { color: colors.textSecondary }]}>
            {Math.round(item.sodium_mg)}mg sodium
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => onDelete(item.id)}
        style={styles.deleteButton}
        accessibilityLabel={`Delete ${item.food_name}`}
        accessibilityRole="button"
        hitSlop={8}
      >
        <Ionicons name="trash-outline" size={22} color={colors.error} />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Summary bar */}
      <View
        style={[
          styles.summaryBar,
          {
            backgroundColor: colors.primary,
            borderRadius: borderRadius.md,
          },
        ]}
        accessibilityLabel={`Daily totals: ${Math.round(totals.calories)} calories, ${totals.protein.toFixed(1)} grams protein, ${Math.round(totals.sodium)} milligrams sodium`}
      >
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{Math.round(totals.calories)}</Text>
          <Text style={styles.summaryLabel}>Calories</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totals.protein.toFixed(1)}g</Text>
          <Text style={styles.summaryLabel}>Protein</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{Math.round(totals.sodium)}mg</Text>
          <Text style={styles.summaryLabel}>Sodium</Text>
        </View>
      </View>

      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="restaurant-outline"
            size={48}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No food logged today
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Tap the + button to add your meals
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  summaryLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 2,
  },
  list: {
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  mealBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mealBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  itemNutrients: {
    flexDirection: 'row',
    gap: 12,
  },
  nutrientText: {
    fontSize: 15,
  },
  deleteButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    marginTop: 8,
  },
});
