// src/types/index.ts
// Tipos de datos del dominio: Cooperativa de Vivienda (CoopVivienda)

export type TipoVivienda = 'Apartamento' | 'Casa' | 'Dúplex' | 'Vivienda VIS';

export interface Item {
  id: string | number;
  name: string;
  ciudad: string;
  precio: string;
  ahorroMensual: string;
  tipoVivienda: TipoVivienda;
  area: number;
  habitaciones: number;
  banos: number;
  imagen: string;
  description: string;
  subsidio: boolean;
}

export type CreateItemPayload = Omit<Item, 'id'>;

export type UpdateItemPayload = Partial<CreateItemPayload> & {
  id: string | number;
};

// Resultado de useItems con metadata de origen (red vs. caché offline)
export interface ItemsWithSource {
  items: Item[];
  source: 'network' | 'cache';
}

// Criterios de ordenación para preferencias MMKV
export type SortOrder =
  | 'alfabetico'
  | 'precio_asc'
  | 'precio_desc'
  | 'area';
