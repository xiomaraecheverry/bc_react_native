import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { theme } from '../theme';
import type { HousingProject } from '../types';

const MOCK_HOUSING_PROJECTS: HousingProject[] = [
  {
    id: 1,
    nombreProyecto: 'Residencial Los Robles VIS',
    ubicacion: 'Sector Norte — Cra 45 # 128-20',
    tipoVivienda: 'VIS',
    precioDesde: '$ 155.000.000 COP',
    unidadesDisponibles: 18,
    subsidioAplica: true,
    avanceObra: 85,
    descripcion: 'Apartamentos de 3 alcobas, balcón, zonas verdes y salón comunal.',
  },
  {
    id: 2,
    nombreProyecto: 'Torres del Parque VIP',
    ubicacion: 'Ciudadela Solidaria — Mz 4 Lote 12',
    tipoVivienda: 'VIP',
    precioDesde: '$ 115.000.000 COP',
    unidadesDisponibles: 9,
    subsidioAplica: true,
    avanceObra: 60,
    descripcion: 'Vivienda de interés prioritario con subsidio concurrente y cuota solidaria.',
  },
  {
    id: 3,
    nombreProyecto: 'Urbanización Mirador del Valle',
    ubicacion: 'Variante Occidental Km 3',
    tipoVivienda: 'VIS',
    precioDesde: '$ 168.000.000 COP',
    unidadesDisponibles: 24,
    subsidioAplica: true,
    avanceObra: 40,
    descripcion: 'Casas bifamiliares con posibilidad de ampliación y parqueadero privado.',
  },
  {
    id: 4,
    nombreProyecto: 'Bosques de la Cooperativa No VIS',
    ubicacion: 'Colinas del Campestre — Lote 8',
    tipoVivienda: 'No VIS',
    precioDesde: '$ 230.000.000 COP',
    unidadesDisponibles: 5,
    subsidioAplica: false,
    avanceObra: 95,
    descripcion: 'Exclusivo proyecto con acabados premium y tasa de crédito preferencial.',
  },
];

export function HomeScreen(): React.JSX.Element {
  const user = useAuthStore((state) => state.user);

  const { data: projects, isLoading } = useQuery<HousingProject[]>({
    queryKey: ['housing-projects'],
    queryFn: async () => {
      // Simulación de carga desde API de la Cooperativa
      await new Promise((resolve) => setTimeout(resolve, 400));
      return MOCK_HOUSING_PROJECTS;
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.brand} />
        <Text style={styles.loadingText}>Cargando proyectos de vivienda...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Saludo y Resumen del Asociado */}
      <View style={styles.header}>
        <View style={styles.badgeHeader}>
          <Text style={styles.badgeText}>
            Nº {user?.numeroAsociado ?? 'COOP-2026-0001'} • {user?.estadoAfiliacion ?? 'Activo'}
          </Text>
        </View>
        <Text style={styles.greeting}>
          Hola, {user?.firstName ?? user?.username} 👋
        </Text>
        <Text style={styles.subtitle}>
          Bienvenido al portal de vivienda solidaria y gestión de subsidios.
        </Text>
      </View>

      {/* Tarjeta de Resumen Financiero Cooperativo */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Ahorro Programado</Text>
          <Text style={styles.summaryValue}>{user?.ahorroAcumulado ?? '$ 14.500.000 COP'}</Text>
          <Text style={styles.summarySub}>{user?.antiguedadMeses ?? 36} meses de antigüedad</Text>
        </View>

        <View style={styles.summaryCardSecondary}>
          <Text style={styles.summaryLabel}>Línea Aprobada</Text>
          <Text style={styles.summaryCredit}>{user?.lineaCreditoAprobada ?? 'Crédito VIS'}</Text>
          <Text style={styles.summarySub}>
            {user?.postulacionesActivas ?? 0} postulación(es) en curso
          </Text>
        </View>
      </View>

      {/* Sección Proyectos Habitacionales */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Proyectos de Vivienda Disponibles</Text>
        <Text style={styles.sectionBadge}>Convocatoria 2026</Text>
      </View>

      <FlatList
        data={projects}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.projectCard}>
            <View style={styles.cardTop}>
              <View style={styles.tagRow}>
                <View
                  style={[
                    styles.typeTag,
                    item.tipoVivienda === 'VIP'
                      ? styles.tagVip
                      : item.tipoVivienda === 'VIS'
                      ? styles.tagVis
                      : styles.tagNoVis,
                  ]}
                >
                  <Text style={styles.typeTagText}>{item.tipoVivienda}</Text>
                </View>
                {item.subsidioAplica && (
                  <View style={styles.subsidioTag}>
                    <Text style={styles.subsidioTagText}>Aplica Subsidio</Text>
                  </View>
                )}
              </View>
              <Text style={styles.unidadesText}>{item.unidadesDisponibles} disp.</Text>
            </View>

            <Text style={styles.projectName}>{item.nombreProyecto}</Text>
            <Text style={styles.projectLocation}>📍 {item.ubicacion}</Text>
            <Text style={styles.projectDesc}>{item.descripcion}</Text>

            <View style={styles.priceRow}>
              <View>
                <Text style={styles.priceLabel}>Desde</Text>
                <Text style={styles.priceValue}>{item.precioDesde}</Text>
              </View>

              <View style={styles.progressContainer}>
                <Text style={styles.progressLabel}>Avance: {item.avanceObra}%</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${item.avanceObra}%` }]} />
                </View>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay proyectos disponibles en este momento</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    gap: theme.spacing.sm,
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    gap: 4,
  },
  badgeHeader: {
    alignSelf: 'flex-start',
    backgroundColor: '#0369a1',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: theme.radius.sm,
    marginBottom: 4,
  },
  badgeText: {
    color: '#f0f9ff',
    fontSize: theme.fontSize.xs,
    fontWeight: '700',
  },
  greeting: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#1e3a8a',
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    gap: 2,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  summaryCardSecondary: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    gap: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#93c5fd',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: '#ffffff',
  },
  summaryCredit: {
    fontSize: theme.fontSize.xs,
    fontWeight: '700',
    color: theme.colors.brand,
  },
  summarySub: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
    color: theme.colors.text,
  },
  sectionBadge: {
    fontSize: 11,
    color: theme.colors.brand,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  projectCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
  },
  typeTag: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: theme.radius.sm,
  },
  tagVis: {
    backgroundColor: '#0284c7',
  },
  tagVip: {
    backgroundColor: '#16a34a',
  },
  tagNoVis: {
    backgroundColor: '#d97706',
  },
  typeTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  subsidioTag: {
    backgroundColor: '#059669',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: theme.radius.sm,
  },
  subsidioTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  unidadesText: {
    fontSize: 11,
    color: theme.colors.brand,
    fontWeight: '600',
  },
  projectName: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.text,
  },
  projectLocation: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  projectDesc: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 4,
  },
  priceLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  priceValue: {
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
    color: '#4ade80',
  },
  progressContainer: {
    width: 110,
    gap: 2,
  },
  progressLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  progressBar: {
    height: 5,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.brand,
    borderRadius: 3,
  },
  emptyText: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});

