// src/screens/HomeScreen.tsx
// Lista de viviendas de la cooperativa con soporte offline (AsyncStorage),
// ordenación y vista compacta reactiva (MMKV), y acceso a Create y Settings.

import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { useDeleteItem, useItems } from '../hooks/useItems';
import { usePreferences } from '../hooks/usePreferences';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { Item } from '../types';
import type { RootStackParamList } from '../navigation/types';

type HomeScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNavProp>();
  const { data, isLoading, isError, refetch, isFetching } = useItems();
  const { sortOrder, compactMode, filterSubsidioOnly } = usePreferences();
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteItem();

  // 1. Filtrar y ordenar según preferencias reactivas de MMKV
  const processedItems = useMemo(() => {
    if (!data?.items) return [];

    let list = [...data.items];

    // Filtro por subsidio cooperativo
    if (filterSubsidioOnly) {
      list = list.filter((item) => item.subsidio);
    }

    // Ordenación según preferencia activa
    return list.sort((a, b) => {
      if (sortOrder === 'precio_asc') {
        const pA = Number(a.precio.replace(/\D/g, '')) || 0;
        const pB = Number(b.precio.replace(/\D/g, '')) || 0;
        return pA - pB;
      }
      if (sortOrder === 'precio_desc') {
        const pA = Number(a.precio.replace(/\D/g, '')) || 0;
        const pB = Number(b.precio.replace(/\D/g, '')) || 0;
        return pB - pA;
      }
      if (sortOrder === 'area') {
        return b.area - a.area;
      }
      // 'alfabetico'
      return a.name.localeCompare(b.name);
    });
  }, [data?.items, sortOrder, filterSubsidioOnly]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando catálogo habitacional...</Text>
      </View>
    );
  }

  if (isError && !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Error de Conexión</Text>
        <Text style={styles.errorSubtitle}>
          No hay conexión de red y no se encontró copia en caché local.
        </Text>
        <Pressable style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Banner de caché offline — visible cuando los datos provienen de AsyncStorage */}
      {data?.source === 'cache' && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineIcon}>⚡</Text>
          <Text style={styles.offlineText}>
            Modo Offline: Mostrando catálogo guardado localmente en AsyncStorage.
          </Text>
        </View>
      )}

      <FlatList
        data={processedItems}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isFetching && !isLoading}
        ListHeaderComponent={
          <View style={styles.headerInfo}>
            <Text style={styles.headerCount}>
              {processedItems.length}{' '}
              {processedItems.length === 1
                ? 'proyecto disponible'
                : 'proyectos disponibles'}
            </Text>
            <Text style={styles.headerSort}>
              Orden: <Text style={{ color: COLORS.primaryLight }}>{sortOrder}</Text>
              {compactMode ? ' · Vista compacta' : ''}
              {filterSubsidioOnly ? ' · Solo VIS/Subsidio' : ''}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🏘️</Text>
            <Text style={styles.emptyTitle}>Sin viviendas para mostrar</Text>
            <Text style={styles.emptyText}>
              {filterSubsidioOnly
                ? 'No hay proyectos con subsidio activo que coincidan con tu filtro.'
                : 'No hay proyectos registrados en el catálogo cooperativo.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <HousingItemCard
            item={item}
            compact={compactMode}
            onDelete={() => deleteItem(item.id)}
            isDeleting={isDeleting}
          />
        )}
      />

      {/* Floating Action Button para Registrar */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => navigation.navigate('Create')}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

// ──────────────────────────────────────────────
// Subcomponente: HousingItemCard (Normal / Compacto)
// ──────────────────────────────────────────────
interface HousingItemCardProps {
  item: Item;
  compact: boolean;
  onDelete: () => void;
  isDeleting: boolean;
}

function HousingItemCard({
  item,
  compact,
  onDelete,
  isDeleting,
}: HousingItemCardProps): React.JSX.Element {
  if (compact) {
    return (
      <View style={styles.compactCard}>
        <View style={styles.compactLeft}>
          <Text style={styles.compactTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.compactSubtitle}>
            📍 {item.ciudad} · {item.tipoVivienda} · {item.area} m² · {item.precio}
          </Text>
        </View>
        <Pressable
          style={styles.compactDelete}
          onPress={onDelete}
          disabled={isDeleting}
        >
          <Text style={styles.compactDeleteText}>🗑</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.card}>
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
        <View style={styles.badgesTop}>
          <View style={styles.cityBadge}>
            <Text style={styles.cityBadgeText}>📍 {item.ciudad}</Text>
          </View>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{item.tipoVivienda}</Text>
          </View>
        </View>

        {item.subsidio && (
          <View style={styles.subsidyBadge}>
            <Text style={styles.subsidyText}>✓ Subsidio Cooperativo</Text>
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.featuresRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>📐 {item.area} m²</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>🛏 {item.habitaciones} habs</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>🚿 {item.banos} baños</Text>
          </View>
        </View>

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
      </View>
    </View>
  );
}

// ──────────────────────────────────────────────
// Estilos
// ──────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.md, gap: SPACING.md, paddingBottom: 90 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  loadingText: { ...TYPOGRAPHY.body, color: COLORS.textMuted },
  errorTitle: { ...TYPOGRAPHY.h2, color: COLORS.errorLight },
  errorSubtitle: { ...TYPOGRAPHY.body, color: COLORS.textMuted, textAlign: 'center' },
  retryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 2,
  },
  retryText: { color: '#FFFFFF', fontWeight: '700' },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: '#78350F',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#92400E',
  },
  offlineIcon: { fontSize: 14 },
  offlineText: { ...TYPOGRAPHY.caption, color: '#FDE68A', fontWeight: '600', flex: 1 },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  headerCount: { ...TYPOGRAPHY.label, color: COLORS.textSecondary },
  headerSort: { ...TYPOGRAPHY.caption, color: COLORS.textMuted },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.xxl,
    marginTop: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  emptyIcon: { fontSize: 44, marginBottom: SPACING.xs },
  emptyTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },
  emptyText: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, textAlign: 'center' },

  // Card Normal
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
    width: '100%',
    backgroundColor: COLORS.surface,
  },
  cardImage: { width: '100%', height: '100%' },
  badgesTop: {
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
  cityBadgeText: { color: COLORS.text, fontSize: 11, fontWeight: '600' },
  typeBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  typeBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  subsidyBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  subsidyText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  cardBody: { padding: SPACING.md, gap: SPACING.sm },
  cardTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },
  cardDescription: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, lineHeight: 17 },
  featuresRow: { flexDirection: 'row', gap: SPACING.xs },
  chip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '500' },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginTop: 2,
  },
  priceLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSubtle, fontSize: 10 },
  priceValue: { fontSize: 14, fontWeight: '700', color: COLORS.primaryLight },
  savingsBox: { alignItems: 'flex-end' },
  savingsLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSubtle, fontSize: 10 },
  savingsValue: { fontSize: 13, fontWeight: '700', color: COLORS.accentLight },

  // Card Compacta
  compactCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  compactLeft: { flex: 1, gap: 2 },
  compactTitle: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.text },
  compactSubtitle: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, fontSize: 11 },
  compactDelete: {
    padding: SPACING.xs,
    backgroundColor: COLORS.errorBg,
    borderRadius: RADIUS.sm,
  },
  compactDeleteText: { fontSize: 14 },

  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabPressed: { transform: [{ scale: 0.94 }], backgroundColor: COLORS.primaryDark },
  fabText: { fontSize: 30, color: '#FFFFFF', fontWeight: '300', marginTop: -2 },
});
