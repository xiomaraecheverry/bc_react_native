// src/screens/HomeScreen.tsx
// Lista de proyectos de vivienda de la Cooperativa con pull-to-refresh y navegación a Create / Edit

import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { useDeleteItem, useItems } from '../hooks/useItems';
import type { Item } from '../types';
import type { RootStackParamList } from '../navigation/types';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeNavProp>();
  const { data, isLoading, isError, isFetching, refetch } = useItems();
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteItem();

  const handleDelete = (id: string | number, name: string) => {
    Alert.alert(
      'Eliminar Vivienda',
      `¿Estás seguro de que deseas eliminar "${name}" del catálogo de la cooperativa?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteItem(id),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando proyectos de vivienda...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Error al cargar proyectos</Text>
        <Text style={styles.errorSubtitle}>
          Verifica la conexión a la base de datos de la cooperativa.
        </Text>
        <Pressable style={styles.retryBtn} onPress={() => void refetch()}>
          <Text style={styles.retryBtnText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.content}
        data={data ?? []}
        keyExtractor={(item) => String(item.id)}
        refreshing={isFetching && !isLoading}
        onRefresh={refetch}
        ListHeaderComponent={
          <View style={styles.headerBanner}>
            <Text style={styles.headerSubtitle}>
              Catálogo de Proyectos Habitacionales
            </Text>
            <Text style={styles.headerCount}>
              {data?.length ?? 0} {data?.length === 1 ? 'proyecto disponible' : 'proyectos disponibles'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏡</Text>
            <Text style={styles.emptyTitle}>No hay proyectos registrados</Text>
            <Text style={styles.emptyText}>
              Empieza registrando una nueva vivienda o proyecto para los asociados.
            </Text>
            <Pressable
              style={styles.createFirstBtn}
              onPress={() => navigation.navigate('Create')}
            >
              <Text style={styles.createFirstBtnText}>+ Crear Primer Proyecto</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <HousingCard
            item={item}
            onPressEdit={() =>
              navigation.navigate('Edit', { id: item.id, name: item.name })
            }
            onPressDelete={() => handleDelete(item.id, item.name)}
            isDeleting={isDeleting}
          />
        )}
      />

      {/* Floating Action Button */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => navigation.navigate('Create')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>
    </View>
  );
}

// ──────────────────────────────────────────────
// SUB-COMPONENTE: Tarjeta de Vivienda
// ──────────────────────────────────────────────

interface HousingCardProps {
  item: Item;
  onPressEdit: () => void;
  onPressDelete: () => void;
  isDeleting: boolean;
}

function HousingCard({
  item,
  onPressEdit,
  onPressDelete,
  isDeleting,
}: HousingCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      {/* Imagen con badges */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              item.imagen ||
              'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
          }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.imageBadgeTop}>
          <View style={styles.cityBadge}>
            <Text style={styles.cityBadgeText}>📍 {item.ciudad}</Text>
          </View>
          <View
            style={[
              styles.typeBadge,
              item.tipoVivienda === 'Vivienda VIS' && styles.visBadge,
            ]}
          >
            <Text style={styles.typeBadgeText}>{item.tipoVivienda}</Text>
          </View>
        </View>

        {item.subsidio && (
          <View style={styles.subsidyBadge}>
            <Text style={styles.subsidyText}>✓ Subsidio Cooperativo</Text>
          </View>
        )}
      </View>

      {/* Contenido de la tarjeta */}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Chips de características */}
        <View style={styles.featuresRow}>
          <View style={styles.featureChip}>
            <Text style={styles.featureChipText}>📐 {item.area} m²</Text>
          </View>
          <View style={styles.featureChip}>
            <Text style={styles.featureChipText}>🛏 {item.habitaciones} hab</Text>
          </View>
          <View style={styles.featureChip}>
            <Text style={styles.featureChipText}>🚿 {item.banos} baños</Text>
          </View>
        </View>

        {/* Precios y cuotas */}
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.priceLabel}>Valor Comercial</Text>
            <Text style={styles.priceValue}>{item.precio}</Text>
          </View>
          <View style={styles.savingsBox}>
            <Text style={styles.savingsLabel}>Ahorro mensual</Text>
            <Text style={styles.savingsValue}>{item.ahorroMensual}</Text>
          </View>
        </View>

        {/* Acciones */}
        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [styles.editBtn, pressed && styles.btnPressed]}
            onPress={onPressEdit}
          >
            <Text style={styles.editBtnText}>✏️ Editar Ficha</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.deleteBtn,
              pressed && styles.btnPressed,
              isDeleting && styles.btnDisabled,
            ]}
            onPress={onPressDelete}
            disabled={isDeleting}
          >
            <Text style={styles.deleteBtnText}>🗑</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ──────────────────────────────────────────────
// ESTILOS
// ──────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
    gap: SPACING.lg,
    paddingBottom: 90,
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
  retryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 2,
    marginTop: SPACING.sm,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  headerBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.label,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  headerCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
    marginTop: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.xs,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  createFirstBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  createFirstBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    width: '100%',
    backgroundColor: COLORS.surface,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageBadgeTop: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cityBadge: {
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  cityBadgeText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '600',
  },
  typeBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  visBadge: {
    backgroundColor: COLORS.badgeVis,
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  subsidyBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  subsidyText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  cardTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 18,
    color: COLORS.text,
  },
  cardDescription: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  featureChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  priceLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSubtle,
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryLight,
  },
  savingsBox: {
    alignItems: 'flex-end',
  },
  savingsLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSubtle,
    textTransform: 'uppercase',
  },
  savingsValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.accentLight,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  editBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    color: COLORS.primaryLight,
    fontWeight: '700',
    fontSize: 13,
  },
  deleteBtn: {
    width: 44,
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontSize: 16,
  },
  btnPressed: {
    opacity: 0.75,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabPressed: {
    transform: [{ scale: 0.92 }],
    backgroundColor: COLORS.primaryDark,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
    marginTop: -2,
  },
});
