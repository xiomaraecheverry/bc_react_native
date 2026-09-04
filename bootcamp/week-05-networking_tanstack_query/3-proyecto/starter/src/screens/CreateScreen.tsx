// src/screens/CreateScreen.tsx
// Pantalla modal para registrar un nuevo proyecto de vivienda con useCreateItem (POST)

import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useCreateItem } from '../hooks/useItems';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { TipoVivienda } from '../types';
import type { RootStackParamList } from '../navigation/types';

type CreateNavProp = NativeStackNavigationProp<RootStackParamList, 'Create'>;

const TIPOS_VIVIENDA: TipoVivienda[] = ['Apartamento', 'Casa', 'Dúplex', 'Vivienda VIS'];

export function CreateScreen(): React.JSX.Element {
  const navigation = useNavigation<CreateNavProp>();

  // Estados del formulario
  const [name, setName] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [precio, setPrecio] = useState('');
  const [ahorroMensual, setAhorroMensual] = useState('');
  const [tipoVivienda, setTipoVivienda] = useState<TipoVivienda>('Apartamento');
  const [area, setArea] = useState('70');
  const [habitaciones, setHabitaciones] = useState('3');
  const [banos, setBanos] = useState('2');
  const [description, setDescription] = useState('');
  const [subsidio, setSubsidio] = useState(true);

  // Hook de mutación de TanStack Query
  const { mutate: createProject, isPending } = useCreateItem();

  function handleSubmit(): void {
    if (!name.trim() || !ciudad.trim() || !precio.trim()) return;

    createProject(
      {
        name: name.trim(),
        ciudad: ciudad.trim(),
        precio: precio.trim().startsWith('$') ? precio.trim() : `$${precio.trim()}`,
        ahorroMensual: ahorroMensual.trim().startsWith('$')
          ? ahorroMensual.trim()
          : `$${ahorroMensual.trim() || '600.000'}`,
        tipoVivienda,
        area: Number(area) || 60,
        habitaciones: Number(habitaciones) || 2,
        banos: Number(banos) || 1,
        imagen:
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
        description:
          description.trim() ||
          'Nuevo proyecto habitacional gestionado por la Cooperativa de Vivienda.',
        subsidio,
      },
      {
        onSuccess: () => {
          navigation.goBack();
        },
      }
    );
  }

  const canSubmit = name.trim().length > 0 && ciudad.trim().length > 0 && !isPending;

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
        <Text style={styles.sectionLabel}>Datos del Nuevo Proyecto</Text>

        {/* Nombre del proyecto */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            Nombre del Proyecto <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej: Residencial Los Sauces"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        {/* Ciudad */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            Ciudad / Ubicación <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={ciudad}
            onChangeText={setCiudad}
            placeholder="Ej: Bogotá, Medellín, Cali..."
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        {/* Precio y Aporte */}
        <View style={styles.row}>
          <View style={[styles.field, styles.flex]}>
            <Text style={styles.fieldLabel}>Precio Total *</Text>
            <TextInput
              style={styles.input}
              value={precio}
              onChangeText={setPrecio}
              placeholder="Ej: $150.000.000"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
          <View style={[styles.field, styles.flex]}>
            <Text style={styles.fieldLabel}>Aporte Mensual</Text>
            <TextInput
              style={styles.input}
              value={ahorroMensual}
              onChangeText={setAhorroMensual}
              placeholder="Ej: $700.000"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
        </View>

        {/* Selector de Tipo de Vivienda */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Tipo de Inmueble</Text>
          <View style={styles.typesRow}>
            {TIPOS_VIVIENDA.map((tipo) => (
              <Pressable
                key={tipo}
                style={[
                  styles.typeChip,
                  tipoVivienda === tipo && styles.typeChipSelected,
                ]}
                onPress={() => setTipoVivienda(tipo)}
              >
                <Text
                  style={[
                    styles.typeChipText,
                    tipoVivienda === tipo && styles.typeChipTextSelected,
                  ]}
                >
                  {tipo}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Especificaciones */}
        <View style={styles.row}>
          <View style={[styles.field, styles.flex]}>
            <Text style={styles.fieldLabel}>Área (m²)</Text>
            <TextInput
              style={styles.input}
              value={area}
              onChangeText={setArea}
              keyboardType="numeric"
              placeholder="70"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
          <View style={[styles.field, styles.flex]}>
            <Text style={styles.fieldLabel}>Habitaciones</Text>
            <TextInput
              style={styles.input}
              value={habitaciones}
              onChangeText={setHabitaciones}
              keyboardType="numeric"
              placeholder="3"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
          <View style={[styles.field, styles.flex]}>
            <Text style={styles.fieldLabel}>Baños</Text>
            <TextInput
              style={styles.input}
              value={banos}
              onChangeText={setBanos}
              keyboardType="numeric"
              placeholder="2"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
        </View>

        {/* Subsidio Switch */}
        <View style={styles.switchRow}>
          <View style={styles.switchTextWrap}>
            <Text style={styles.fieldLabel}>Aplica a Subsidio Cooperativo</Text>
            <Text style={styles.switchSub}>Beneficio para asociados de la cooperativa</Text>
          </View>
          <Switch
            value={subsidio}
            onValueChange={setSubsidio}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
          />
        </View>

        {/* Descripción */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción detallada de la vivienda y zonas comunes…"
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Botón de envío */}
        <Pressable
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={18} color="#ffffff" />
              <Text style={styles.buttonText}>Registrar Proyecto</Text>
            </>
          )}
        </Pressable>

        {/* Cancelar */}
        <Pressable style={styles.cancel} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  sectionLabel: { ...TYPOGRAPHY.label, textTransform: 'uppercase', letterSpacing: 0.8 },
  field: { gap: SPACING.xs },
  row: { flexDirection: 'row', gap: SPACING.sm },
  fieldLabel: { ...TYPOGRAPHY.body, fontWeight: '600' },
  required: { color: COLORS.error },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  multiline: { minHeight: 80, paddingTop: SPACING.sm },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  typeChip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
  },
  typeChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeChipText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  typeChipTextSelected: {
    color: '#ffffff',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  switchTextWrap: {
    flex: 1,
  },
  switchSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  button: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { ...TYPOGRAPHY.body, fontWeight: '700', color: '#ffffff' },
  cancel: { alignItems: 'center', padding: SPACING.sm },
  cancelText: { ...TYPOGRAPHY.body, color: COLORS.textMuted },
});
