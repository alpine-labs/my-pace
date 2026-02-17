import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/theme';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: theme.colors.primaryText,
        headerTitleStyle: { fontSize: 20, fontWeight: '700' },
        tabBarActiveTintColor: '#0077B6',
        tabBarInactiveTintColor: '#888888',
        tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
        tabBarIconStyle: { marginTop: 4 },
        tabBarStyle: {
          height: 70,
          paddingBottom: 8,
          paddingTop: 4,
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrition',
          tabBarIcon: ({ color }) => (
            <Ionicons name="nutrition" size={28} color={color} />
          ),
          tabBarAccessibilityLabel: 'Nutrition tab',
        }}
      />
      <Tabs.Screen
        name="walking"
        options={{
          title: 'Walking',
          tabBarIcon: ({ color }) => (
            <Ionicons name="walk" size={28} color={color} />
          ),
          tabBarAccessibilityLabel: 'Walking tab',
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          tabBarIcon: ({ color }) => (
            <Ionicons name="fitness" size={28} color={color} />
          ),
          tabBarAccessibilityLabel: 'Exercises tab',
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => (
            <Ionicons name="stats-chart" size={28} color={color} />
          ),
          tabBarAccessibilityLabel: 'Progress tab',
        }}
      />
    </Tabs>
  );
}
