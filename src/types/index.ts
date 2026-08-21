// Datos de cada proyecto de vivienda de la cooperativa
export interface Proyecto {
  id: string;
  nombre: string;
  ciudad: string;
  precio: string;
  imagen: string;
  descripcion: string;
  area: string;
  habitaciones: number;
  banos: number;
  cuotaInicial: string;
}

// Estructura de solicitudes de crédito o información registrada por el asociado
export interface SolicitudCredito {
  id: string;
  proyectoId: string;
  nombreProyecto: string;
  nombreAsociado: string;
  telefono: string;
  montoSolicitado: string;
  fecha: string;
  estado: 'En Estudio' | 'Documentación Recibida' | 'Pre-Aprobado' | 'Aprobado';
}

// Estructura para el resultado de simulación de crédito
export interface SimulacionCredito {
  valorVivienda: number;
  cuotaInicialMinima: number;
  montoFinanciar: number;
  plazoAnos: number;
  tasaMensual: number;
  cuotaMensualEstimada: number;
  tipoVivienda: 'VIS' | 'No VIS';
}

// Tipos para React Navigation (Stack y Tabs)
export type RootStackParamList = {
  MainTabs: undefined;
  DetailScreen: { proyecto: Proyecto };
};

export type MainTabParamList = {
  Inicio: undefined;
  Favoritos: undefined;
  Simulador: { proyectoPreseleccionado?: Proyecto };
  Solicitudes: undefined;
};
