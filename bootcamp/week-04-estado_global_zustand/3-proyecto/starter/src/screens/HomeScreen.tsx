// src/screens/HomeScreen.tsx
// Pantalla de catálogo de proyectos de vivienda para asociados

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
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { ITEMS } from '../data/mockData';
import { useSavedStore } from '../stores/savedStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { Item } from '../types';
import type { HomeStackParamList } from '../navigation/types';

type HomeScreenNavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeList'>;

interface ProjectCardProps {
  item: Item;
  onPress: () => void;
}

function ProjectCard({ item, onPress }: ProjectCardProps): React.JSX.Element {
  const isSaved = useSavedStore((state) => state.isItemSaved(item.id));
  const addItem = useSavedStore((state) => state.addItem);
  const removeItem = useSavedStore((state) => state.removeItem);

  const handleToggleBookmark = (e: any): void => {
    e?.stopPropagation?.();
    if (isSaved) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  };

  return (
    <View style={styles.card} testID={`project-card-${item.id}`}>
      {/* Imagen del proyecto */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imagen }} style={styles.foto} resizeMode="cover" />
        <View style={styles.tipoBadge}>
          <Text style={styles.tipoBadgeText}>{item.tipoVivienda}</Text>
        </View>
        <Pressable
          onPress={handleToggleBookmark}
          style={({ pressed }) => [styles.favButton, pressed && { opacity: 0.7 }]}
          hitSlop={8}
          accessibilityLabel={isSaved ? 'Quitar de guardados' : 'Guardar proyecto'}
        >
          <Ionicons
            name={isSaved ? 'heart' : 'heart-outline'}
            size={22}
            color={isSaved ? COLORS.error : '#ffffff'}
          />
        </Pressable>
      </View>

      {/* Información del proyecto */}
      <View style={styles.cardContent}>
        <Text style={styles.nombre}>{item.name}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.ciudad}>Ciudad: {item.ciudad}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.area}>{item.area} m²</Text>
        </View>

        <View style={styles.precioRow}>
          <View>
            <Text style={styles.labelAhorro}>Aporte mensual solidario:</Text>
            <Text style={styles.ahorroMensual}>{item.ahorroMensual}</Text>
          </View>
          <View style={styles.totalPriceRight}>
            <Text style={styles.labelPrecio}>Precio total:</Text>
            <Text style={styles.precio}>{item.precio}</Text>
          </View>
        </View>

        {/* Botón para ver detalles */}
        <Pressable
          style={({ pressed }) => [styles.botonDetalles, pressed && styles.botonPressed]}
          onPress={onPress}
        >
          <Text style={styles.textoBoton}>Ver detalles</Text>
          <Ionicons name="chevron-forward" size={16} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

function HeaderUsuario(): React.JSX.Element {
  return (
    <View style={styles.headerBox}>
      <View style={styles.cajaUsuario}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={20} color={COLORS.primary} />
        </View>
        <View style={styles.usuarioInfo}>
          <Text style={styles.textoUsuario}>Hola, Asociado(a)</Text>
          <Text style={styles.textoAhorro}>Tu ahorro para vivienda es: <Text style={styles.montoAhorro}>$10.000.000</Text></Text>
        </View>
      </View>
      <Text style={styles.tituloLista}>Proyectos de Vivienda Disponibles:</Text>
    </View>
  );
}

export function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNavProp>();
  const items = ITEMS;

  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <ProjectCard
      item={item}
      onPress={() =>
        navigation.navigate('HomeDetail', { id: item.id, name: item.name })
      }
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={<HeaderUsuario />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay proyectos de vivienda disponibles.</Text>
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
  list: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  separator: {
    height: SPACING.md,
  },
  headerBox: {
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  cajaUsuario: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  usuarioInfo: {
    flex: 1,
  },
  textoUsuario: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  textoAhorro: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  montoAhorro: {
    fontWeight: '700',
    color: COLORS.price,
  },
  tituloLista: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  foto: {
    width: '100%',
    height: '100%',
  },
  tipoBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 85, 170, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  tipoBadgeText: {
    ...TYPOGRAPHY.label,
    color: '#ffffff',
    fontSize: 11,
  },
  favButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  nombre: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ciudad: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  dot: {
    color: COLORS.textMuted,
  },
  area: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  precioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginVertical: SPACING.xs,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  labelAhorro: {
    ...TYPOGRAPHY.label,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  ahorroMensual: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.primary,
  },
  totalPriceRight: {
    alignItems: 'flex-end',
  },
  labelPrecio: {
    ...TYPOGRAPHY.label,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  precio: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.price,
  },
  botonDetalles: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.xs,
  },
  botonPressed: {
    opacity: 0.85,
  },
  textoBoton: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginTop: SPACING.xl,
    color: COLORS.textSecondary,
  },
});
