import { Proyecto } from '../types';

// Lista de proyectos de vivienda de la cooperativa
export const listaProyectos: Proyecto[] = [
  {
    id: '1',
    nombre: 'Conjunto Los Pinos',
    ciudad: 'Bogotá',
    precio: '$120.000.000',
    imagen: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=500&q=80',
    descripcion: 'Hermosos apartamentos de Interés Social (VIS) con zonas verdes, parqueadero comunal y parque infantil.',
    area: '55 m²',
    habitaciones: 3,
    banos: 2,
    cuotaInicial: '$12.000.000',
  },
  {
    id: '2',
    nombre: 'Torres del Sol',
    ciudad: 'Medellín',
    precio: '$250.000.000',
    imagen: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80',
    descripcion: 'Exclusivo proyecto con vista a la ciudad, piscina climatizada, gimnasio y vigilancia 24/7.',
    area: '85 m²',
    habitaciones: 3,
    banos: 2,
    cuotaInicial: '$25.000.000',
  },
  {
    id: '3',
    nombre: 'Urbanización El Bosque',
    ciudad: 'Cali',
    precio: '$140.000.000',
    imagen: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=500&q=80',
    descripcion: 'Casas en conjunto cerrado con amplia iluminación natural, zona social y excelente ubicación.',
    area: '70 m²',
    habitaciones: 2,
    banos: 2,
    cuotaInicial: '$14.000.000',
  },
  {
    id: '4',
    nombre: 'Villa Real',
    ciudad: 'Bello',
    precio: '$115.000.000',
    imagen: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=500&q=80',
    descripcion: 'Proyecto residencial económico con facilidades de subsidio de vivienda y subsidio de la cooperativa.',
    area: '50 m²',
    habitaciones: 2,
    banos: 1,
    cuotaInicial: '$11.500.000',
  },
];

