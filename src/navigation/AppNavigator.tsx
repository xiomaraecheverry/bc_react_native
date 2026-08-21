import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { RootStackParamList, MainTabParamList, Proyecto } from '../types';
import { HomeScreen } from '../screens/HomeScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { SimulatorScreen } from '../screens/SimulatorScreen';
import { RequestsScreen } from '../screens/RequestsScreen';
import { DetailScreen } from '../screens/DetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Pestañas principales de la App
function MainTabs({ navigation }: any) {
  const irADetalle = (proyecto: Proyecto) => {
    navigation.navigate('DetailScreen', { proyecto });
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0055aa',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#cbd5e1',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size - 4 }}>🏠</Text>,
        }}
      >
        {() => <HomeScreen onSelectProyecto={irADetalle} />}
      </Tab.Screen>

      <Tab.Screen
        name="Favoritos"
        options={{
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size - 4 }}>❤️</Text>,
        }}
      >
        {() => <FavoritesScreen onSelectProyecto={irADetalle} />}
      </Tab.Screen>

      <Tab.Screen
        name="Simulador"
        options={{
          tabBarLabel: 'Simulador',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size - 4 }}>🧮</Text>,
        }}
      >
        {() => <SimulatorScreen onIrADetalle={irADetalle} />}
      </Tab.Screen>

      <Tab.Screen
        name="Solicitudes"
        options={{
          tabBarLabel: 'Solicitudes',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size - 4 }}>📋</Text>,
        }}
      >
        {() => <RequestsScreen />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Navegador principal de la App con Stack
export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="DetailScreen">
          {({ route, navigation }: any) => (
            <DetailScreen
              proyecto={route.params.proyecto}
              onBack={() => navigation.goBack()}
              onSolicitudExitosa={() => {
                navigation.navigate('MainTabs', { screen: 'Solicitudes' });
              }}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
