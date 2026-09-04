// src/stores/savedStore.ts
// Store global de Zustand para gestionar viviendas postuladas / guardadas en interés por el asociado

import { create } from 'zustand';
import type { Item } from '../types';

export interface SavedStore {
  // Lista de viviendas de interés guardadas por el asociado
  items: Item[];

  // Acciones
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;

  // Helper/Selector computado
  isItemSaved: (id: string) => boolean;
}

export const useSavedStore = create<SavedStore>((set, get) => ({
  items: [],

  addItem: (item: Item) => {
    const isAlreadySaved = get().items.some((i) => i.id === item.id);
    if (isAlreadySaved) {
      return;
    }
    set((state) => ({
      items: [item, ...state.items],
    }));
  },

  removeItem: (id: string) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));
  },

  clearAll: () => {
    set({ items: [] });
  },

  isItemSaved: (id: string) => {
    return get().items.some((i) => i.id === id);
  },
}));
