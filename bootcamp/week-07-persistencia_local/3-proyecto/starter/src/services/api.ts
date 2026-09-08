// src/services/api.ts
// Servicio de datos y cliente API para la Cooperativa de Vivienda

import axios from 'axios';
import type { CreateItemPayload, Item, UpdateItemPayload } from '../types';

let mockDatabase: Item[] = [
  {
    id: '1',
    name: 'Conjunto Residencial Los Pinos',
    ciudad: 'Bogotá D.C.',
    precio: '$145.000.000',
    ahorroMensual: '$680.000',
    tipoVivienda: 'Apartamento',
    area: 65,
    habitaciones: 3,
    banos: 2,
    imagen:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    description:
      'Apartamento moderno en conjunto cerrado para asociados. Cuenta con 3 habitaciones, 2 baños, balcón con vista panorámica, parque infantil y salón social comunitario.',
    subsidio: true,
  },
  {
    id: '2',
    name: 'Torres del Valle',
    ciudad: 'Medellín',
    precio: '$230.000.000',
    ahorroMensual: '$1.100.000',
    tipoVivienda: 'Apartamento',
    area: 82,
    habitaciones: 3,
    banos: 2,
    imagen:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    description:
      'Proyecto de vivienda multifamiliar sostenible con paneles solares, ascensor, parqueadero privado cubierto y zonas verdes comunitarias.',
    subsidio: true,
  },
  {
    id: '3',
    name: 'Urbanización Casas Campestres El Roble',
    ciudad: 'Cali',
    precio: '$180.000.000',
    ahorroMensual: '$850.000',
    tipoVivienda: 'Casa',
    area: 95,
    habitaciones: 3,
    banos: 2,
    imagen:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    description:
      'Casa unifamiliar de 2 niveles con patio interior, opción de ampliación en segundo piso y parqueadero exclusivo.',
    subsidio: false,
  },
  {
    id: '4',
    name: 'Proyecto Solidario La Esperanza',
    ciudad: 'Bello',
    precio: '$118.000.000',
    ahorroMensual: '$550.000',
    tipoVivienda: 'Vivienda VIS',
    area: 54,
    habitaciones: 2,
    banos: 1,
    imagen:
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80',
    description:
      'Vivienda de Interés Social prioritaria para asociados con ingresos menores a 2 SMMLV. Aplica a subsidio concurrente.',
    subsidio: true,
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'https://jsonplaceholder.typicode.com',
  timeout: 10_000,
});

export async function fetchItems(): Promise<Item[]> {
  await delay(500);
  return [...mockDatabase];
}

export async function fetchItemById(id: string | number): Promise<Item> {
  await delay(350);
  const found = mockDatabase.find((item) => String(item.id) === String(id));
  if (!found) {
    throw new Error(`Proyecto con ID ${id} no encontrado`);
  }
  return { ...found };
}

export async function createItem(payload: CreateItemPayload): Promise<Item> {
  await delay(600);
  const newItem: Item = {
    ...payload,
    id: String(Date.now()),
    imagen:
      payload.imagen && payload.imagen.trim().length > 0
        ? payload.imagen
        : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
  };
  mockDatabase = [newItem, ...mockDatabase];
  return newItem;
}

export async function updateItem(
  id: string | number,
  payload: Partial<CreateItemPayload>
): Promise<Item> {
  await delay(500);
  const index = mockDatabase.findIndex((item) => String(item.id) === String(id));
  if (index === -1) {
    throw new Error(`Proyecto con ID ${id} no encontrado`);
  }
  const current = mockDatabase[index];
  const updated: Item = {
    ...current,
    ...payload,
    imagen:
      payload.imagen && payload.imagen.trim().length > 0
        ? payload.imagen
        : current.imagen,
  };
  mockDatabase[index] = updated;
  return updated;
}

export async function deleteItem(id: string | number): Promise<void> {
  await delay(400);
  mockDatabase = mockDatabase.filter((item) => String(item.id) !== String(id));
}
