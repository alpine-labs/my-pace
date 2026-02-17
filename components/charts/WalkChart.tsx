import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '../../constants/theme';

interface WalkChartProps {
  /** Walk durations in minutes for each of the last 7 days. */
  data: number[];
  /** Daily walk goal in minutes shown as a reference. */
  goal: number;
  /** Day labels, e.g. ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']. */
  labels?: string[];
}

const DEFAULT_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SCREEN_PADDING = 32;

export default function WalkChart({
  data,
  goal,
  labels = DEFAULT_LABELS,
}: WalkChartProps) {
  const { colors, mode, borderRadius } = useTheme();
  const screenWidth = Dimensions.get('window').width - SCREEN_PADDING;
  const isDark = mode === 'dark';

  const chartData = {
    labels,
    datasets: [
      {
        data,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: () => colors.primary,
    labelColor: () => colors.textSecondary,
    barPercentage: 0.6,
    propsForBackgroundLines: {
      stroke: colors.border,
      strokeDasharray: '4',
    },
    fillShadowGradientFrom: colors.primary,
    fillShadowGradientTo: isDark ? '#1E1E1E' : '#FFFFFF',
    fillShadowGradientFromOpacity: 0.8,
    fillShadowGradientToOpacity: 0.2,
    style: {
      borderRadius: borderRadius.md,
    },
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface, borderRadius: borderRadius.md }]}
      accessibilityLabel="Weekly walk duration chart"
    >
      <Text style={[styles.title, { color: colors.text }]}>Weekly Walks</Text>

      <View style={styles.goalRow}>
        <View style={[styles.goalLine, { backgroundColor: colors.success }]} />
        <Text style={[styles.goalLabel, { color: colors.textSecondary }]}>
          Goal: {goal} min
        </Text>
      </View>

      <BarChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        yAxisLabel=""
        yAxisSuffix=" min"
        withInnerLines
        showBarTops
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
    marginBottom: 8,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalLine: {
    width: 20,
    height: 3,
    borderRadius: 2,
    marginRight: 8,
  },
  goalLabel: {
    fontSize: 14,
  },
  chart: {
    borderRadius: 12,
  },
});
