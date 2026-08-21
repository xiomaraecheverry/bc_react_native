import AsyncStorage from '@react-native-async-storage/async-storage';
import { Proyecto, SolicitudCredito } from '../types';
import { listaProyectos } from '../data/mockData';

const KEYS = {
  PROYECTOS: '@cooperativa_proyectos_v1',
  FAVORITOS: '@cooperativa_favoritos_v1',
  SOLICITUDES: '@cooperativa_solicitudes_v1',
};

// --- SERVICIO DE PROYECTOS ---
export const getProyectosPersistidos = async (): Promise<Proyecto[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.PROYECTOS);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    // Si no existen proyectos persistidos, retornamos los iniciales y los guardamos
    await AsyncStorage.setItem(KEYS.PROYECTOS, JSON.stringify(listaProyectos));
    return listaProyectos;
  } catch (e) {
    console.error('Error cargando proyectos:', e);
    return listaProyectos;
  }
};

export const guardarProyectoNuevo = async (nuevoProyecto: Proyecto): Promise<Proyecto[]> => {
  try {
    const actuales = await getProyectosPersistidos();
    const actualizados = [nuevoProyecto, ...actuales];
    await AsyncStorage.setItem(KEYS.PROYECTOS, JSON.stringify(actualizados));
    return actualizados;
  } catch (e) {
    console.error('Error guardando nuevo proyecto:', e);
    throw e;
  }
};

// --- SERVICIO DE FAVORITOS ---
export const getFavoritosPersistidos = async (): Promise<string[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.FAVORITOS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error cargando favoritos:', e);
    return [];
  }
};

export const guardarFavoritosPersistidos = async (favoritosIds: string[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.FAVORITOS, JSON.stringify(favoritosIds));
  } catch (e) {
    console.error('Error guardando favoritos:', e);
  }
};

// --- SERVICIO DE SOLICITUDES DE CRÉDITO ---
export const getSolicitudesPersistidas = async (): Promise<SolicitudCredito[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.SOLICITUDES);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error cargando solicitudes:', e);
    return [];
  }
};

export const agregarSolicitudCredito = async (solicitud: Omit<SolicitudCredito, 'id' | 'fecha' | 'estado'>): Promise<SolicitudCredito> => {
  try {
    const actuales = await getSolicitudesPersistidas();
    const nuevaSolicitud: SolicitudCredito = {
      ...solicitud,
      id: Date.now().toString(),
      fecha: new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      estado: 'En Estudio',
    };
    const actualizadas = [nuevaSolicitud, ...actuales];
    await AsyncStorage.setItem(KEYS.SOLICITUDES, JSON.stringify(actualizadas));
    return nuevaSolicitud;
  } catch (e) {
    console.error('Error agregando solicitud:', e);
    throw e;
  }
};
