// src/screens/DetailScreen.tsx
// Pantalla de detalle del proyecto de vivienda con botón interactivo de Zustand

import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { ITEMS } from '../data/mockData';
import { useSavedStore } from '../stores/savedStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { Item } from '../types';
import type { HomeStackParamList } from '../navigation/types';

type DetailRouteProp = RouteProp<HomeStackParamList, 'HomeDetail'>;

export function DetailScreen(): React.JSX.Element {
  const route = useRoute<DetailRouteProp>();
  const { id } = route.params;

  const item: Item | undefined = ITEMS.find((i) => i.id === id);

  // Selectores atómicos de Zustand
  const isSaved = useSavedStore((state) => state.isItemSaved(id));
  const addItem = useSavedStore((state) => state.addItem);
  const removeItem = useSavedStore((state) => state.removeItem);

  const handleToggleSave = (): void => {
    if (!item) return;
    if (isSaved) {
      removeItem(id);
    } else {
      addItem(item);
    }
  };

  if (!item) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>No se encontró el proyecto seleccionado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Imagen principal del proyecto */}
        <View style={styles.imageWrap}>
          <Image source={{ uri: item.imagen }} style={styles.foto} resizeMode="cover" />
          <View style={styles.tipoBadge}>
            <Text style={styles.tipoBadgeText}>{item.tipoVivienda}</Text>
          </View>
        </View>

        {/* Información general */}
        <View style={styles.card}>
          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={COLORS.primary} />
            <Text style={styles.locationText}>Ciudad: {item.ciudad}</Text>
          </View>
        </View>

        {/* Resumen de aportes y precios */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Plan Financiero Cooperativo</Text>
          <View style={styles.financialRow}>
            <View style={styles.financialBox}>
              <Text style={styles.finLabel}>Aporte Mensual</Text>
              <Text style={styles.finValueGreen}>{item.ahorroMensual}</Text>
              <Text style={styles.finSub}>Cuota solidaria</Text>
            </View>
            <View style={styles.financialBox}>
              <Text style={styles.finLabel}>Precio Total</Text>
              <Text style={styles.finValueBlue}>{item.precio}</Text>
              <Text style={styles.finSub}>Valor estimado</Text>
            </View>
          </View>
          {item.subsidio && (
            <View style={styles.subsidyNote}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.subsidyText}>Aplica a subsidio de vivienda para asociados</Text>
            </View>
          )}
        </View>

        {/* Especificaciones */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Características del Inmueble</Text>
          <View style={styles.specsGrid}>
            <View style={styles.specItem}>
              <Ionicons name="resize" size={20} color={COLORS.primary} />
              <Text style={styles.specValue}>{item.area} m²</Text>
              <Text style={styles.specLabel}>Área Total</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="bed" size={20} color={COLORS.primary} />
              <Text style={styles.specValue}>{item.habitaciones}</Text>
              <Text style={styles.specLabel}>Habitaciones</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="water" size={20} color={COLORS.primary} />
              <Text style={styles.specValue}>{item.banos}</Text>
              <Text style={styles.specLabel}>Baños</Text>
            </View>
          </View>
        </View>

        {/* Descripción */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Descripción del Proyecto</Text>
          <Text style={styles.description}>{item.descripcion}</Text>
        </View>
      </ScrollView>

      {/* Botón flotante inferior conectado al store de Zustand */}
      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            isSaved ? styles.actionButtonSaved : styles.actionButtonDefault,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={handleToggleSave}
          testID="save-button"
        >
          <Ionicons
            name={isSaved ? 'trash-outline' : 'heart'}
            size={18}
            color="#ffffff"
          />
          <Text style={styles.actionButtonText}>
            {isSaved ? 'Quitar de Guardados' : 'Guardar en Mis Proyectos'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 85,
    gap: SPACING.md,
  },
  notFoundContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  notFoundText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  imageWrap: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  foto: {
    width: '100%',
    height: '100%',
  },
  tipoBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.xs,
  },
  tipoBadgeText: {
    ...TYPOGRAPHY.label,
    color: '#ffffff',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  sectionHeader: {
    ...TYPOGRAPHY.label,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  financialRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  financialBox: {
    flex: 1,
    backgroundColor: COLORS.cardSecondary,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  finLabel: {
    ...TYPOGRAPHY.label,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  finValueGreen: {
    ...TYPOGRAPHY.h3,
    color: COLORS.price,
    marginTop: 2,
  },
  finValueBlue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    marginTop: 2,
  },
  finSub: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  subsidyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.xs,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  subsidyText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
    fontWeight: '600',
  },
  specsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  specItem: {
    flex: 1,
    backgroundColor: COLORS.cardSecondary,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    alignItems: 'center',
    gap: 2,
  },
  specValue: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  specLabel: {
    ...TYPOGRAPHY.label,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SPACING.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
  },
  actionButtonDefault: {
    backgroundColor: COLORS.primary,
  },
  actionButtonSaved: {
    backgroundColor: COLORS.error,
  },
  actionButtonPressed: {
    opacity: 0.85,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
