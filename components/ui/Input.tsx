import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../constants/theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function Input({
  label,
  error,
  containerStyle,
  style,
  ...rest
}: InputProps) {
  const { colors, spacing, borderRadius, typography } = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : focused
      ? colors.primary
      : colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text
          style={[
            styles.label,
            { color: colors.text, marginBottom: spacing.sm },
          ]}
        >
          {label}
        </Text>
      ) : null}

      <TextInput
        placeholderTextColor={colors.textSecondary}
        style={[
          styles.input,
          {
            fontSize: typography.body.fontSize,
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.md,
          },
          style,
        ]}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        {...rest}
      />

      {error ? (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    minHeight: 56,
    borderWidth: 1.5,
  },
  error: {
    fontSize: 14,
    marginTop: 4,
  },
});
