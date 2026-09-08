// src/components/FormField.tsx
// Componente reutilizable: encapsula Controller + TextInput + mensaje de error inline

import React, { useState } from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

interface FormFieldProps<T extends FieldValues>
  extends Omit<TextInputProps, 'defaultValue'> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  errorMessage?: string;
  required?: boolean;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  errorMessage,
  required = false,
  style,
  onFocus,
  onBlur: customOnBlur,
  ...inputProps
}: FormFieldProps<T>): React.JSX.Element {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredMark}>*</Text>}
      </View>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => {
          const displayValue =
            value === undefined || value === null
              ? ''
              : typeof value === 'number'
              ? String(value)
              : String(value);

          return (
            <TextInput
              style={[
                styles.input,
                isFocused && styles.inputFocused,
                !!errorMessage && styles.inputError,
                style,
              ]}
              value={displayValue}
              onChangeText={onChange}
              onFocus={(e) => {
                setIsFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                onBlur();
                customOnBlur?.(e);
              }}
              placeholderTextColor={COLORS.textSubtle}
              {...inputProps}
            />
          );
        }}
      />

      <Text style={styles.error} numberOfLines={1}>
        {errorMessage ? `⚠ ${errorMessage}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: SPACING.xs },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  label: { ...TYPOGRAPHY.label, textTransform: 'uppercase', letterSpacing: 0.5 },
  requiredMark: { fontSize: 12, fontWeight: '700', color: COLORS.primaryLight },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  inputFocused: { borderColor: COLORS.primary, backgroundColor: COLORS.surface },
  inputError: { borderColor: COLORS.error, backgroundColor: COLORS.errorBg },
  error: { ...TYPOGRAPHY.error, minHeight: 16 },
});
