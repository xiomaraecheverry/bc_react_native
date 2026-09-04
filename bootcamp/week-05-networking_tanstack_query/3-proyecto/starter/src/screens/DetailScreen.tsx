// src/screens/DetailScreen.tsx
// Pantalla de detalle de proyecto consumida con useItemById y useDeleteItem

import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useDeleteItem, useItemById } from '../hooks/useItems';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type DetailRouteProp = RouteProp<RootStackParamList, 'Detail'>;
type DetailNavProp = NativeStackNavigationProp<RootStackParamList, 'Detail'>;

export function DetailScreen(): React.JSX.Element {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<DetailNavProp>();
  const { id } = route.params;

  // Consulta por ID con TanStack Query
  const { data: item, isLoading, isError, error, refetch } = useItemById(id);
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteItem();

  const handleDelete = (): void => {
    deleteProject(id, {
      onSuccess: () => {
        navigation.goBack();
      },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando ficha técnica del proyecto...</Text>
      </View>
    );
  }

  if (isError || !item) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={44} color={COLORS.error} />
        <Text style={styles.errorText}>No se pudo cargar el proyecto</Text>
        <Text style={styles.errorDetail}>{(error as Error)?.message || 'Registro no disponible'}</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Foto del proyecto */}
        <View style={styles.imageWrap}>
          <Image source={{ uri: item.imagen }} style={styles.foto} resizeMode="cover" />
          <View style={styles.tipoBadge}>
            <Text style={styles.tipoBadgeText}>{item.tipoVivienda}</Text>
          </View>
        </View>

        {/* Título y Ciudad */}
        <View style={styles.card}>
          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={COLORS.primary} />
            <Text style={styles.locationText}>Ciudad: {item.ciudad}</Text>
          </View>
        </View>

        {/* Plan Financiero */}
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

        {/* Características Técnicas */}
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
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </ScrollView>

      {/* Botón de eliminación / baja con useMutation */}
      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            isDeleting && styles.buttonDisabled,
            pressed && { opacity: 0.8 },
          ]}
          onPress={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={18} color="#ffffff" />
              <Text style={styles.deleteButtonText}>Retirar de Convocatoria</Text>
            </>
          )}
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  loadingText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  errorText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.error,
  },
  errorDetail: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.xs,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
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
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.error,
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
