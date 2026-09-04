// src/types/index.ts
// Tipos e interfaces del dominio: Cooperativa de Vivienda

export interface Item {
  id: string;
  name: string;
  projectName: string;
  ciudad: string;
  precio: string;
  precioNumerico: number;
  ahorroMensual: string;
  ahorroMensualNumerico: number;
  descripcion: string;
  imagen: string;
  tipoVivienda: 'Apartamento' | 'Casa' | 'Dúplex' | 'Lote' | 'Vivienda VIS';
  habitaciones: number;
  banos: number;
  area: number;
  subsidio: boolean;
}
