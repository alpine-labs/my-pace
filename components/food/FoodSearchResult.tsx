import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../constants/theme';

export interface FoodSearchResultItem {
  fdcId: string;
  description: string;
  calories: number;
  protein_g: number;
  sodium_mg: number;
  servingSize?: number;
  servingSizeUnit?: string;
}

interface FoodSearchResultProps {
  item: FoodSearchResultItem;
  onAdd: (item: FoodSearchResultItem) => void;
}

export default function FoodSearchResult({ item, onAdd }: FoodSearchResultProps) {
  const { colors, borderRadius, spacing } = useTheme();

  const servingLabel =
    item.servingSize && item.servingSizeUnit
      ? `${item.servingSize} ${item.servingSizeUnit}`
      : 'Standard serving';

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
      accessibilityLabel={`${item.description}, ${item.calories} calories`}
    >
      <View style={styles.info}>
        <Text
          style={[styles.name, { color: colors.text }]}
          numberOfLines={2}
          accessibilityLabel={`Food name: ${item.description}`}
        >
          {item.description}
        </Text>

        <Text
          style={[styles.serving, { color: colors.textSecondary }]}
          accessibilityLabel={`Serving size: ${servingLabel}`}
        >
          {servingLabel}
        </Text>

        <View style={styles.nutrients}>
          <View style={styles.nutrient}>
            <Text style={[styles.nutrientValue, { color: colors.text }]}>
              {Math.round(item.calories)}
            </Text>
            <Text style={[styles.nutrientLabel, { color: colors.textSecondary }]}>
              Cal
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.nutrient}>
            <Text style={[styles.nutrientValue, { color: colors.text }]}>
              {item.protein_g.toFixed(1)}g
            </Text>
            <Text style={[styles.nutrientLabel, { color: colors.textSecondary }]}>
              Protein
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.nutrient}>
            <Text style={[styles.nutrientValue, { color: colors.text }]}>
              {Math.round(item.sodium_mg)}mg
            </Text>
            <Text style={[styles.nutrientLabel, { color: colors.textSecondary }]}>
              Sodium
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => onAdd(item)}
        style={[
          styles.addButton,
          {
            backgroundColor: colors.primary,
            borderRadius: borderRadius.sm,
          },
        ]}
        accessibilityLabel={`Add ${item.description}`}
        accessibilityRole="button"
      >
        <Text style={styles.addButtonText}>Add</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  serving: {
    fontSize: 14,
    marginBottom: 8,
  },
  nutrients: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutrient: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  nutrientValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  nutrientLabel: {
    fontSize: 14,
  },
  divider: {
    width: 1,
    height: 28,
  },
  addButton: {
    width: 72,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
