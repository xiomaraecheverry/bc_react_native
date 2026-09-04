// src/hooks/useItems.ts
// Custom hooks de TanStack Query v5 para el dominio Cooperativa de Vivienda

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { housingService } from '../services/api';
import type { CreateItemPayload, Item } from '../types';

// Query key centralizada para caché e invalidación
export const ITEMS_QUERY_KEY = ['proyectos'] as const;

// 1. Obtener listado de proyectos
export function useItems() {
  return useQuery<Item[]>({
    queryKey: ITEMS_QUERY_KEY,
    queryFn: housingService.getProyectos,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

// 2. Obtener un proyecto por ID
export function useItemById(id: string | number) {
  return useQuery<Item>({
    queryKey: [...ITEMS_QUERY_KEY, String(id)],
    queryFn: () => housingService.getProyectoById(id),
    enabled: !!id,
  });
}

// 3. Crear / Registrar un nuevo proyecto de vivienda
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation<Item, Error, CreateItemPayload>({
    mutationFn: (payload: CreateItemPayload) => housingService.createProyecto(payload),
    onSuccess: () => {
      // Invalida la caché para que la lista se refresque automáticamente
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Error al registrar proyecto:', error.message);
    },
  });
}

// 4. Eliminar proyecto de vivienda
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string | number>({
    mutationFn: (id: string | number) => housingService.deleteProyecto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
    },
  });
}
