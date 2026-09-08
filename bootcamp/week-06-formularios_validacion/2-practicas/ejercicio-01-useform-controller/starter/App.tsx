// App.tsx — Ejercicio 01: useForm + Controller en React Native
// Formulario de contacto sin validación externa (pura React Hook Form)

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
import { Controller, useForm } from 'react-hook-form';

// ============================================
// TIPO del formulario
// ============================================
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export default function App(): React.JSX.Element {
  // ============================================
  // PASO 1: inicializar useForm con defaultValues
  // ============================================
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ContactFormData>({
    defaultValues: { name: '', email: '', message: '' },
  });

  // ============================================
  // PASO 3: función onSubmit
  // ============================================
  async function onSubmit(data: ContactFormData): Promise<void> {
    // Simulamos una llamada de red de 1.5 s
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));
    console.log('✅ Formulario enviado:', data);
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
        <Text style={styles.title}>Formulario de Contacto</Text>
        <Text style={styles.subtitle}>Ejercicio 01 — React Hook Form</Text>

        {/* ============================================
            PASO 2: campos con Controller
            ============================================ */}

        {/* Campo: name */}
        <View style={styles.field}>
          <Text style={styles.label}>Nombre</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Tu nombre completo"
                placeholderTextColor="#6B7280"
                returnKeyType="next"
              />
            )}
          />
        </View>

        {/* Campo: email */}
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
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
        </View>

        {/* Campo: message */}
        <View style={styles.field}>
          <Text style={styles.label}>Mensaje</Text>
          <Controller
            control={control}
            name="message"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.multiline]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Escribe tu mensaje aquí…"
                placeholderTextColor="#6B7280"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            )}
          />
        </View>

        {/* ============================================
            PASO 4: botón con isSubmitting
            ============================================ */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            isSubmitting && styles.buttonDisabled,
            pressed && !isSubmitting && styles.buttonPressed,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#111827" />
          ) : (
            <Text style={styles.buttonText}>Enviar</Text>
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
  field: { gap: 6 },
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
  multiline: { minHeight: 100, paddingTop: 12 },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.45 },
  buttonPressed: { opacity: 0.85 },
  buttonText: { fontSize: 15, fontWeight: '700', color: '#F9FAFB' },
});
