// src/navigation/RootNavigator.tsx
// Stack Navigator con pantallas Home, Detail y Create (modal)

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from '../screens/HomeScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { COLORS } from '../theme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTitleStyle: { color: '#ffffff', fontWeight: '700' },
        headerTintColor: '#ffffff',
        contentStyle: { backgroundColor: COLORS.background },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Cooperativa de Vivienda',
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Create')}
              style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
              accessibilityLabel="Crear nuevo proyecto"
            >
              <Ionicons name="add-circle" size={26} color="#ffffff" />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={({ route }) => ({
          title: route.params.name,
          headerBackTitle: 'Atrás',
        })}
      />
      <Stack.Screen
        name="Create"
        component={CreateScreen}
        options={{
          title: 'Nuevo Proyecto de Vivienda',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerBtn: {
    padding: 4,
    marginRight: 2,
  },
});
