// src/hooks/useItems.ts
// TanStack Query hooks con caché offline persistida en AsyncStorage para Cooperativa de Vivienda

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createItem,
  deleteItem,
  fetchItemById,
  fetchItems,
  updateItem,
} from '../services/api';
import type { CreateItemPayload, Item, ItemsWithSource } from '../types';

export const ITEMS_QUERY_KEY = ['items_coop'] as const;
const CACHE_KEY = '@coop_vivienda_items_cache';

// ─── useItems con fallback offline automático en AsyncStorage ────────────────
export function useItems() {
  return useQuery<ItemsWithSource>({
    queryKey: ITEMS_QUERY_KEY,
    queryFn: async (): Promise<ItemsWithSource> => {
      try {
        const data = await fetchItems();
        // Guardar en AsyncStorage para soporte offline
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
        return { items: data, source: 'network' };
      } catch {
        // Fallback offline si falla la conexión
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          return { items: JSON.parse(cached) as Item[], source: 'cache' };
        }
        throw new Error('Sin conexión y sin datos en caché offline');
      }
    },
    staleTime: 1000 * 60 * 3,
  });
}

// ─── useItemById ─────────────────────────────────────────────────────────────
export function useItemById(id: number | string | undefined) {
  return useQuery<Item>({
    queryKey: [...ITEMS_QUERY_KEY, String(id)],
    queryFn: () => fetchItemById(id!),
    enabled: !!id,
  });
}

// ─── useCreateItem ───────────────────────────────────────────────────────────
export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateItemPayload) => createItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
    },
  });
}

// ─── useUpdateItem ───────────────────────────────────────────────────────────
export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: { id: number | string } & Partial<CreateItemPayload>) =>
      updateItem(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...ITEMS_QUERY_KEY, String(variables.id)],
      });
    },
  });
}

// ─── useDeleteItem ───────────────────────────────────────────────────────────
export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
    },
  });
}
