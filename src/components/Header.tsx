import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Titulo de la cooperativa
export const Header = () => {
  return (
    <View style={styles.cajaHeader}>
      <Text style={styles.titulo}>Cooperativa de Vivienda</Text>
      <Text style={styles.subtitulo}>App de Asociados</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cajaHeader: {
    backgroundColor: '#0055aa',
    padding: 15,
    alignItems: 'center',
  },
  titulo: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitulo: {
    color: '#ffffff',
    fontSize: 14,
  },
});
