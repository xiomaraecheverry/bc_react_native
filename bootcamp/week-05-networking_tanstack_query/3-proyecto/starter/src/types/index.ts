// src/types/index.ts
// Interfaces del dominio: Cooperativa de Vivienda

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
