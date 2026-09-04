// src/services/api.ts
// Instancia Axios centralizada y servicio de API para Cooperativa de Vivienda

import axios from 'axios';
import type { CreateItemPayload, Item } from '../types';

// Datos iniciales de proyectos de vivienda de la cooperativa
let mockDatabase: Item[] = [
  {
    id: '1',
    name: 'Conjunto Los Pinos',
    ciudad: 'Bogotá',
    precio: '$120.000.000',
    ahorroMensual: '$650.000',
    tipoVivienda: 'Apartamento',
    area: 68,
    habitaciones: 3,
    banos: 2,
    imagen: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    description:
      'Apartamento moderno en conjunto cerrado para asociados. Cuenta con 3 habitaciones, 2 baños, balcón, excelente iluminación y zonas verdes comunes.',
    subsidio: true,
  },
  {
    id: '2',
    name: 'Torres del Sol',
    ciudad: 'Medellín',
    precio: '$250.000.000',
    ahorroMensual: '$1.200.000',
    tipoVivienda: 'Apartamento',
    area: 84,
    habitaciones: 3,
    banos: 2,
    imagen: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    description:
      'Torres residenciales con vista panorámica a la ciudad. Incluye ascensor, parqueadero privado cubierto, gimnasio comunitario y terraza BBQ para asociados.',
    subsidio: true,
  },
  {
    id: '3',
    name: 'Urbanización El Bosque',
    ciudad: 'Cali',
    precio: '$140.000.000',
    ahorroMensual: '$750.000',
    tipoVivienda: 'Casa',
    area: 90,
    habitaciones: 3,
    banos: 2,
    imagen: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    description:
      'Casa unifamiliar de 2 niveles con patio posterior, opción de ampliación en el segundo piso y parque infantil comunitario.',
    subsidio: true,
  },
  {
    id: '4',
    name: 'Villa Real',
    ciudad: 'Bello',
    precio: '$115.000.000',
    ahorroMensual: '$590.000',
    tipoVivienda: 'Vivienda VIS',
    area: 52,
    habitaciones: 2,
    banos: 1,
    imagen: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80',
    description:
      'Apartamento de interés social prioritario para asociados de la cooperativa. Cerca a transporte público, colegios y centros de salud.',
    subsidio: true,
  },
];

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://jsonplaceholder.typicode.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor para logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (__DEV__) {
      console.warn('[API Interceptor Error]', error.response?.status, error.config?.url);
    }
    return Promise.reject(error);
  }
);

// Simulación de latencia de red para TanStack Query (loading/refreshing/caching)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Servicios de API del Dominio Cooperativa de Vivienda
export const housingService = {
  // GET /proyectos
  getProyectos: async (): Promise<Item[]> => {
    await delay(600);
    return [...mockDatabase];
  },

  // GET /proyectos/:id
  getProyectoById: async (id: string | number): Promise<Item> => {
    await delay(400);
    const found = mockDatabase.find((item) => String(item.id) === String(id));
    if (!found) {
      throw new Error(`Proyecto con ID ${id} no encontrado`);
    }
    return { ...found };
  },

  // POST /proyectos
  createProyecto: async (payload: CreateItemPayload): Promise<Item> => {
    await delay(700);
    const newProject: Item = {
      ...payload,
      id: String(Date.now()),
      imagen:
        payload.imagen ||
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
    };
    mockDatabase = [newProject, ...mockDatabase];
    return newProject;
  },

  // DELETE /proyectos/:id
  deleteProyecto: async (id: string | number): Promise<void> => {
    await delay(500);
    mockDatabase = mockDatabase.filter((item) => String(item.id) !== String(id));
  },
};
