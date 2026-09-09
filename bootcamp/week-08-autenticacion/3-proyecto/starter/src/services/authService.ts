// ============================================
// AUTH SERVICE — Llamadas a la API de autenticación (Cooperativa de Vivienda)
// ============================================
import axios from 'axios';
import type { AuthResponse, LoginCredentials, RegisterData } from '../types';
import { api } from './api';

const BASE_URL = 'https://dummyjson.com';

/**
 * Autentica al usuario con username y password.
 * Retorna tokens + datos del asociado de la cooperativa.
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const { data } = await axios.post<{
      id: number;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      image: string;
      accessToken: string;
      refreshToken: string;
    }>(`${BASE_URL}/auth/login`, {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 30,
    });

    return {
      ...data,
      numeroAsociado: `COOP-2026-${String(data.id).padStart(4, '0')}`,
      estadoAfiliacion: 'Activo',
      ahorroAcumulado: '$ 14.500.000 COP',
      antiguedadMeses: 36,
      lineaCreditoAprobada: 'Crédito Hipotecario VIS Solidario',
      postulacionesActivas: 2,
    };
  } catch (err) {
    // Si dummyjson falla con credenciales personalizadas, creamos sesión mockeada de cooperativa
    if (credentials.username && credentials.password.length >= 6) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        id: Math.floor(Math.random() * 900) + 100,
        username: credentials.username,
        email: `${credentials.username.toLowerCase()}@coopvivienda.com`,
        firstName: credentials.username.charAt(0).toUpperCase() + credentials.username.slice(1),
        lastName: 'Asociado',
        image: 'https://dummyjson.com/icon/emilys/128',
        accessToken: `ey.coop.${btoa(credentials.username)}.token`,
        refreshToken: `ey.coop.refresh.${btoa(credentials.username)}`,
        numeroAsociado: `COOP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        estadoAfiliacion: 'Activo',
        ahorroAcumulado: '$ 8.200.000 COP',
        antiguedadMeses: 18,
        lineaCreditoAprobada: 'Crédito Vivienda de Interés Prioritario (VIP)',
        postulacionesActivas: 1,
      };
    }
    throw err;
  }
}

/**
 * Registra un nuevo asociado en la Cooperativa de Vivienda.
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  // Simulamos registro en el servidor de la Cooperativa
  await new Promise((resolve) => setTimeout(resolve, 800));

  const generatedId = Math.floor(Math.random() * 9000) + 1000;
  const username = data.username.trim();
  const firstName = data.firstName ?? (username.charAt(0).toUpperCase() + username.slice(1));
  const lastName = data.lastName ?? 'Asociado';

  return {
    id: generatedId,
    username,
    email: data.email.trim().toLowerCase(),
    firstName,
    lastName,
    image: `https://dummyjson.com/icon/emilys/128`,
    accessToken: `ey.coop.${btoa(username)}.access.${Date.now()}`,
    refreshToken: `ey.coop.${btoa(username)}.refresh.${Date.now()}`,
    numeroAsociado: `COOP-2026-${generatedId}`,
    estadoAfiliacion: 'En Validación',
    ahorroAcumulado: '$ 1.200.000 COP',
    antiguedadMeses: 1,
    lineaCreditoAprobada: 'Ahorro Programado Inicial VIS',
    postulacionesActivas: 0,
  };
}

/**
 * Renueva el access token usando el refresh token.
 */
export async function refreshTokens(refreshToken: string): Promise<AuthResponse> {
  try {
    const { data } = await axios.post<{
      accessToken: string;
      refreshToken: string;
    }>(`${BASE_URL}/auth/refresh`, {
      refreshToken,
      expiresInMins: 30,
    });

    return {
      id: 1,
      username: 'emilys',
      email: 'emilys@coopvivienda.com',
      firstName: 'Emily',
      lastName: 'Johnson',
      image: 'https://dummyjson.com/icon/emilys/128',
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? refreshToken,
      numeroAsociado: 'COOP-2026-0001',
      estadoAfiliacion: 'Activo',
      ahorroAcumulado: '$ 14.500.000 COP',
      antiguedadMeses: 36,
      lineaCreditoAprobada: 'Crédito Hipotecario VIS Solidario',
      postulacionesActivas: 2,
    };
  } catch {
    return {
      id: 1,
      username: 'asociado',
      email: 'asociado@coopvivienda.com',
      firstName: 'Asociado',
      lastName: 'CoopVivienda',
      image: '',
      accessToken: `mock-refreshed-token-${Date.now()}`,
      refreshToken,
      numeroAsociado: 'COOP-2026-0001',
      estadoAfiliacion: 'Activo',
      ahorroAcumulado: '$ 14.500.000 COP',
      antiguedadMeses: 36,
      lineaCreditoAprobada: 'Crédito Hipotecario VIS Solidario',
      postulacionesActivas: 2,
    };
  }
}

/**
 * Obtiene el perfil del usuario asociado autenticado.
 */
export async function getProfile(): Promise<AuthResponse> {
  const { data } = await api.get<AuthResponse>(`${BASE_URL}/auth/me`);
  return {
    ...data,
    numeroAsociado: data.numeroAsociado ?? `COOP-2026-${String(data.id).padStart(4, '0')}`,
    estadoAfiliacion: data.estadoAfiliacion ?? 'Activo',
    ahorroAcumulado: data.ahorroAcumulado ?? '$ 14.500.000 COP',
    antiguedadMeses: data.antiguedadMeses ?? 36,
    lineaCreditoAprobada: data.lineaCreditoAprobada ?? 'Crédito Hipotecario VIS Solidario',
    postulacionesActivas: data.postulacionesActivas ?? 2,
  };
}

