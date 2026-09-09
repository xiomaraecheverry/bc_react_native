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
import { registerSchema, type RegisterFormValues } from '../schemas/authSchema';
import { FormField } from '../components/FormField';
import { useAuthStore } from '../stores/authStore';
import { theme } from '../theme';
import type { RegisterScreenProps } from '../navigation/types';

export function RegisterScreen({ navigation }: RegisterScreenProps): React.JSX.Element {
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  /**
   * TODO: Implementar onSubmit para el registro.
   *
   * Pasos:
   * 1. Llamar a register({ username, email, password }) del authStore
   *    - Nota: no enviar confirmPassword al servidor
   * 2. Si hay error → mostrar Alert
   * 3. Si tiene éxito → el RootNavigator navegará a AppNavigator automáticamente
   *
   * Pista:
   * const onSubmit = async (values: RegisterFormValues) => {
   *   try {
   *     await register({
   *       username: values.username,
   *       email: values.email,
   *       password: values.password,
   *     });
   *   } catch {
   *     Alert.alert('Error', 'No se pudo crear la cuenta');
   *   }
   * };
   */
  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await register({
        username: values.username,
        email: values.email,
        password: values.password,
      });
      // RootNavigator detecta isAuthenticated === true y cambia a AppNavigator
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'No se pudo completar el registro del asociado';
      Alert.alert('Error de Afiliación', message);
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
          <Text style={styles.badgeText}>🏛️ COOPERATIVA DE VIVIENDA</Text>
        </View>
        <Text style={styles.title}>Solicitud de Afiliación</Text>
        <Text style={styles.subtitle}>
          Únete a nuestra cooperativa para acceder a programas de vivienda de interés social (VIS y VIP) y subsidios.
        </Text>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Nombre de Usuario"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="ej: carlos_asociado"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.username?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Correo Electrónico Institucional/Personal"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="correo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Contraseña"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Confirmar Contraseña"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Repite tu contraseña"
              secureTextEntry
              error={errors.confirmPassword?.message}
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
            <Text style={styles.buttonText}>Completar Afiliación</Text>
          )}
        </Pressable>
      </View>

      <Pressable
        style={styles.linkButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.linkText}>
          ¿Ya tienes cuenta de asociado?{' '}
          <Text style={styles.linkHighlight}>Ingresar al portal</Text>
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
    paddingTop: theme.spacing.xl,
    gap: theme.spacing.xl,
  },
  header: {
    gap: theme.spacing.xs,
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

