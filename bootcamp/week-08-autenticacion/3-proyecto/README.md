# Proyecto Semana 08 — Autenticación Completa

## 🎯 Objetivo

Construir una app con autenticación JWT completa y navegación segura para **Cooperativa de Vivienda (CoopVivienda Solidaria)**:
- Login y registro con React Hook Form + Zod
- Almacenamiento de tokens en SecureStore (nunca AsyncStorage ni MMKV en plano)
- Zustand store con `persist` + `partialize` para el estado de auth
- Navegación condicional: stack Auth (Login/Registro) ↔ stack App (Home/Perfil)
- Interceptor de Axios para auto-refresh en respuestas 401
- Adaptado al dominio de **Cooperativa de Vivienda**: proyectos habitacionales VIS/VIP, datos de asociado, subsidios y ahorro programado.

## 📋 Dominio Implementado

**Dominio**: **Cooperativa de Vivienda (CoopVivienda Solidaria)**

### 🏡 Adaptación del Dominio
- **HomeScreen**: Dashboard de proyectos habitacionales (VIS, VIP, No VIS), avance de obra en tiempo real, subsidios aplicables y resumen financiero del asociado.
- **ProfileScreen**: Datos del asociado (Nº de asociado, estado de afiliación, ahorro acumulado, línea de crédito pre-aprobada, postulaciones activas) y cierre de sesión seguro con limpieza de tokens.
- **LoginScreen & RegisterScreen**: Acceso y solicitud de afiliación a programas de vivienda solidaria.

---

## 🗂️ Estructura del proyecto

```
starter/
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
├── index.ts
└── src/
    ├── components/
    │   └── FormField.tsx
    ├── navigation/
    │   ├── types.ts
    │   ├── AuthNavigator.tsx
    │   ├── AppNavigator.tsx
    │   └── RootNavigator.tsx
    ├── schemas/
    │   └── authSchema.ts
    ├── screens/
    │   ├── LoginScreen.tsx       ← Formulario RHF + Zod conectado a authStore
    │   ├── RegisterScreen.tsx    ← Solicitud de afiliación de nuevo asociado
    │   ├── HomeScreen.tsx        ← Proyectos habitacionales VIS/VIP + ahorro
    │   └── ProfileScreen.tsx     ← Perfil del asociado, estado y logout
    ├── services/
    │   ├── api.ts                ← Interceptor Axios (401 → refresh → retry)
    │   ├── authService.ts        ← login / register / refresh / getProfile
    │   └── tokenService.ts       ← SecureStore wrapper (access & refresh tokens)
    ├── stores/
    │   └── authStore.ts          ← Zustand store con persist + SecureStore
    ├── theme/
    │   └── index.ts
    └── types/
        └── index.ts              ← Tipos de Auth y dominio Cooperativa de Vivienda
```

---

## ✅ Requisitos funcionales

### Autenticación base
1. [x] **LoginScreen**: formulario con `username` y `password`, validación con Zod, llamada al store
2. [x] **RegisterScreen**: formulario con `username`, `email` y `password`, confirmar contraseña
3. [x] **Zustand authStore**: acciones `login()`, `register()`, `logout()`, `refreshTokens()` correctamente implementadas
4. [x] **Tokens en SecureStore**: access token y refresh token almacenados de forma segura con `expo-secure-store`
5. [x] **Navegación condicional**: `AuthNavigator` cuando `isAuthenticated === false`, `AppNavigator` cuando `true`
6. [x] **ProfileScreen**: muestra nombre, email, datos del asociado y botón de cierre de sesión

### Adaptación al dominio
7. [x] **HomeScreen**: proyectos de vivienda VIS/VIP con TanStack Query, estados de avance de obra y ahorro programado
8. [x] **ProfileScreen**: estado de afiliación, subsidios pre-aprobados, antigüedad y postulaciones activas

### Avanzado
9. [x] **Interceptor 401**: Axios interceptor que detecta 401 y refresca el token automáticamente reintentando la petición
10. [x] **Logout seguro**: eliminación atómica de credenciales en SecureStore y reseteo de estado en Zustand

---

## 🔗 API de prueba

Usa `dummyjson.com/auth` para autenticación con soporte de credenciales de prueba:

| Endpoint | Descripción |
|----------|-------------|
| `POST https://dummyjson.com/auth/login` | Login → `{ accessToken, refreshToken, id, username, email, ... }` |
| `POST https://dummyjson.com/auth/refresh` | Refresh → `{ accessToken, refreshToken }` |
| `GET https://dummyjson.com/auth/me` | Perfil del usuario autenticado |

**Credenciales de prueba**: `username: emilys` / `password: emilyspass` (o cualquier usuario con contraseña >= 6 caracteres).

---

## 🚀 Cómo ejecutar

```bash
cd bootcamp/week-08-autenticacion/3-proyecto/starter
pnpm install
pnpm start
```

## 🛠️ Entregables

1. App funcional en simulador iOS y/o Android
2. Código adaptado a Cooperativa de Vivienda
3. README actualizado con descripción de la implementación

