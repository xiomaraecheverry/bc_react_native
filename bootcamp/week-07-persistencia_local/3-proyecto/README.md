# Proyecto Semana 07 — Persistencia Local (CoopVivienda)

## 🎯 Objetivo

Implementar una **capa de persistencia completa de tres niveles** para el catálogo de viviendas de la **Cooperativa de Vivienda**:

1. **MMKV** — Preferencias del usuario reactivas y sincrónicas (orden de lista, vista compacta, filtro de subsidio, proyectos por página).
2. **AsyncStorage** — Caché offline de la lista de viviendas y proyectos (permite navegar el catálogo sin conexión a internet).
3. **Expo SecureStore** — Almacenamiento seguro y cifrado en Keychain/Keystore para el token digital del asesor de créditos.

## 📋 Dominio Asignado

**Dominio**: **Cooperativa de Vivienda (CoopVivienda)**

## 💡 Estrategia de Almacenamiento

| Nivel | Herramienta | Caso de Uso en Cooperativa | Comportamiento |
|---|---|---|---|
| **1. Preferencias UI** | **MMKV** | - Ordenación (`precio_asc`, `precio_desc`, `area`, `alfabetico`)<br>- Modo compacto de tarjetas<br>- Filtro de proyectos con subsidio<br>- Cantidad de proyectos por página | Sincrónico, sin `await`, reactivo mediante hooks |
| **2. Caché Offline** | **AsyncStorage** | - Catálogo completo de viviendas guardado localmente | Asíncrono, fallback automático con banner visual |
| **3. Datos Sensibles** | **Expo SecureStore** | - Token de Firma Digital del Asesor (`coop_advisor_security_token`) | Cifrado por hardware en Keychain / Keystore |

## 🗂️ Estructura del Proyecto

```
starter/
├── App.tsx                      # Entry point — QueryClient + Navigation + StatusBar
├── app.json                     # Config Expo
├── index.ts                     # registerRootComponent(App)
├── package.json                 # Dependencias (MMKV, AsyncStorage, SecureStore, etc.)
├── tsconfig.json
└── src/
    ├── storage/
    │   └── mmkv.ts              # Instancia global de MMKV
    ├── types/
    │   └── index.ts             # Item, ItemsWithSource, SortOrder, etc.
    ├── theme/
    │   └── index.ts             # Tokens de diseño esmeralda/zafiro
    ├── services/
    │   └── api.ts               # Cliente Axios y mock API de proyectos
    ├── schemas/
    │   └── itemSchema.ts        # Schema Zod para validación de viviendas
    ├── components/
    │   └── FormField.tsx        # Componente reutilizable con Controller
    ├── hooks/
    │   ├── useItems.ts          # TanStack Query + caché offline AsyncStorage
    │   └── usePreferences.ts   # Hooks reactivos de MMKV
    ├── navigation/
    │   ├── types.ts             # RootStackParamList (Home, Create, Settings)
    │   └── RootNavigator.tsx   # Stack Navigator con accesos rápidos
    └── screens/
        ├── HomeScreen.tsx       # Catálogo con banner offline y filtros MMKV
        ├── CreateScreen.tsx     # Registro de nueva vivienda con Zod + RHF
        └── SettingsScreen.tsx   # Preferencias MMKV + Gestión de Token SecureStore
```

## 🚀 Cómo ejecutar

```bash
cd starter
pnpm install
pnpm start
```

## 🛠️ Entregables

1. App funcional en Expo / simulador iOS y Android
2. `usePreferences.ts` con 4 preferencias reactivas gestionadas en MMKV
3. `useItems.ts` con caché offline en AsyncStorage y fallback ante fallos de red
4. `SettingsScreen.tsx` con controles reactivos y cifrado SecureStore
5. Prácticas 01 y 02 completamente resueltas
