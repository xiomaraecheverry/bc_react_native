// ============================================
// TIPOS GLOBALES — week-08 Autenticación (Cooperativa de Vivienda)
// ============================================

/** Tokens recibidos del server al autenticarse */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** Estado de afiliación del asociado */
export type EstadoAfiliacion = 'Activo' | 'Beneficiario VIS' | 'Consejero' | 'En Validación';

/** Datos del usuario autenticado (Asociado de la Cooperativa) */
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
  // Campos del dominio Cooperativa de Vivienda
  numeroAsociado: string;
  estadoAfiliacion: EstadoAfiliacion;
  ahorroAcumulado: string;
  antiguedadMeses: number;
  lineaCreditoAprobada: string;
  postulacionesActivas: number;
}

/** Payload decodificado del JWT */
export interface JwtPayload {
  sub: number;
  username: string;
  iat: number;
  exp: number;
  numeroAsociado?: string;
  rol?: string;
}

/** Credentials para login */
export interface LoginCredentials {
  username: string;
  password: string;
}

/** Datos para registro */
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  numeroDocumento?: string;
  tipoViviendaInteres?: string;
}

/** Respuesta del endpoint /auth/login y /auth/refresh */
export interface AuthResponse extends AuthTokens {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  numeroAsociado?: string;
  estadoAfiliacion?: EstadoAfiliacion;
  ahorroAcumulado?: string;
  antiguedadMeses?: number;
  lineaCreditoAprobada?: string;
  postulacionesActivas?: number;
}

/** Modelo de Proyecto Habitacional de la Cooperativa */
export interface HousingProject {
  id: number;
  nombreProyecto: string;
  ubicacion: string;
  tipoVivienda: 'VIS' | 'VIP' | 'No VIS';
  precioDesde: string;
  unidadesDisponibles: number;
  subsidioAplica: boolean;
  avanceObra: number;
  descripcion: string;
}

