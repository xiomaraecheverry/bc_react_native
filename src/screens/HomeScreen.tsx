import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Header } from '../components/Header';
import { ItemCard } from '../components/ItemCard';
import { listaProyectos } from '../data/mockData';

// Pantalla principal
export const HomeScreen = () => {
  return (
    <ScrollView style={styles.pantalla}>
      <Header />

      <View style={styles.cajaUsuario}>
        <Text style={styles.textoUsuario}>Hola, Asociado(a)</Text>
        <Text style={styles.textoAhorro}>Tu ahorro para vivienda es: $10.000.000</Text>
      </View>

      <Text style={styles.tituloLista}>Proyectos de Vivienda:</Text>

      {listaProyectos.map((item) => (
        <ItemCard key={item.id} proyecto={item} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#eeeeee',
  },
  cajaUsuario: {
    backgroundColor: '#ffffff',
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
  },
  textoUsuario: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoAhorro: {
    fontSize: 14,
    marginTop: 4,
  },
  tituloLista: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 10,
  },
});
