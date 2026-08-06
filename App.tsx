import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';

// Entrada principal de la app
export default function App() {
  return (
    <SafeAreaView style={styles.contenedor}>
      <StatusBar style="light" />
      <HomeScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#0055aa',
  },
});
