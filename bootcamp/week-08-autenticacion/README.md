# Semana 08 — Autenticación Completa

> **Fase 2 — Core RN** | Semana 8 de 18 | ⏱️ 8 horas | Dominio: **Cooperativa de Vivienda (CoopVivienda Solidaria)**

## 🎯 Objetivos de aprendizaje

Al finalizar esta semana, el estudiante será capaz de:

- [x] Explicar la estructura de un JWT y el ciclo de vida de access/refresh tokens
- [x] Implementar un flujo de login con Axios y almacenar tokens en SecureStore
- [x] Construir un Zustand auth store con acciones `login`, `logout` y `refreshTokens`
- [x] Configurar un interceptor de Axios que renueve tokens expirados automáticamente
- [x] Implementar navegación condicional entre stack de auth y stack protegido
- [x] Integrar OAuth PKCE con Expo AuthSession en un flujo web browser

## 📚 Requisitos previos

- Semana 05 — Networking y TanStack Query (Axios, interceptores)
- Semana 06 — Formularios con React Hook Form + Zod
- Semana 07 — Persistencia local con SecureStore y MMKV
- Build nativo disponible para ejercicio-02 y el proyecto (`pnpm expo run:ios / run:android`)

## 🗂️ Estructura de la semana

```
week-08-autenticacion/
├── 0-assets/                         # Diagramas SVG de los flujos de auth
├── 1-teoria/
│   ├── 01-jwt-y-tokens.md            # JWT, access/refresh lifecycle, Zustand auth store
│   └── 02-oauth-expo-authsession.md  # PKCE, Expo AuthSession, makeRedirectUri
├── 2-practicas/
│   ├── ejercicio-01-jwt-auth/        # ✅ Compatible con Expo Go
│   └── ejercicio-02-oauth-authsession/ # 🔧 Requiere build nativo
├── 3-proyecto/                       # Proyecto integrador con auth completa (Cooperativa de Vivienda)
├── 4-recursos/
│   ├── ebooks-free/
│   ├── videografia/
│   └── webgrafia/
└── 5-glosario/
```

## 📝 Contenidos

### Teoría

| Archivo | Contenido | Tiempo |
|---------|-----------|--------|
| [01-jwt-y-tokens.md](1-teoria/01-jwt-y-tokens.md) | JWT estructura, access/refresh tokens, SecureStore, Zustand auth store | 1h |
| [02-oauth-expo-authsession.md](1-teoria/02-oauth-expo-authsession.md) | PKCE flow, Expo AuthSession, configurar Google/GitHub OAuth | 1h |

### Prácticas

| Ejercicio | Descripción | Entorno |
|-----------|-------------|---------|
| [ejercicio-01-jwt-auth](2-practicas/ejercicio-01-jwt-auth/) | Login con dummyjson.com → JWT → SecureStore → llamada protegida → logout | ✅ Expo Go |
| [ejercicio-02-oauth-authsession](2-practicas/ejercicio-02-oauth-authsession/) | OAuth PKCE con Expo AuthSession (GitHub/Google) | 🔧 Build nativo |

### Proyecto

El proyecto integra todos los conceptos de la fase Core RN aplicados al dominio **Cooperativa de Vivienda**:

- Auth stack: `LoginScreen` + `RegisterScreen` (RHF + Zod)
- App stack protegido: `HomeScreen` (proyectos habitacionales VIS/VIP) + `ProfileScreen` (datos de asociado, subsidios y ahorro)
- `useAuthStore` — Zustand con `persist` + `SecureStore` para tokens
- Interceptor Axios para refresh automático de tokens expirados (401 Retry)

Ver instrucciones completas: [3-proyecto/README.md](3-proyecto/README.md)

## ⏱️ Distribución del tiempo (8 horas)

| Actividad | Tiempo | Descripción |
|-----------|--------|-------------|
| Teoría — JWT y tokens | 1h | Lectura de 01-jwt-y-tokens.md + ejemplos |
| Teoría — OAuth PKCE | 1h | Lectura de 02-oauth-expo-authsession.md |
| Ejercicio-01 JWT | 1.5h | Login → tokens → llamada protegida |
| Ejercicio-02 OAuth | 1.5h | Expo AuthSession con GitHub (build nativo) |
| Proyecto integrador | 3h | Auth completa en Cooperativa de Vivienda |

## 📌 Entregables

- [x] Ejercicio-01: login funcional con JWT + llamada autenticada a `/auth/me`
- [x] Ejercicio-02: OAuth PKCE configurado y redirigiendo correctamente
- [x] Proyecto adaptado al dominio asignado (**Cooperativa de Vivienda**) con auth completa
- [x] `useAuthStore` con `login`, `logout`, `refreshTokens` implementados
- [x] App lista para ejecución en simulador iOS y/o Android
- [x] Tokens almacenados de forma segura en SecureStore (no en AsyncStorage ni MMKV)

## 🔗 Navegación

[← Semana 07 — Persistencia Local](../week-07-persistencia_local/README.md) | [Semana 09 — Animaciones Básicas →](../week-09-animaciones_basicas/README.md)

