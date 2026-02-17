import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../constants/theme';

interface CalorieChartProps {
  /** Calorie values for each of the last 7 days (Mon–Sun). */
  data: number[];
  /** Daily calorie goal shown as a reference line. */
  goal: number;
  /** Day labels, e.g. ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']. */
  labels?: string[];
}

const DEFAULT_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SCREEN_PADDING = 32;

export default function CalorieChart({
  data,
  goal,
  labels = DEFAULT_LABELS,
}: CalorieChartProps) {
  const { colors, mode, borderRadius } = useTheme();
  const screenWidth = Dimensions.get('window').width - SCREEN_PADDING;
  const isDark = mode === 'dark';

  const chartData = {
    labels,
    datasets: [
      {
        data,
        color: () => colors.primary,
        strokeWidth: 3,
      },
      {
        // Goal reference line
        data: Array(data.length).fill(goal),
        color: () => colors.success,
        strokeWidth: 2,
        withDots: false,
      },
    ],
    legend: ['Calories', 'Goal'],
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: () => (isDark ? '#FFFFFF' : '#000000'),
    labelColor: () => colors.textSecondary,
    propsForBackgroundLines: {
      stroke: colors.border,
      strokeDasharray: '4',
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: colors.primary,
    },
    style: {
      borderRadius: borderRadius.md,
    },
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface, borderRadius: borderRadius.md }]}
      accessibilityLabel="Weekly calorie trend chart"
    >
      <Text style={[styles.title, { color: colors.text }]}>Weekly Calories</Text>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        withInnerLines
        withOuterLines={false}
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 12,
  },
});
