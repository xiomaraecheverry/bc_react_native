// ejercicio-01-usequery-basico/starter/App.tsx
// Ejercicio guiado resuelto: consumir una API con useQuery de TanStack Query v5.

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import axios from 'axios';

// ============================================================
// PASO 1: Crear el QueryClient
// ============================================================
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,  // 1 minuto
      retry: 1,
    },
  },
});

// ============================================================
// TIPOS
// ============================================================
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

// ============================================================
// PASO 2: Función queryFn
// ============================================================
async function fetchUsers(): Promise<User[]> {
  const response = await axios.get<User[]>(
    'https://jsonplaceholder.typicode.com/users'
  );
  return response.data;
}

// ============================================================
// SUB-COMPONENTE: UserCard
// ============================================================
interface UserCardProps {
  user: User;
}

function UserCard({ user }: UserCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.detail}>✉ {user.email}</Text>
      <Text style={styles.detail}>📞 {user.phone}</Text>
      <Text style={styles.detail}>🌐 {user.website}</Text>
    </View>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL: UserListScreen
// ============================================================

function UserListScreen(): React.JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#61DAFB" />
        <Text style={styles.loadingText}>Cargando usuarios...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>❌ No se pudo cargar la lista</Text>
        <Text style={styles.hint}>Verifica tu conexión a internet</Text>
      </View>
    );
  }

  const renderItem: ListRenderItem<User> = ({ item }) => (
    <UserCard user={item} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Usuarios (JSONPlaceholder)</Text>

      <FlatList
        data={data ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onRefresh={refetch}
        refreshing={isFetching && !isLoading}
        ListEmptyComponent={
          <Text style={styles.hint}>No hay usuarios</Text>
        }
      />
    </View>
  );
}

// ============================================================
// ROOT: App
// ============================================================

export default function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <UserListScreen />
    </QueryClientProvider>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
    paddingTop: 60,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e6edf3',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  separator: { height: 10 },
  card: {
    backgroundColor: '#161b22',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#30363d',
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e6edf3',
  },
  detail: {
    fontSize: 13,
    color: '#8b949e',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: { fontSize: 14, color: '#8b949e' },
  errorText: { fontSize: 16, color: '#f85149', fontWeight: '600' },
  hint: { fontSize: 13, color: '#484f58', textAlign: 'center', paddingHorizontal: 32 },
});
