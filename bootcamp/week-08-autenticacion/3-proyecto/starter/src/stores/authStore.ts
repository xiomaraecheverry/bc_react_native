// ============================================
// AUTH STORE — Zustand con persist + SecureStore
// ============================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthUser, LoginCredentials, RegisterData } from '../types';
import { saveTokens, clearTokens, getAccessToken, getRefreshToken } from '../services/tokenService';
import * as authService from '../services/authService';

interface AuthState {
  // State
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  /** Autentica al usuario, guarda tokens en SecureStore y actualiza estado */
  login: (credentials: LoginCredentials) => Promise<void>;
  /** Registra un nuevo usuario */
  register: (data: RegisterData) => Promise<void>;
  /** Cierra sesión y limpia todos los tokens */
  logout: () => Promise<void>;
  /** Renueva el access token usando el refresh token almacenado */
  refreshTokens: () => Promise<void>;
  /** Limpia el error del estado */
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ─── Estado inicial ────────────────────────────────
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ─── login ─────────────────────────────────────────
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          await saveTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });

          const user: AuthUser = {
            id: response.id,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            image: response.image,
            numeroAsociado: response.numeroAsociado ?? `COOP-2026-${String(response.id).padStart(4, '0')}`,
            estadoAfiliacion: response.estadoAfiliacion ?? 'Activo',
            ahorroAcumulado: response.ahorroAcumulado ?? '$ 14.500.000 COP',
            antiguedadMeses: response.antiguedadMeses ?? 36,
            lineaCreditoAprobada: response.lineaCreditoAprobada ?? 'Crédito Hipotecario VIS Solidario',
            postulacionesActivas: response.postulacionesActivas ?? 2,
          };

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Error de autenticación';
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      // ─── register ──────────────────────────────────────
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(data);
          await saveTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });

          const user: AuthUser = {
            id: response.id,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            image: response.image,
            numeroAsociado: response.numeroAsociado ?? `COOP-2026-${String(response.id).padStart(4, '0')}`,
            estadoAfiliacion: response.estadoAfiliacion ?? 'En Validación',
            ahorroAcumulado: response.ahorroAcumulado ?? '$ 1.200.000 COP',
            antiguedadMeses: response.antiguedadMeses ?? 1,
            lineaCreditoAprobada: response.lineaCreditoAprobada ?? 'Ahorro Programado Inicial VIS',
            postulacionesActivas: response.postulacionesActivas ?? 0,
          };

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Error al registrar asociado';
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      // ─── logout ────────────────────────────────────────
      logout: async () => {
        try {
          await clearTokens();
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // ─── refreshTokens ─────────────────────────────────
      refreshTokens: async () => {
        try {
          const refreshToken = await getRefreshToken();
          if (!refreshToken) {
            await get().logout();
            return;
          }

          const response = await authService.refreshTokens(refreshToken);
          await saveTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
        } catch {
          await get().logout();
        }
      },

      // ─── clearError ────────────────────────────────────
      clearError: () => set({ error: null }),
    }),

    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // partialize: solo persiste user e isAuthenticated
      // Los tokens NO se persisten aquí — están en SecureStore
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
