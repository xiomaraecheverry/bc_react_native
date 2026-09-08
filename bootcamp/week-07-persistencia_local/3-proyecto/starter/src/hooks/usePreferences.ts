// src/hooks/usePreferences.ts
// Hook de preferencias del usuario almacenadas de forma sincrónica y reactiva con MMKV

import {
  useMMKVBoolean,
  useMMKVNumber,
  useMMKVString,
} from 'react-native-mmkv';
import { storage } from '../storage/mmkv';
import type { SortOrder } from '../types';

// ─── Claves de preferencias (centralizadas) ──────────────────────────────────
const PREF_KEYS = {
  SORT_ORDER: 'pref_sortOrder_coop',
  COMPACT_MODE: 'pref_compactMode_coop',
  FILTER_SUBSIDIO: 'pref_filterSubsidio_coop',
  ITEMS_PER_PAGE: 'pref_itemsPerPage_coop',
} as const;

// ─── Hook principal ──────────────────────────────────────────────────────────
export function usePreferences() {
  const [rawSortOrder, setRawSortOrder] = useMMKVString(
    PREF_KEYS.SORT_ORDER,
    storage
  );
  const [compactMode, setCompactMode] = useMMKVBoolean(
    PREF_KEYS.COMPACT_MODE,
    storage
  );
  const [filterSubsidioOnly, setFilterSubsidioOnly] = useMMKVBoolean(
    PREF_KEYS.FILTER_SUBSIDIO,
    storage
  );
  const [itemsPerPage, setItemsPerPage] = useMMKVNumber(
    PREF_KEYS.ITEMS_PER_PAGE,
    storage
  );

  const sortOrder: SortOrder =
    (rawSortOrder as SortOrder) ?? 'alfabetico';

  return {
    // Ordenación
    sortOrder,
    setSortOrder: (value: SortOrder) => setRawSortOrder(value),

    // Modo compacto
    compactMode: compactMode ?? false,
    setCompactMode: (value: boolean) => setCompactMode(value),

    // Filtro exclusivo de subsidio
    filterSubsidioOnly: filterSubsidioOnly ?? false,
    setFilterSubsidioOnly: (value: boolean) => setFilterSubsidioOnly(value),

    // Proyectos por página
    itemsPerPage: itemsPerPage ?? 10,
    setItemsPerPage: (value: number) => setItemsPerPage(value),
  };
}
