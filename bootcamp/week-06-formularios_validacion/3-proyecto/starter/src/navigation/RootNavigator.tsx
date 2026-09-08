// src/navigation/RootNavigator.tsx
// Navegación principal: Home -> Create (modal) | Home -> Edit (push)

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS, RADIUS, SPACING } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { EditScreen } from '../screens/EditScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
        headerTitleStyle: { color: COLORS.text, fontWeight: '700' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'CoopVivienda',
          headerRight: () => <HeaderAddButton />,
        }}
      />
      <Stack.Screen
        name="Create"
        component={CreateScreen}
        options={{
          title: 'Nueva Vivienda / Proyecto',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="Edit"
        component={EditScreen}
        options={({ route }) => ({
          title: `Editar: ${route.params.name}`,
        })}
      />
    </Stack.Navigator>
  );
}

// Botón de acción rápida en el Header
function HeaderAddButton(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Pressable
      style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
      onPress={() => navigation.navigate('Create')}
      hitSlop={10}
    >
      <Text style={styles.addBtnText}>+ Nueva</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
