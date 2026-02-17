import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useTheme } from '../../constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({
  title,
  variant = 'primary',
  fullWidth = false,
  disabled,
  style,
  textStyle,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme();

  const containerStyles = (): ViewStyle => {
    const base: ViewStyle = {
      minHeight: 56,
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.5 : 1,
    };

    switch (variant) {
      case 'primary':
        return { ...base, backgroundColor: colors.primary };
      case 'secondary':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        };
      case 'danger':
        return { ...base, backgroundColor: colors.error };
      default:
        return { ...base, backgroundColor: colors.primary };
    }
  };

  const labelColor = (): string => {
    switch (variant) {
      case 'primary':
        return colors.primaryText;
      case 'secondary':
        return colors.primary;
      case 'danger':
        return colors.primaryText;
      default:
        return colors.primaryText;
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={({ pressed }) => [
        containerStyles(),
        fullWidth && styles.fullWidth,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      {...rest}
    >
      <Text style={[styles.label, { color: labelColor() }, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
