# Proyecto Semana 06 — Formularios con React Hook Form + Zod

## 🎯 Objetivo

Implementar formularios Create y Edit con validación Zod aplicados a tu **dominio asignado**.

## 📋 Tu Dominio Asignado

**Dominio**: **Cooperativa de Vivienda (CoopVivienda)**

> 📌 Implementación de la gestión y registro de viviendas/proyectos habitacionales para asociados de la cooperativa.

## 💡 Adaptación al Dominio

| Entidad | Campos del Formulario | Validaciones Zod |
|---|---|---|
| **Vivienda / Proyecto Habitacional** | - Nombre del proyecto<br>- Ciudad / Municipio<br>- Tipo de Vivienda (`Apartamento`, `Casa`, `Dúplex`, `Vivienda VIS`)<br>- Valor comercial estimado<br>- Cuota de ahorro mensual sugerida<br>- Área en m²<br>- Habitaciones<br>- Baños<br>- Subsidio Cooperativo<br>- URL de imagen<br>- Descripción | - `name`: Mínimo 3, máx 80 caracteres<br>- `ciudad`: Mínimo 2 caracteres<br>- `tipoVivienda`: Enum válido<br>- `precio` y `ahorroMensual`: Requeridos<br>- `area`: Número positivo (20 m² - 500 m²)<br>- `habitaciones` y `banos`: Enteros (1 a 10)<br>- `description`: Mínimo 10, máx 500 caracteres<br>- `subsidio`: Booleano |

## 🗂️ Estructura del Proyecto

```
starter/
├── App.tsx                          — QueryClientProvider + NavigationContainer + SafeAreaProvider
├── app.json
├── index.ts                         — registerRootComponent(App)
├── package.json
├── tsconfig.json
└── src/
    ├── navigation/
    │   ├── types.ts                 — RootStackParamList (Home, Create, Edit)
    │   └── RootNavigator.tsx        — Stack Navigator con header personalizado
    ├── schemas/
    │   └── itemSchema.ts            — Schema Zod con inferencia de tipo ItemFormData
    ├── components/
    │   └── FormField.tsx            — Componente genérico con Controller + TextInput + inline error
    ├── screens/
    │   ├── HomeScreen.tsx           — Catálogo de viviendas con pull-to-refresh y acciones
    │   ├── CreateScreen.tsx         — Formulario de creación con useForm + zodResolver + useCreateItem
    │   └── EditScreen.tsx           — Formulario de edición con defaultValues (useEffect + reset) + useUpdateItem
    ├── hooks/
    │   └── useItems.ts              — useItems, useItemById, useCreateItem, useUpdateItem, useDeleteItem
    ├── services/
    │   └── api.ts                   — Cliente Axios y servicio CRUD con simulación de latencia
    ├── types/
    │   └── index.ts                 — Item, TipoVivienda, CreateItemPayload, UpdateItemPayload
    └── theme/
        └── index.ts                 — Paleta de colores esmeralda/zafiro, tipografía y radios
```

## ✅ Requisitos Implementados

1. **`FormField` genérico**: Componente reutilizable con `Controller`, tipos genéricos `Control<T>`, `FieldPath<T>`, estilos de focus/error, etiquetas requeridas y mensajes de error inline.
2. **`CreateScreen`**: Formulario completo de 10 campos técnicos y financieros, validación Zod en tiempo real, `useCreateItem` de TanStack Query y retorno a Home con alerta de confirmación.
3. **`EditScreen`**: Carga de la vivienda existente con `useItemById`, sincronización de datos con `reset()` en `useEffect`, detección de estado sucio (`isDirty`), `useUpdateItem` y feedback visual.
4. **`HomeScreen`**: Visualización de tarjetas detalladas con foto, ciudad, chips de características (área, habs, baños), badge de subsidio, ahorro mensual, botón para editar y acción para eliminar con confirmación.

## 🚀 Cómo ejecutar

```bash
cd starter
pnpm install
pnpm start
```

## 🛠️ Entregables

1. App funcional en Expo Go / simulador iOS y Android
2. Código adaptado al dominio **Cooperativa de Vivienda**
3. Componente `FormField` reutilizado transversalmente
4. Prácticas 01 y 02 completamente resueltas
