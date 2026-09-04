# Proyecto Semana 05 — Networking y TanStack Query v5

## 🎯 Objetivo

Construir una app que consume servicios de red REST usando **Axios y TanStack Query v5**. La app muestra el catálogo de proyectos de vivienda de la cooperativa, navega a la ficha técnica de cada proyecto, permite registrar nuevos proyectos mediante formularios modales con mutaciones (`useMutation`), manejar invalidación automática de caché (`queryClient.invalidateQueries`), pull-to-refresh y estados de red declarativos (loading, error, empty).

---

## 📋 Dominio Implementado

**Dominio**: **Cooperativa de Vivienda ("CoopHabitat Solidaria")**

| Dominio | Entidad Principal | Operaciones de Red |
|---|---|---|
| **Cooperativa de Vivienda** | Proyecto de Vivienda (`Item`) | Listar proyectos (`useItems`), Detalle por ID (`useItemById`), Registrar proyecto (`useCreateItem`), Retirar proyecto (`useDeleteItem`) |

---

## 🗂️ Estructura del Proyecto

```
starter/
├── App.tsx                         ← QueryClientProvider + NavigationContainer raíz
├── app.json                        ← Configuración de Expo
├── index.ts                        ← registerRootComponent(App)
├── package.json                    ← Dependencias (TanStack Query v5, Axios, React Navigation 7, Web)
├── tsconfig.json                   ← Configuración TypeScript estricta
└── src/
    ├── services/
    │   └── api.ts                  ← Instancia Axios con interceptores y servicio housingService
    ├── hooks/
    │   └── useItems.ts             ← Custom hooks: useItems, useItemById, useCreateItem, useDeleteItem
    ├── navigation/
    │   ├── RootNavigator.tsx       ← Stack Navigator (Home → Detail → Create modal)
    │   └── types.ts                ← RootStackParamList (Home, Detail, Create)
    ├── screens/
    │   ├── HomeScreen.tsx          ← Listado con useQuery, Pull-to-Refresh, loading/error states
    │   ├── DetailScreen.tsx        ← Ficha técnica con useItemById y botón de retiro con useDeleteItem
    │   └── CreateScreen.tsx        ← Formulario modal con useMutation e invalidación de caché
    ├── types/
    │   └── index.ts                ← Interfaces Item, TipoVivienda, CreateItemPayload
    └── theme/
        └── index.ts                ← Tokens visuales institucionales (azul #0055aa, verde precio #15803d)
```

---

## ✅ Requisitos Cumplidos

1. **Fetching con `useQuery`**:
   - Consumo de lista en `HomeScreen` con gestión declarativa de `isLoading`, `isError`, `isFetching` y `data`.
   - Consulta individual por ID en `DetailScreen` con `useItemById`.
2. **Mutaciones con `useMutation`**:
   - `useCreateItem`: Envío de POST con datos de nueva vivienda y cierre de modal.
   - `useDeleteItem`: Retiro de proyectos con `DELETE`.
   - Invalidación automática del caché en `onSuccess` vía `queryClient.invalidateQueries({ queryKey: ['proyectos'] })`.
3. **Pull-to-Refresh**:
   - `FlatList` con `onRefresh={refetch}` y `refreshing={isFetching && !isLoading}`.
4. **Estados de UI completos**:
   - Loading: `ActivityIndicator` estilizado.
   - Error: Mensaje y botón *"Reintentar"* con `refetch()`.
   - Empty: Mensaje cuando la lista no contiene registros.
5. **TypeScript estricto**: Sin `any`, tipos fuertemente tipados en navegación, hooks y payloads.

---

## 🚀 Cómo ejecutar

```bash
cd bootcamp/week-05-networking_tanstack_query/3-proyecto/starter
pnpm start
```
