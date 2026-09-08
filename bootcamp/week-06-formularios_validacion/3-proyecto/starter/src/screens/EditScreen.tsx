// src/screens/EditScreen.tsx
// Formulario para editar una vivienda existente en la Cooperativa
// Carga datos con useItemById, rellena el formulario con reset() en useEffect, y actualiza con useUpdateItem

import React, { useEffect } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import { FormField } from '../components/FormField';
import { itemSchema, type ItemFormData } from '../schemas/itemSchema';
import { useItemById, useUpdateItem } from '../hooks/useItems';
import type { TipoVivienda } from '../types';

type EditNavProp = NativeStackNavigationProp<RootStackParamList, 'Edit'>;
type EditRouteProp = RouteProp<RootStackParamList, 'Edit'>;

const TIPOS_VIVIENDA: TipoVivienda[] = [
  'Apartamento',
  'Casa',
  'Dúplex',
  'Vivienda VIS',
];

export function EditScreen(): React.JSX.Element {
  const navigation = useNavigation<EditNavProp>();
  const route = useRoute<EditRouteProp>();
  const { id } = route.params;

  // 1. Obtener la vivienda actual del servidor / caché
  const { data: item, isLoading, isError } = useItemById(id);

  // 2. Mutation de actualización
  const { mutate: updateItem, isPending: isUpdating } = useUpdateItem();

  // 3. Inicialización del formulario con React Hook Form + Zod
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
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

  // 4. Patrón clave de la Semana 06: Actualizar defaultValues cuando lleguen los datos usando reset()
  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        ciudad: item.ciudad,
        tipoVivienda: item.tipoVivienda,
        precio: item.precio,
        ahorroMensual: item.ahorroMensual,
        area: item.area,
        habitaciones: item.habitaciones,
        banos: item.banos,
        description: item.description,
        subsidio: item.subsidio,
        imagen: item.imagen ?? '',
      });
    }
  }, [item, reset]);

  const onSubmit = (data: ItemFormData): void => {
    updateItem(
      {
        id,
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
            : item?.imagen || '',
      },
      {
        onSuccess: () => {
          Alert.alert(
            '¡Cambios Guardados!',
            'La información de la vivienda ha sido actualizada con éxito.',
            [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
          );
        },
        onError: (error) => {
          Alert.alert(
            'Error al actualizar',
            error.message || 'No se pudieron guardar las modificaciones.'
          );
        },
      }
    );
  };

  const isSaving = isSubmitting || isUpdating;

  // Estado de carga inicial mientras se obtienen los datos del servidor
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando datos de la vivienda...</Text>
      </View>
    );
  }

  // Estado de error si no se encontró la vivienda
  if (isError || !item) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Vivienda no encontrada</Text>
        <Text style={styles.errorSubtitle}>
          El proyecto solicitado no existe o fue eliminado de la cooperativa.
        </Text>
        <Pressable
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Volver al Catálogo</Text>
        </Pressable>
      </View>
    );
  }

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
          <Text style={styles.introTitle}>Modificación de Ficha Habitacional</Text>
          <Text style={styles.introText}>
            Edita los datos que requieran ajuste. Los cambios se sincronizarán
            inmediatamente con el catálogo de los asociados.
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
            placeholder="Describe las áreas sociales, acabados, parqueadero y beneficios..."
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
              (!isDirty || isSaving) && styles.btnDisabled,
              pressed && !isSaving && styles.btnPressed,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={!isDirty || isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>
                {isDirty ? '✓ Guardar Modificaciones' : 'Sin cambios pendientes'}
              </Text>
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
  },
  errorTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.errorLight,
  },
  errorSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  backBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  introBox: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
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
