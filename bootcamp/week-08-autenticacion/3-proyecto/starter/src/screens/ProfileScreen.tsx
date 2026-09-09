import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { theme } from '../theme';

export function ProfileScreen(): React.JSX.Element {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas salir del portal de asociados de CoopVivienda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // RootNavigator detectará isAuthenticated === false y mostrará AuthNavigator
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar y encabezado de asociado */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.firstName?.[0]?.toUpperCase() ?? user?.username?.[0]?.toUpperCase() ?? 'A'}
          </Text>
        </View>
        <Text style={styles.name}>
          {user ? `${user.firstName} ${user.lastName}` : 'Asociado CoopVivienda'}
        </Text>
        <Text style={styles.email}>{user?.email ?? 'asociado@coopvivienda.com'}</Text>
        <View style={styles.badgeAfiliacion}>
          <Text style={styles.badgeAfiliacionText}>
            Estado: {user?.estadoAfiliacion ?? 'Activo'}
          </Text>
        </View>
      </View>

      {/* Información del Asociado en la Cooperativa */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos del Asociado</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nº de Asociado</Text>
          <Text style={styles.infoValue}>{user?.numeroAsociado ?? 'COOP-2026-0001'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Usuario de Acceso</Text>
          <Text style={styles.infoValue}>{user?.username ?? '—'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ID en Base de Datos</Text>
          <Text style={styles.infoValue}>{user?.id ?? '—'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Antigüedad</Text>
          <Text style={styles.infoValue}>{user?.antiguedadMeses ?? 36} meses</Text>
        </View>
      </View>

      {/* Resumen Financiero y de Vivienda */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado Financiero y Subsidios</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ahorro Programado</Text>
          <Text style={[styles.infoValue, styles.highlightValue]}>
            {user?.ahorroAcumulado ?? '$ 14.500.000 COP'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Línea de Crédito</Text>
          <Text style={styles.infoValue}>
            {user?.lineaCreditoAprobada ?? 'Crédito Hipotecario VIS Solidario'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Postulaciones Activas</Text>
          <Text style={styles.infoValue}>
            {user?.postulacionesActivas ?? 2} proyecto(s)
          </Text>
        </View>
      </View>

      {/* Seguridad & Almacenamiento Seguro */}
      <View style={styles.securityCard}>
        <Text style={styles.securityTitle}>🔐 Seguridad y Tokens de Sesión</Text>
        <Text style={styles.securityText}>
          • Tokens (Access & Refresh JWT) cifrados en <Text style={styles.securityBold}>Expo SecureStore</Text>.
        </Text>
        <Text style={styles.securityText}>
          • Perfil del usuario sincronizado mediante <Text style={styles.securityBold}>Zustand Persist</Text>.
        </Text>
        <Text style={styles.securityText}>
          • Renovación automática con <Text style={styles.securityBold}>Axios Interceptors (401 Retry)</Text>.
        </Text>
      </View>

      {/* Logout */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión Segura</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  avatarContainer: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: theme.spacing.sm,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#38bdf8',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
  },
  name: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.text,
  },
  email: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  badgeAfiliacion: {
    backgroundColor: '#065f46',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: theme.radius.full,
    marginTop: 4,
  },
  badgeAfiliacionText: {
    color: '#a7f3d0',
    fontSize: 11,
    fontWeight: '700',
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.brand,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: '600',
  },
  highlightValue: {
    color: '#4ade80',
    fontWeight: '700',
  },
  securityCard: {
    backgroundColor: '#0f2942',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: 6,
    borderWidth: 1,
    borderColor: '#1e40af',
  },
  securityTitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: '700',
    color: theme.colors.brand,
    marginBottom: 2,
  },
  securityText: {
    fontSize: 11,
    color: '#cbd5e1',
    lineHeight: 16,
  },
  securityBold: {
    color: '#38bdf8',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radius.md,
    padding: 14,
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: theme.fontSize.md,
  },
});

