// src/data/mockData.ts
// Catálogo de proyectos de vivienda de la Cooperativa de Vivienda (4 viviendas)

import type { Item } from '../types';

export const ITEMS: Item[] = [
  {
    id: '1',
    name: 'Conjunto Los Pinos',
    projectName: 'Conjunto Los Pinos - Modelo Cedro',
    ciudad: 'Bogotá',
    precio: '$120.000.000',
    precioNumerico: 120000000,
    ahorroMensual: '$650.000',
    ahorroMensualNumerico: 650000,
    descripcion:
      'Apartamento moderno en conjunto cerrado para asociados. Cuenta con 3 habitaciones, 2 baños, balcón, excelente iluminación y zonas verdes comunes.',
    imagen: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    tipoVivienda: 'Apartamento',
    habitaciones: 3,
    banos: 2,
    area: 68,
    subsidio: true,
  },
  {
    id: '2',
    name: 'Torres del Sol',
    projectName: 'Torres del Sol - Etapa 1',
    ciudad: 'Medellín',
    precio: '$250.000.000',
    precioNumerico: 250000000,
    ahorroMensual: '$1.200.000',
    ahorroMensualNumerico: 1200000,
    descripcion:
      'Torres residenciales con vista panorámica a la ciudad. Incluye ascensor, parqueadero privado cubierto, gimnasio comunitario y terraza BBQ para asociados.',
    imagen: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    tipoVivienda: 'Apartamento',
    habitaciones: 3,
    banos: 2,
    area: 84,
    subsidio: true,
  },
  {
    id: '3',
    name: 'Urbanización El Bosque',
    projectName: 'Urbanización El Bosque - Manzana C',
    ciudad: 'Cali',
    precio: '$140.000.000',
    precioNumerico: 140000000,
    ahorroMensual: '$750.000',
    ahorroMensualNumerico: 750000,
    descripcion:
      'Casa unifamiliar de 2 niveles con patio posterior, opción de ampliación en el segundo piso y parque infantil comunitario.',
    imagen: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    tipoVivienda: 'Casa',
    habitaciones: 3,
    banos: 2,
    area: 90,
    subsidio: true,
  },
  {
    id: '4',
    name: 'Villa Real',
    projectName: 'Villa Real Habitacional',
    ciudad: 'Bello',
    precio: '$115.000.000',
    precioNumerico: 115000000,
    ahorroMensual: '$590.000',
    ahorroMensualNumerico: 590000,
    descripcion:
      'Apartamento de interés social prioritario para asociados de la cooperativa. Cerca a transporte público, colegios y centros de salud.',
    imagen: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80',
    tipoVivienda: 'Vivienda VIS',
    habitaciones: 2,
    banos: 1,
    area: 52,
    subsidio: true,
  },
];
