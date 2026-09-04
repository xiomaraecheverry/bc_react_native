// src/navigation/RootNavigator.tsx
// Navegación principal con Tabs y Stack anidado, con Badge de Zustand en tiempo real

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { DetailScreen } from '../screens/DetailScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { useSavedStore } from '../stores/savedStore';
import { COLORS } from '../theme';
import type { HomeStackParamList, RootTabParamList } from './types';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator(): React.JSX.Element {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '700', color: '#ffffff' },
        headerShadowVisible: false,
      }}
    >
      <HomeStack.Screen
        name="HomeList"
        component={HomeScreen}
        options={{ title: 'Cooperativa de Vivienda' }}
      />
      <HomeStack.Screen
        name="HomeDetail"
        component={DetailScreen}
        options={({ route }) => ({
          title: route.params.name,
          headerBackTitle: 'Atrás',
        })}
      />
    </HomeStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator(): React.JSX.Element {
  // Selector reactivo de Zustand: conteo de proyectos guardados por el asociado
  const savedCount = useSavedStore((state) => state.items.length);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else {
            iconName = focused ? 'heart' : 'heart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Proyectos',
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarLabel: 'Mis Guardados',
          tabBarBadge: savedCount > 0 ? savedCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.error,
            color: '#ffffff',
            fontWeight: '700',
            fontSize: 11,
          },
        }}
      />
    </Tab.Navigator>
  );
}
