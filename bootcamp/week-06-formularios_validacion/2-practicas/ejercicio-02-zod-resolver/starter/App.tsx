// App.tsx — Ejercicio 02: Validación Zod + zodResolver
// Formulario de pedido con validación completa y mensajes de error inline

import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

// ============================================
// PASO 1: definir el schema Zod y el tipo inferido
// ============================================
const orderSchema = z.object({
  name: z.string().min(2, 'Mín. 2 caracteres'),
  email: z.string().email('Email inválido'),
  quantity: z.coerce.number().int('Debe ser entero').min(1, 'Cantidad mínima: 1'),
});

type OrderFormData = z.infer<typeof orderSchema>;

export default function App(): React.JSX.Element {
  // ============================================
  // PASO 2: useForm con zodResolver
  // ============================================
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: { name: '', email: '', quantity: 1 as unknown as number },
  });

  async function onSubmit(data: OrderFormData): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, 1200));
    console.log('✅ Pedido enviado:', data);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Formulario de Pedido</Text>
        <Text style={styles.subtitle}>Ejercicio 02 — Validación con Zod</Text>

        {/* ============================================
            PASO 3: campo name con error inline
            ============================================ */}
        <View style={styles.field}>
          <Text style={styles.label}>Nombre</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Tu nombre completo"
                placeholderTextColor="#6B7280"
                returnKeyType="next"
              />
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}
        </View>

        {/* ============================================
            PASO 3: campo email con error inline
            ============================================ */}
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="tu@email.com"
                placeholderTextColor="#6B7280"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}
        </View>

        {/* ============================================
            PASO 4: campo numérico con z.coerce.number
            ============================================ */}
        <View style={styles.field}>
          <Text style={styles.label}>Cantidad</Text>
          <Controller
            control={control}
            name="quantity"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.quantity && styles.inputError]}
                value={value !== undefined && value !== null ? String(value) : ''}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="1"
                placeholderTextColor="#6B7280"
                keyboardType="number-pad"
              />
            )}
          />
          {errors.quantity && (
            <Text style={styles.errorText}>{errors.quantity.message}</Text>
          )}
        </View>

        {/* Botón con isSubmitting */}
        <Pressable
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#111827" />
          ) : (
            <Text style={styles.buttonText}>Realizar pedido</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#111827' },
  container: { flex: 1 },
  content: { padding: 24, gap: 16, paddingBottom: 48 },
  title: { fontSize: 22, fontWeight: '700', color: '#F9FAFB' },
  subtitle: { fontSize: 13, color: '#6B7280', marginTop: -8 },
  field: { gap: 4 },
  label: { fontSize: 13, fontWeight: '600', color: '#D1D5DB' },
  input: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#F9FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#F87171',
    marginTop: 2,
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { fontSize: 15, fontWeight: '700', color: '#F9FAFB' },
});
