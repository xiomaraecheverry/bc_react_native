# Proyecto Semana 04 — Estado Global con Zustand

## 🎯 Objetivo

Construir una app con **navegación Tab + Stack** y **estado global Zustand** aplicado a tu dominio asignado. La segunda pestaña muestra las viviendas guardadas / postulaciones de interés cuyo estado proviene de un store Zustand compartido entre pantallas, con badge dinámico en tiempo real y tipado estricto en TypeScript.

---

## 📋 Dominio Implementado

**Dominio**: **Cooperativa de Vivienda ("CoopHabitat Solidaria")**

| Dominio | Pestaña Ítems (Catálogo) | Store Zustand | Pestaña Guardados |
|---|---|---|---|
| **Cooperativa de Vivienda** | Catálogo de proyectos y viviendas cooperativas | `useSavedStore` | Mi Interés y Postulaciones |

---

## 🗂️ Estructura del Proyecto

```
starter/
├── App.tsx                         ← NavigationContainer y SafeAreaProvider raíz
├── app.json                        ← Configuración de Expo
├── package.json                    ← Dependencias exactas (Expo SDK 57, Zustand v5, React Navigation 7)
├── tsconfig.json                   ← Configuración TypeScript
└── src/
    ├── navigation/
    │   ├── RootNavigator.tsx       ← Tab Navigator + Stack anidado con Badge reactivo
    │   └── types.ts                ← RootTabParamList, HomeStackParamList
    ├── screens/
    │   ├── HomeScreen.tsx          ← Catálogo de viviendas con botón rápido de interés
    │   ├── DetailScreen.tsx        ← Ficha técnica + botón interactivo conectado a Zustand
    │   └── SavedScreen.tsx         ← Pestaña de guardados con resumen y vaciado de lista
    ├── stores/
    │   └── savedStore.ts           ← Store Zustand (addItem, removeItem, clearAll, isItemSaved)
    ├── data/
    │   └── mockData.ts             ← Catálogo con 8 inmuebles (Apartamentos, Casas, VIS, Dúplex, Lotes)
    ├── types/
    │   └── index.ts                ← Interfaces Item, PropertyType, HousingStatus
    └── theme/
        └── index.ts                ← Tokens de diseño (paleta cooperativa esmeralda y azul)
```

---

## ✅ Requisitos Funcionales Cumplidos

1. **Tab Navigator**: Dos pestañas (`Catálogo` y `Mi Interés`).
2. **Stack anidado en Home**: Flujo completo de navegación desde `HomeList` hasta `HomeDetail` pasando parámetros fuertemente tipados (`id`, `name`).
3. **Store Zustand tipado (`useSavedStore`)**:
   - `addItem`: Agrega un inmueble validando que no existan duplicados.
   - `removeItem`: Elimina una vivienda por ID.
   - `clearAll`: Limpia toda la lista de seguimiento.
   - `isItemSaved`: Determina en tiempo O(n) si el inmueble ya fue guardado.
4. **Badge en Tab Bar**: Contador dinámico en el Tab Bar que se actualiza instantáneamente en tiempo real sin prop drilling.
5. **Detalle interactivo**: Botón de acción que lee y escribe directamente en el store de Zustand.
6. **TypeScript estricto**: Sin uso de `any`, tipos genéricos e interfaces bien definidas.

---

## 🚀 Cómo ejecutar

```bash
cd bootcamp/week-04-estado_global_zustand/3-proyecto/starter
pnpm install
pnpm start
```

Seleccionar simulador iOS (`i`), Android (`a`) o web (`w`) en el menú interactivo de Expo.

---

## 🛠️ Entregables y Verificación

- [x] App funcional con arquitectura Tab + Stack anidado
- [x] Sincronización de estado global con Zustand sin prop drilling
- [x] Badge numérico en Tab Bar sincronizado en tiempo real
- [x] Código 100% adaptado al dominio **Cooperativa de Vivienda**
- [x] TypeScript estricto sin errores de compilación
