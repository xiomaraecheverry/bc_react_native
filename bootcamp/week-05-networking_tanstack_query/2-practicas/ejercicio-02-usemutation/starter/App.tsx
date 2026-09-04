// ejercicio-02-usemutation/starter/App.tsx
// Ejercicio guiado resuelto: crear y eliminar posts con useMutation.

import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ListRenderItem,
} from 'react-native';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

const queryClient = new QueryClient();

// ============================================================
// TIPOS
// ============================================================
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// ============================================================
// PASO 1: queryFn para listar posts
// ============================================================
async function fetchPosts(): Promise<Post[]> {
  const { data } = await axios.get<Post[]>(
    'https://jsonplaceholder.typicode.com/posts?_limit=10'
  );
  return data;
}

// ============================================================
// COMPONENTE: PostCard
// ============================================================
interface PostCardProps {
  post: Post;
  onDelete: () => void;
  isDeleting: boolean;
}

function PostCard({ post, onDelete, isDeleting }: PostCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.postId}>#{post.id}</Text>
        <Pressable
          onPress={onDelete}
          disabled={isDeleting}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && { opacity: 0.6 },
            isDeleting && { opacity: 0.4 },
          ]}
        >
          <Text style={styles.deleteButtonText}>
            {isDeleting ? '...' : '✕'}
          </Text>
        </Pressable>
      </View>
      <Text style={styles.postTitle} numberOfLines={2}>{post.title}</Text>
      <Text style={styles.postBody} numberOfLines={2}>{post.body}</Text>
    </View>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL: PostsScreen
// ============================================================

function PostsScreen(): React.JSX.Element {
  const [newTitle, setNewTitle] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, isError, refetch } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const { mutate: createPost, isPending: isCreating } = useMutation({
    mutationFn: async (title: string) => {
      const { data: created } = await axios.post<Post>(
        'https://jsonplaceholder.typicode.com/posts',
        { title, body: 'Contenido de prueba', userId: 1 }
      );
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setNewTitle('');
    },
  });

  const { mutate: deletePost, isPending: isDeleting, variables: deletingId } = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#61DAFB" />
        <Text style={styles.hint}>Cargando posts...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>❌ Error al cargar posts</Text>
      </View>
    );
  }

  const renderItem: ListRenderItem<Post> = ({ item }) => (
    <PostCard
      post={item}
      onDelete={() => deletePost(item.id)}
      isDeleting={isDeleting && deletingId === item.id}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Posts — JSONPlaceholder</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Título del nuevo post"
          placeholderTextColor="#484f58"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <Pressable
          style={({ pressed }) => [
            styles.createButton,
            pressed && { opacity: 0.8 },
            isCreating && styles.createButtonDisabled,
          ]}
          onPress={() => {
            if (newTitle.trim()) createPost(newTitle.trim());
          }}
          disabled={isCreating || !newTitle.trim()}
        >
          <Text style={styles.createButtonText}>
            {isCreating ? 'Creando...' : 'Crear post'}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={data ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onRefresh={refetch}
        refreshing={isFetching && !isLoading}
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
      <PostsScreen />
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
  form: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#e6edf3',
    fontSize: 14,
  },
  createButton: {
    backgroundColor: '#61DAFB',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#30363d',
  },
  createButtonText: {
    color: '#0d1117',
    fontWeight: '700',
    fontSize: 13,
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
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postId: {
    fontSize: 11,
    color: '#484f58',
    fontWeight: '600',
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e6edf3',
  },
  postBody: {
    fontSize: 13,
    color: '#8b949e',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#21262d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#f85149',
    fontSize: 12,
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  hint: {
    fontSize: 13,
    color: '#484f58',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#f85149',
    fontWeight: '600',
  },
});
