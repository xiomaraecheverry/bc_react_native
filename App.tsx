import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { DetailScreen } from './src/screens/DetailScreen';
import { Proyecto } from './src/types';

// Entrada principal de la app
export default function App() {
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Proyecto | null>(null);

  return (
    <SafeAreaView style={styles.contenedor}>
      <StatusBar style="light" />
      {proyectoSeleccionado ? (
        <DetailScreen
          proyecto={proyectoSeleccionado}
          onBack={() => setProyectoSeleccionado(null)}
        />
      ) : (
        <HomeScreen
          onSelectProyecto={(proyecto) => setProyectoSeleccionado(proyecto)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#0055aa',
  },
});

