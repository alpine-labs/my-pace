import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, buildTheme } from '../constants/theme';
import type { ThemeMode } from '../types';

export default function RootLayout() {
  const [themeMode] = useState<ThemeMode>('light');
  const theme = buildTheme(themeMode);

  useEffect(() => {
    async function bootstrap() {
      try {
        const { initDatabase } = await import('../lib/database');
        await initDatabase();
      } catch {
        // database module may not exist yet
      }
      try {
        const { useUserStore } = await import('../stores/user-store');
        useUserStore.getState().initUser?.();
      } catch {
        // user store may not exist yet
      }
    }
    bootstrap();
  }, []);

  return (
    <ThemeProvider value={theme}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.primaryText,
          headerTitleStyle: { fontSize: 20, fontWeight: '700' },
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="exercise-detail"
          options={{ presentation: 'modal', title: 'Exercise Detail' }}
        />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    </ThemeProvider>
  );
}
