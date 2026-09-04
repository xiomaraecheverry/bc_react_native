// src/screens/SavedScreen.tsx
// Pantalla de proyectos guardados por el asociado (sincronizada vía Zustand)

import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, type CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useSavedStore } from '../stores/savedStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { Item } from '../types';
import type { HomeStackParamList, RootTabParamList } from '../navigation/types';

type SavedScreenNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Saved'>,
  NativeStackNavigationProp<HomeStackParamList>
>;

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('es-CO')}`;
}

interface SavedCardProps {
  item: Item;
  onRemove: () => void;
  onPress: () => void;
}

function SavedProjectCard({ item, onRemove, onPress }: SavedCardProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      testID={`saved-card-${item.id}`}
    >
      <Image source={{ uri: item.imagen }} style={styles.thumbnail} />

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardSubtitle}>
          {item.ciudad} • {item.tipoVivienda}
        </Text>
        <Text style={styles.cardPrice}>{item.precio}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.removeButton, pressed && { opacity: 0.6 }]}
        onPress={onRemove}
        hitSlop={8}
        accessibilityLabel={`Quitar ${item.name} de guardados`}
      >
        <Ionicons name="trash-outline" size={18} color={COLORS.error} />
      </Pressable>
    </Pressable>
  );
}

export function SavedScreen(): React.JSX.Element {
  const navigation = useNavigation<SavedScreenNavProp>();

  const items = useSavedStore((state) => state.items);
  const removeItem = useSavedStore((state) => state.removeItem);
  const clearAll = useSavedStore((state) => state.clearAll);

  const totalAhorroMensual = items.reduce((acc, curr) => acc + curr.ahorroMensualNumerico, 0);

  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <SavedProjectCard
      item={item}
      onRemove={() => removeItem(item.id)}
      onPress={() => {
        navigation.navigate('Home', {
          screen: 'HomeDetail',
          params: { id: item.id, name: item.name },
        });
      }}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header superior */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Mis Proyectos Guardados</Text>
        <Text style={styles.headerSubtitle}>
          Proyectos de vivienda en seguimiento para postulación
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          items.length > 0 ? (
            <View style={styles.listHeader}>
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Proyectos en lista:</Text>
                  <Text style={styles.summaryCount}>{items.length}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total aportes mensuales:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(totalAhorroMensual)}</Text>
                </View>
              </View>

              <View style={styles.actionsBar}>
                <Text style={styles.listHeading}>Listado de Inmuebles</Text>
                <Pressable onPress={clearAll} style={styles.clearBtn} hitSlop={6}>
                  <Ionicons name="trash-bin-outline" size={14} color={COLORS.error} />
                  <Text style={styles.clearBtnText}>Vaciar lista</Text>
                </Pressable>
              </View>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="heart-dislike-outline" size={40} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No tienes proyectos guardados</Text>
            <Text style={styles.emptySubtitle}>
              Explora la pestaña Proyectos y guarda las opciones que se ajusten a tus metas habitacionales.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topHeader: {
    backgroundColor: COLORS.primary,
    paddingTop: 45,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: '#ffffff',
  },
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primaryLight,
    marginTop: 2,
  },
  list: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
    flexGrow: 1,
  },
  separator: {
    height: SPACING.sm,
  },
  listHeader: {
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  summaryBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  summaryCount: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.primary,
  },
  summaryValue: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.price,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
    paddingHorizontal: 2,
  },
  listHeading: {
    ...TYPOGRAPHY.label,
    textTransform: 'uppercase',
    color: COLORS.textMuted,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  clearBtnText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  cardPressed: {
    opacity: 0.85,
  },
  thumbnail: {
    width: 65,
    height: 65,
    borderRadius: RADIUS.sm,
  },
  cardContent: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  cardPrice: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.price,
  },
  removeButton: {
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.md,
  },
  emptyIconCircle: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
    lineHeight: 20,
  },
});
