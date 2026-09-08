// src/screens/CreateScreen.tsx
// Formulario para registrar una nueva vivienda o proyecto en la Cooperativa de Vivienda
// Implementado con React Hook Form + validación Zod + TanStack Query useMutation

import React from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import { FormField } from '../components/FormField';
import { itemSchema, type ItemFormData } from '../schemas/itemSchema';
import { useCreateItem } from '../hooks/useItems';
import type { TipoVivienda } from '../types';

type CreateNavProp = NativeStackNavigationProp<RootStackParamList, 'Create'>;

const TIPOS_VIVIENDA: TipoVivienda[] = [
  'Apartamento',
  'Casa',
  'Dúplex',
  'Vivienda VIS',
];

export function CreateScreen(): React.JSX.Element {
  const navigation = useNavigation<CreateNavProp>();
  const { mutate: createItem, isPending } = useCreateItem();

  // Inicialización de useForm con schema Zod y valores por defecto
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      ciudad: '',
      tipoVivienda: 'Apartamento',
      precio: '',
      ahorroMensual: '',
      area: 60,
      habitaciones: 3,
      banos: 2,
      description: '',
      subsidio: true,
      imagen: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = (data: ItemFormData): void => {
    createItem(
      {
        name: data.name.trim(),
        ciudad: data.ciudad.trim(),
        tipoVivienda: data.tipoVivienda,
        precio: data.precio.trim(),
        ahorroMensual: data.ahorroMensual.trim(),
        area: Number(data.area),
        habitaciones: Number(data.habitaciones),
        banos: Number(data.banos),
        description: data.description.trim(),
        subsidio: data.subsidio ?? false,
        imagen:
          data.imagen && data.imagen.trim().length > 0
            ? data.imagen.trim()
            : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
      },
      {
        onSuccess: () => {
          Alert.alert(
            '¡Proyecto Registrado!',
            'La nueva vivienda fue agregada exitosamente al catálogo cooperativo.',
            [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
          );
        },
        onError: (error) => {
          Alert.alert(
            'Error al guardar',
            error.message || 'Ocurrió un error al guardar la vivienda.'
          );
        },
      }
    );
  };

  const isSaving = isSubmitting || isPending;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.introBox}>
          <Text style={styles.introTitle}>Ficha de Vivienda Cooperativa</Text>
          <Text style={styles.introText}>
            Completa los datos técnicos y financieros para publicar el proyecto
            en beneficio de los asociados.
          </Text>
        </View>

        {/* 1. Información General */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Información General</Text>

          <FormField
            control={control}
            name="name"
            label="Nombre del Proyecto / Vivienda"
            placeholder="Ej. Conjunto Residencial Los Pinos"
            required
            errorMessage={errors.name?.message}
          />

          <FormField
            control={control}
            name="ciudad"
            label="Ciudad / Municipio"
            placeholder="Ej. Bogotá D.C., Medellín, Cali"
            required
            errorMessage={errors.ciudad?.message}
          />

          {/* Selector de Tipo de Vivienda */}
          <View style={styles.tipoContainer}>
            <Text style={styles.tipoLabel}>Tipo de Vivienda *</Text>
            <Controller
              control={control}
              name="tipoVivienda"
              render={({ field: { onChange, value } }) => (
                <View style={styles.tiposGrid}>
                  {TIPOS_VIVIENDA.map((tipo) => {
                    const isSelected = value === tipo;
                    return (
                      <Pressable
                        key={tipo}
                        style={[
                          styles.tipoOption,
                          isSelected && styles.tipoOptionSelected,
                        ]}
                        onPress={() => onChange(tipo)}
                      >
                        <Text
                          style={[
                            styles.tipoOptionText,
                            isSelected && styles.tipoOptionTextSelected,
                          ]}
                        >
                          {tipo}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            />
            {errors.tipoVivienda && (
              <Text style={styles.errorText}>
                ⚠ {errors.tipoVivienda.message}
              </Text>
            )}
          </View>
        </View>

        {/* 2. Condiciones Financieras */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Condiciones Financieras</Text>

          <FormField
            control={control}
            name="precio"
            label="Valor Comercial Estimado"
            placeholder="Ej. $145.000.000"
            required
            errorMessage={errors.precio?.message}
          />

          <FormField
            control={control}
            name="ahorroMensual"
            label="Cuota de Ahorro Mensual Sugerida"
            placeholder="Ej. $680.000 / mes"
            required
            errorMessage={errors.ahorroMensual?.message}
          />

          {/* Switch de Subsidio Cooperativo */}
          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Aplica a Subsidio Cooperativo</Text>
              <Text style={styles.switchSubtitle}>
                Habilita subsidios de tasa y concurrencia para asociados
              </Text>
            </View>
            <Controller
              control={control}
              name="subsidio"
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{
                    false: COLORS.card,
                    true: COLORS.primaryLight,
                  }}
                  thumbColor={value ? COLORS.primary : COLORS.textMuted}
                />
              )}
            />
          </View>
        </View>

        {/* 3. Características del Inmueble */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Características del Inmueble</Text>

          <View style={styles.numbersRow}>
            <View style={styles.numberCol}>
              <FormField
                control={control}
                name="area"
                label="Área (m²)"
                placeholder="65"
                keyboardType="numeric"
                required
                errorMessage={errors.area?.message}
              />
            </View>

            <View style={styles.numberCol}>
              <FormField
                control={control}
                name="habitaciones"
                label="Habitaciones"
                placeholder="3"
                keyboardType="numeric"
                required
                errorMessage={errors.habitaciones?.message}
              />
            </View>

            <View style={styles.numberCol}>
              <FormField
                control={control}
                name="banos"
                label="Baños"
                placeholder="2"
                keyboardType="numeric"
                required
                errorMessage={errors.banos?.message}
              />
            </View>
          </View>

          <FormField
            control={control}
            name="imagen"
            label="URL de Imagen (Opcional)"
            placeholder="https://images.unsplash.com/..."
            autoCapitalize="none"
            errorMessage={errors.imagen?.message}
          />

          <FormField
            control={control}
            name="description"
            label="Descripción del Inmueble y Zonas Comunes"
            placeholder="Describe las áreas sociales, acabados, parqueadero y beneficios para asociados..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            required
            errorMessage={errors.description?.message}
          />
        </View>

        {/* Botones de acción */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              isSaving && styles.btnDisabled,
              pressed && !isSaving && styles.btnPressed,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>✓ Guardar y Publicar Vivienda</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
            disabled={isSaving}
          >
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.xl,
    paddingBottom: SPACING.xxxl * 2,
  },
  introBox: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    gap: 4,
  },
  introTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  introText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  section: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.xs,
  },
  tipoContainer: {
    gap: SPACING.xs,
  },
  tipoLabel: {
    ...TYPOGRAPHY.label,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tiposGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tipoOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipoOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  tipoOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tipoOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  errorText: {
    ...TYPOGRAPHY.error,
    marginTop: 2,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  switchTextContainer: {
    flex: 1,
    paddingRight: SPACING.md,
    gap: 2,
  },
  switchTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  switchSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  numbersRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  numberCol: {
    flex: 1,
  },
  actions: {
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  btnDisabled: {
    opacity: 0.5,
  },
  cancelBtn: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  cancelBtnText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
  },
});
