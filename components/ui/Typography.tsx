import React from 'react';
import { Text, type TextProps } from 'react-native';
import { useTheme } from '../../constants/theme';

export interface TypographyProps extends TextProps {
  children: React.ReactNode;
}

export function H1({ style, children, ...rest }: TypographyProps) {
  const { colors, typography } = useTheme();
  return (
    <Text
      accessibilityRole="header"
      style={[typography.h1, { color: colors.text }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function H2({ style, children, ...rest }: TypographyProps) {
  const { colors, typography } = useTheme();
  return (
    <Text
      accessibilityRole="header"
      style={[typography.h2, { color: colors.text }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function H3({ style, children, ...rest }: TypographyProps) {
  const { colors, typography } = useTheme();
  return (
    <Text
      accessibilityRole="header"
      style={[typography.h3, { color: colors.text }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Body({ style, children, ...rest }: TypographyProps) {
  const { colors, typography } = useTheme();
  return (
    <Text style={[typography.body, { color: colors.text }, style]} {...rest}>
      {children}
    </Text>
  );
}

export function Caption({ style, children, ...rest }: TypographyProps) {
  const { colors, typography } = useTheme();
  return (
    <Text
      style={[typography.caption, { color: colors.textSecondary }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}
