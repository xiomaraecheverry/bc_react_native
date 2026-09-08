// src/hooks/useItems.ts
// Custom hooks para operaciones CRUD usando TanStack Query v5 + housingService

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { housingService } from '../services/api';
import type { CreateItemPayload, Item, UpdateItemPayload } from '../types';

export const ITEMS_QUERY_KEY = ['items'] as const;

// ─────────────────────────────────────────
// READ — Lista de proyectos de vivienda
// ─────────────────────────────────────────
export function useItems() {
  return useQuery<Item[]>({
    queryKey: ITEMS_QUERY_KEY,
    queryFn: () => housingService.getProyectos(),
  });
}

// ─────────────────────────────────────────
// READ — Proyecto individual por ID (para EditScreen)
// ─────────────────────────────────────────
export function useItemById(id: number | string | undefined) {
  return useQuery<Item>({
    queryKey: [...ITEMS_QUERY_KEY, String(id)],
    queryFn: () => housingService.getProyectoById(id!),
    enabled: !!id,
  });
}

// ─────────────────────────────────────────
// CREATE — Mutación para crear nuevo proyecto
// ─────────────────────────────────────────
export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation<Item, Error, CreateItemPayload>({
    mutationFn: (payload) => housingService.createProyecto(payload),
    onSuccess: () => {
      // Invalidar la lista para recargar datos automáticamente
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
    },
  });
}

// ─────────────────────────────────────────
// UPDATE — Mutación para actualizar proyecto existente
// ─────────────────────────────────────────
export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation<Item, Error, UpdateItemPayload>({
    mutationFn: (payload) => housingService.updateProyecto(payload),
    onSuccess: (updated) => {
      // Invalidar tanto la lista como la caché del ítem individual
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...ITEMS_QUERY_KEY, String(updated.id)],
      });
    },
  });
}

// ─────────────────────────────────────────
// DELETE — Mutación para eliminar proyecto
// ─────────────────────────────────────────
export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string | number>({
    mutationFn: (id) => housingService.deleteProyecto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
    },
  });
}
