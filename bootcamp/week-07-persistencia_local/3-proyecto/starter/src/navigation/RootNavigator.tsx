// src/navigation/RootNavigator.tsx
// Navegación principal: Home (con botones de Settings y Create) -> Create (modal) | Settings

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import type { RootStackParamList } from './types';
import { COLORS, RADIUS, SPACING } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: '700', color: COLORS.text },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'CoopVivienda',
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Create')}
              style={({ pressed }) => [
                styles.addBtn,
                pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
              ]}
              hitSlop={10}
            >
              <Text style={styles.addBtnText}>+ Nueva</Text>
            </Pressable>
          ),
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.navigate('Settings')}
              style={({ pressed }) => [
                styles.settingsBtn,
                pressed && { opacity: 0.7 },
              ]}
              hitSlop={10}
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="Create"
        component={CreateScreen}
        options={{ title: 'Nueva Vivienda / Proyecto', presentation: 'modal' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Preferencias & Seguridad' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  settingsBtn: {
    marginRight: SPACING.sm,
    padding: SPACING.xs,
  },
  settingsIcon: {
    fontSize: 20,
  },
});
