// src/navigation/types.ts
// Tipado estricto para las rutas de navegación del Stack

export type RootStackParamList = {
  Home: undefined;
  Create: undefined;
  Edit: { id: string | number; name: string };
};
