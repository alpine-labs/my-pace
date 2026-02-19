import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/theme';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const theme = useTheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [calorieGoal, setCalorieGoal] = useState('2000');
  const [proteinGoal, setProteinGoal] = useState('50');
  const [sodiumGoal, setSodiumGoal] = useState('2300');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [usdaApiKey, setUsdaApiKey] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const { useUserStore } = await import('../stores/user-store');
      const state = useUserStore.getState();
      setThemeMode(state.themeMode ?? 'light');
      setCalorieGoal(String(state.calorieGoal ?? 2000));
      setProteinGoal(String(state.proteinGoal ?? 50));
      setSodiumGoal(String(state.sodiumGoal ?? 2300));
      setNotificationsEnabled(state.notificationsEnabled ?? true);
      setUsdaApiKey(state.usdaApiKey ?? '');
    } catch {}
  }

  const saveGoals = async () => {
    try {
      const { useUserStore } = await import('../stores/user-store');
      useUserStore.getState().setGoals({
        calorieGoal: parseInt(calorieGoal, 10) || 2000,
        proteinGoal: parseInt(proteinGoal, 10) || 50,
        sodiumGoal: parseInt(sodiumGoal, 10) || 2300,
      });
      Alert.alert('Saved', 'Your goals have been updated.');
    } catch {}
  };

  const toggleTheme = async () => {
    const next = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(next);
    try {
      const { useUserStore } = await import('../stores/user-store');
      useUserStore.getState().setTheme(next);
    } catch {}
  };

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    try {
      const { useUserStore } = await import('../stores/user-store');
      useUserStore.getState().setNotifications(value);
    } catch {}
  };

  const saveUsdaApiKey = async () => {
    try {
      const { useUserStore } = await import('../stores/user-store');
      useUserStore.getState().setUsdaApiKey(usdaApiKey.trim());
      Alert.alert('Saved', usdaApiKey.trim() ? 'USDA API key saved.' : 'Cleared — using demo key (rate-limited).');
    } catch {}
  };

  const resetWalkingProgram = async () => {
    Alert.alert(
      'Reset Walking Program',
      'This will reset your walking program to Week 1. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              const { useUserStore } = await import('../stores/user-store');
              useUserStore.getState().setWalkingProgramStart(
                new Date().toISOString().split('T')[0],
              );
              Alert.alert('Done', 'Walking program reset to Week 1.');
            } catch {}
          },
        },
      ],
    );
  };

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scroll: { padding: theme.spacing.lg },
    sectionTitle: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: theme.typography.h2.fontWeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    label: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      fontWeight: '600',
    },
    sublabel: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    inputGroup: {
      marginBottom: theme.spacing.md,
    },
    inputLabel: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: 6,
    },
    input: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 14,
      fontSize: 20,
      color: theme.colors.text,
      minHeight: 56,
    },
    saveBtn: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: 18,
      alignItems: 'center',
      marginTop: theme.spacing.sm,
      minHeight: 56,
      justifyContent: 'center',
    },
    saveBtnText: {
      color: theme.colors.primaryText,
      fontSize: theme.typography.body.fontSize,
      fontWeight: '700',
    },
    dangerBtn: {
      backgroundColor: theme.colors.error,
      borderRadius: theme.borderRadius.md,
      paddingVertical: 18,
      alignItems: 'center',
      minHeight: 56,
      justifyContent: 'center',
    },
    dangerBtnText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '700',
    },
    versionText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
    },
  });

  return (
    <SafeAreaView style={s.container} edges={['bottom']}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Theme */}
        <Text style={s.sectionTitle}>Appearance</Text>
        <View style={s.card}>
          <View style={s.row}>
            <View>
              <Text style={s.label}>Dark Mode</Text>
              <Text style={s.sublabel}>
                {themeMode === 'dark' ? 'On' : 'Off'}
              </Text>
            </View>
            <Switch
              value={themeMode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              accessibilityLabel="Toggle dark mode"
            />
          </View>
        </View>

        {/* Goals */}
        <Text style={s.sectionTitle}>Daily Goals</Text>
        <View style={s.card}>
          <View style={s.inputGroup}>
            <Text style={s.inputLabel}>Calorie Goal</Text>
            <TextInput
              style={s.input}
              value={calorieGoal}
              onChangeText={setCalorieGoal}
              keyboardType="number-pad"
              accessibilityLabel="Calorie goal"
            />
          </View>
          <View style={s.inputGroup}>
            <Text style={s.inputLabel}>Protein Goal (g)</Text>
            <TextInput
              style={s.input}
              value={proteinGoal}
              onChangeText={setProteinGoal}
              keyboardType="number-pad"
              accessibilityLabel="Protein goal in grams"
            />
          </View>
          <View style={s.inputGroup}>
            <Text style={s.inputLabel}>Sodium Goal (mg)</Text>
            <TextInput
              style={s.input}
              value={sodiumGoal}
              onChangeText={setSodiumGoal}
              keyboardType="number-pad"
              accessibilityLabel="Sodium goal in milligrams"
            />
          </View>
          <TouchableOpacity
            style={s.saveBtn}
            onPress={saveGoals}
            accessibilityLabel="Save goals"
          >
            <Text style={s.saveBtnText}>Save Goals</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <Text style={s.sectionTitle}>Notifications</Text>
        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.label}>Enable Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              accessibilityLabel="Toggle notifications"
            />
          </View>
        </View>

        {/* USDA API Key */}
        <Text style={s.sectionTitle}>Nutrition API</Text>
        <View style={s.card}>
          <View style={s.inputGroup}>
            <Text style={s.inputLabel}>USDA API Key</Text>
            <Text style={s.sublabel}>
              Get a free key at fdc.nal.usda.gov/api-key-signup
            </Text>
            <TextInput
              style={[s.input, { marginTop: 8 }]}
              value={usdaApiKey}
              onChangeText={setUsdaApiKey}
              placeholder="DEMO_KEY (rate-limited)"
              placeholderTextColor={theme.colors.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="USDA API key"
            />
          </View>
          <TouchableOpacity
            style={s.saveBtn}
            onPress={saveUsdaApiKey}
            accessibilityLabel="Save API key"
          >
            <Text style={s.saveBtnText}>Save API Key</Text>
          </TouchableOpacity>
        </View>

        {/* Walking program */}
        <Text style={s.sectionTitle}>Walking Program</Text>
        <View style={s.card}>
          <TouchableOpacity
            style={s.dangerBtn}
            onPress={resetWalkingProgram}
            accessibilityLabel="Reset walking program"
          >
            <Text style={s.dangerBtnText}>Reset Walking Program</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={s.versionText}>MyPace v{appVersion}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
