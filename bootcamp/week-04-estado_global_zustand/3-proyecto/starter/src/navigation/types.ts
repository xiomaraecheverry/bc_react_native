// src/navigation/types.ts
// Tipos de parámetros de navegación para el proyecto Cooperativa de Vivienda

import type { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  HomeList: undefined;
  HomeDetail: {
    id: string;
    name: string;
  };
};

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Saved: undefined;
};
