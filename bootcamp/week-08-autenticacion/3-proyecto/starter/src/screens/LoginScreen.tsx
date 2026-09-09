import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '../schemas/authSchema';
import { FormField } from '../components/FormField';
import { useAuthStore } from '../stores/authStore';
import { theme } from '../theme';
import type { LoginScreenProps } from '../navigation/types';

export function LoginScreen({ navigation }: LoginScreenProps): React.JSX.Element {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: 'emilys',
      password: 'emilyspass',
    },
  });

  /**
   * TODO: Implementar onSubmit.
   *
   * Pasos:
   * 1. Llamar a login(values) del authStore
   * 2. Si hay error (catch), mostrar Alert con el mensaje
   * 3. Si tiene éxito, el RootNavigator navegará automáticamente a AppNavigator
   *    (no necesitas navegar manualmente — Zustand + RootNavigator lo hacen)
   *
   * Pista:
   * const onSubmit = async (values: LoginFormValues) => {
   *   try {
   *     await login(values);
   *     // ✅ RootNavigator detecta isAuthenticated === true y cambia a AppNavigator
   *   } catch {
   *     Alert.alert('Error', 'Credenciales incorrectas');
   *   }
   * };
   */
  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Credenciales incorrectas o error en el servidor';
      Alert.alert('Error de inicio de sesión', message);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>🏡 COOPVIVIENDA SOLIDARIA</Text>
        </View>
        <Text style={styles.title}>Portal del Asociado</Text>
        <Text style={styles.subtitle}>
          Ingresa tus credenciales para acceder a tus subsidios, créditos de vivienda y ahorros.
        </Text>
      </View>

      <View style={styles.demoCard}>
        <Text style={styles.demoTitle}>💡 Credenciales de Prueba</Text>
        <Text style={styles.demoText}>Usuario: <Text style={styles.demoBold}>emilys</Text> | Clave: <Text style={styles.demoBold}>emilyspass</Text></Text>
        <Text style={styles.demoNote}>O ingresa con cualquier usuario (mínimo 6 caracteres de contraseña).</Text>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Usuario o Nº de Asociado"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="emilys o tu_usuario"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.username?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Contraseña de Seguridad"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="••••••••"
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />

        <Pressable
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Ingresar al Portal</Text>
          )}
        </Pressable>
      </View>

      <Pressable
        style={styles.linkButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.linkText}>
          ¿Aún no eres asociado?{' '}
          <Text style={styles.linkHighlight}>Afiliarme a la Cooperativa</Text>
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.lg,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#0369a1',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: theme.radius.full,
    marginBottom: 4,
  },
  badgeText: {
    color: '#e0f2fe',
    fontSize: theme.fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  header: {
    gap: theme.spacing.xs,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  demoCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    gap: 4,
  },
  demoTitle: {
    color: theme.colors.brand,
    fontSize: theme.fontSize.xs,
    fontWeight: '700',
  },
  demoText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xs,
  },
  demoBold: {
    color: '#38bdf8',
    fontWeight: '700',
  },
  demoNote: {
    color: theme.colors.textMuted,
    fontSize: 10,
  },
  form: {
    gap: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    padding: 14,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: theme.fontSize.md,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  linkText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  linkHighlight: {
    color: theme.colors.brand,
    fontWeight: '600',
  },
});

