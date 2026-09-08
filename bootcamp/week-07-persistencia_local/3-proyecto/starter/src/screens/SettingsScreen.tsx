// src/screens/SettingsScreen.tsx
// Pantalla de ajustes con preferencias persistidas en MMKV y datos sensibles en Expo SecureStore

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { usePreferences } from '../hooks/usePreferences';
import type { SortOrder } from '../types';

// Clave para el dato sensible del dominio de Cooperativa de Vivienda
const SENSITIVE_KEY = 'coop_advisor_security_token';
const MOCK_SENSITIVE = 'SEC-COOP-8849-AUTH';

export function SettingsScreen(): React.JSX.Element {
  const {
    sortOrder,
    setSortOrder,
    compactMode,
    setCompactMode,
    filterSubsidioOnly,
    setFilterSubsidioOnly,
    itemsPerPage,
    setItemsPerPage,
  } = usePreferences();

  // Estado local para lectura y estado de SecureStore
  const [isSaved, setIsSaved] = useState(false);
  const [maskedValue, setMaskedValue] = useState<string | null>(null);

  // Verificar si ya existe el token en SecureStore al montar la pantalla
  useEffect(() => {
    SecureStore.getItemAsync(SENSITIVE_KEY).then((value) => {
      if (value) {
        setIsSaved(true);
      }
    });
  }, []);

  // 1. Guardar token cifrado con SecureStore
  async function handleSaveSensitive(): Promise<void> {
    try {
      await SecureStore.setItemAsync(SENSITIVE_KEY, MOCK_SENSITIVE);
      setIsSaved(true);
      setMaskedValue(null);
      Alert.alert(
        'Token Cifrado Guardado',
        'El Token de Firma Digital del Asesor Cooperativo ha sido almacenado de forma segura en el Keystore/Keychain nativo.'
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar en SecureStore.');
    }
  }

  // 2. Leer token desde SecureStore y enmascarar en UI
  async function handleReadSensitive(): Promise<void> {
    try {
      const value = await SecureStore.getItemAsync(SENSITIVE_KEY);
      if (value) {
        // Enmascarar caracteres intermedios por seguridad
        const masked = value.slice(0, 4) + '••••••••' + value.slice(-4);
        setMaskedValue(masked);
        setIsSaved(true);
      } else {
        setMaskedValue(null);
        setIsSaved(false);
        Alert.alert(
          'Sin Token Registrado',
          'No hay ningún token de seguridad guardado en SecureStore actualmente.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo leer de SecureStore.');
    }
  }

  // 3. Eliminar token de SecureStore
  async function handleDeleteSensitive(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(SENSITIVE_KEY);
      setIsSaved(false);
      setMaskedValue(null);
      Alert.alert(
        'Token Eliminado',
        'El token fue revocado y eliminado permanentemente del almacenamiento seguro.'
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar de SecureStore.');
    }
  }

  const sortOptions: { key: SortOrder; label: string }[] = [
    { key: 'alfabetico', label: 'Nombre (A→Z)' },
    { key: 'precio_asc', label: 'Menor Precio' },
    { key: 'precio_desc', label: 'Mayor Precio' },
    { key: 'area', label: 'Mayor Área' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ──────────────────────────────────────────────────────
          SECCIÓN MMKV — Preferencias de Visualización
      ────────────────────────────────────────────────────── */}
      <Text style={styles.sectionTitle}>Preferencias del Catálogo (MMKV)</Text>
      <Text style={styles.sectionHint}>
        Valores almacenados en memoria ultrarrápida con MMKV. Se aplican y persisten
        al instante sin necesidad de guardar.
      </Text>

      {/* Switch: Modo compacto */}
      <View style={styles.row}>
        <View style={styles.rowInfo}>
          <Text style={styles.rowLabel}>Vista compacta</Text>
          <Text style={styles.rowDesc}>
            Muestra fichas resumidas para ver más viviendas a la vez
          </Text>
        </View>
        <Switch
          value={compactMode}
          onValueChange={setCompactMode}
          trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
          thumbColor={compactMode ? COLORS.primary : COLORS.textMuted}
        />
      </View>

      {/* Switch: Filtrar solo subsidio */}
      <View style={styles.row}>
        <View style={styles.rowInfo}>
          <Text style={styles.rowLabel}>Solo con Subsidio Cooperativo</Text>
          <Text style={styles.rowDesc}>
            Oculta proyectos que no apliquen a subsidios de vivienda
          </Text>
        </View>
        <Switch
          value={filterSubsidioOnly}
          onValueChange={setFilterSubsidioOnly}
          trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
          thumbColor={filterSubsidioOnly ? COLORS.primary : COLORS.textMuted}
        />
      </View>

      {/* Segmented Control: Criterio de Ordenación */}
      <View style={[styles.row, styles.rowColumn]}>
        <Text style={styles.rowLabel}>Criterio de ordenación de viviendas</Text>
        <View style={styles.segmentedGrid}>
          {sortOptions.map((opt) => {
            const isActive = sortOrder === opt.key;
            return (
              <Pressable
                key={opt.key}
                style={[styles.segment, isActive && styles.segmentActive]}
                onPress={() => setSortOrder(opt.key)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    isActive && styles.segmentTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Segmented Control: Ítems por página */}
      <View style={[styles.row, styles.rowColumn]}>
        <Text style={styles.rowLabel}>Proyectos por bloque de carga</Text>
        <View style={styles.segmented}>
          {([5, 10, 20] as const).map((n) => {
            const isActive = itemsPerPage === n;
            return (
              <Pressable
                key={n}
                style={[styles.segment, isActive && styles.segmentActive]}
                onPress={() => setItemsPerPage(n)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    isActive && styles.segmentTextActive,
                  ]}
                >
                  {n} proyectos
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ──────────────────────────────────────────────────────
          SECCIÓN SecureStore — Seguridad del Asesor
      ────────────────────────────────────────────────────── */}
      <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>
        Seguridad y Credenciales (Expo SecureStore)
      </Text>
      <Text style={styles.sectionHint}>
        Cifrado mediante hardware en Keychain (iOS) o Keystore (Android) para
        tokens de asesor o certificados de crédito.
      </Text>

      <View style={styles.securityCard}>
        <View style={styles.securityHeader}>
          <Text style={styles.securityTitle}>
            Token de Firma Digital de Crédito
          </Text>
          <View
            style={[
              styles.statusBadge,
              isSaved ? styles.statusBadgeActive : styles.statusBadgeInactive,
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {isSaved ? '🔒 Cifrado & Activo' : '⚪ No Configurado'}
            </Text>
          </View>
        </View>

        <Text style={styles.securityDesc}>
          Clave de seguridad: <Text style={styles.mono}>{SENSITIVE_KEY}</Text>
        </Text>

        {maskedValue && (
          <View style={styles.maskedBox}>
            <Text style={styles.maskedLabel}>Token en memoria cifrada:</Text>
            <Text style={styles.maskedText}>{maskedValue}</Text>
          </View>
        )}

        <View style={styles.secureActions}>
          <Pressable style={styles.btnPrimary} onPress={handleSaveSensitive}>
            <Text style={styles.btnPrimaryText}>💾 Guardar Token</Text>
          </Pressable>

          <Pressable style={styles.btnSecondary} onPress={handleReadSensitive}>
            <Text style={styles.btnSecondaryText}>🔍 Verificar</Text>
          </Pressable>

          <Pressable style={styles.btnDanger} onPress={handleDeleteSensitive}>
            <Text style={styles.btnDangerText}>🗑️ Revocar</Text>
          </Pressable>
        </View>
      </View>

      {/* Nota pedagógica */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 <Text style={{ fontWeight: '700' }}>Arquitectura de Almacenamiento:</Text>{' '}
          <Text style={{ color: COLORS.primaryLight }}>MMKV</Text> gestiona preferencias sincrónicas de UI,{' '}
          <Text style={{ color: COLORS.accentLight }}>AsyncStorage</Text> mantiene la caché de catálogo offline, y{' '}
          <Text style={{ color: COLORS.warning }}>SecureStore</Text> protege las credenciales y tokens sensibles.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    gap: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primaryLight,
    marginBottom: SPACING.xs,
  },
  sectionHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  rowColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  rowInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  rowLabel: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  rowDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  mono: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: COLORS.accentLight,
  },
  segmented: {
    flexDirection: 'row',
    gap: SPACING.xs,
    width: '100%',
  },
  segmentedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    width: '100%',
  },
  segment: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  segmentText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  securityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  securityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  securityTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  securityDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  statusBadgeActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusBadgeInactive: {
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryLight,
  },
  maskedBox: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  maskedLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSubtle,
    textTransform: 'uppercase',
  },
  maskedText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primaryLight,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 1,
  },
  secureActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: COLORS.primaryLight,
    fontWeight: '700',
    fontSize: 12,
  },
  btnDanger: {
    flex: 1,
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
  },
  btnDangerText: {
    color: COLORS.errorLight,
    fontWeight: '700',
    fontSize: 12,
  },
  infoBox: {
    backgroundColor: COLORS.surface,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  infoText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
