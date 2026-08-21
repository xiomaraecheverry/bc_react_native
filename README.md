# App Cooperativa de Vivienda 🏘️

Proyecto móvil desarrollado en **React Native** y **Expo** para la **Semana 3** del Bootcamp.

## Dominio
**Cooperativa de Vivienda** - Portal Móvil para Asociados, Proyectos Habitacionales, Simulador Financiero y Gestión de Crédito.

## Autor
xiomaraecheverry

---

## 📌 Progreso por Semanas

### 🔹 Semana 1: Fundamentos y UI Básica
- Configuración inicial de entorno Expo y TypeScript.
- Creación de componentes reutilizables (`Header`, `ItemCard`).
- Renderizado de catálogo de proyectos habitacionales mediante `FlatList`.

### 🔹 Semana 2: Estado y Formularios
- Búsqueda y filtrado interactivo en tiempo real por nombre y ciudad.
- Sistema de favoritos e intereses.
- Formulario de alta para registrar nuevos proyectos en memoria.
- Pantalla de detalle técnico por vivienda (`DetailScreen`).

### 🚀 Semana 3: Navegación y Persistencia (Entrega Final)
- **Navegación Profesional con React Navigation v7**:
  - **Stack Navigator**: Transición fluida hacia la pantalla de detalle (`DetailScreen`) con paso de parámetros.
  - **Bottom Tab Navigator**: Menú inferior con 4 pestañas principales:
    - 🏠 **Inicio**: Exploración de catálogo, buscador y formulario de alta de proyectos.
    - ❤️ **Favoritos**: Gestión dedicada de viviendas marcadas como favoritas.
    - 🧮 **Simulador**: Calculadora interactiva de crédito habitacional cooperativo (plazo, tasa VIS/No VIS, cuota inicial, cuota mensual estimada y desglose de amortización).
    - 📋 **Solicitudes**: Perfil de asociado e historial de solicitudes registradas con estado ("En Estudio", "Pre-Aprobado", "Aprobado").
- **Persistencia de Datos Local (AsyncStorage)**:
  - Almacenamiento persistente de viviendas favoritas.
  - Guardado dinámico de nuevos proyectos creados por el asociado.
  - Registro e historial persistente de solicitudes de crédito enviadas.

---

## 🛠️ Tecnologías Utilizadas
- **React Native** (v0.86) & **Expo** (v57)
- **TypeScript** (v6.0)
- **React Navigation** (v7 - Stack & Bottom Tabs)
- **AsyncStorage** (`@react-native-async-storage/async-storage`)

---

## 🚀 Cómo Ejecutar el Proyecto

1. **Clonar e instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo Expo**:
   ```bash
   npx expo start
   ```

3. **Probar en dispositivo o emulador**:
   - Escanear el código QR con **Expo Go** (Android/iOS).
   - O presionar `w` para ejecutar en navegador web.
