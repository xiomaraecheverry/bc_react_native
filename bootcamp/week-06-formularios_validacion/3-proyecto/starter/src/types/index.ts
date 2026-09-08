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

// Payload para crear un ítem nuevo (sin id — lo asigna el servicio)
export type CreateItemPayload = Omit<Item, 'id'>;

// Payload para actualizar (id requerido + campos modificados)
export type UpdateItemPayload = Partial<CreateItemPayload> & {
  id: string | number;
};
