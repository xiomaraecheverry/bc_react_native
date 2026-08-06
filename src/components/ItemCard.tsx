import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Proyecto } from '../types';

interface Props {
  proyecto: Proyecto;
}

// Tarjeta para mostrar la casa o apartamento
export const ItemCard = ({ proyecto }: Props) => {
  const presionarBoton = () => {
    Alert.alert('Información', 'Seleccionaste: ' + proyecto.nombre);
  };

  return (
    <View style={styles.tarjeta}>
      <Image source={{ uri: proyecto.imagen }} style={styles.foto} />
      <Text style={styles.nombre}>{proyecto.nombre}</Text>
      <Text style={styles.ciudad}>Ciudad: {proyecto.ciudad}</Text>
      <Text style={styles.precio}>Precio: {proyecto.precio}</Text>
      
      <TouchableOpacity style={styles.boton} onPress={presionarBoton}>
        <Text style={styles.textoBoton}>Ver detalles</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: '#ffffff',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
  },
  foto: {
    width: '100%',
    height: 120,
    borderRadius: 5,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  ciudad: {
    fontSize: 14,
    color: '#555555',
    marginTop: 2,
  },
  precio: {
    fontSize: 14,
    color: 'green',
    fontWeight: 'bold',
    marginTop: 2,
  },
  boton: {
    backgroundColor: '#0055aa',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBoton: {
    color: '#ffffff',
    fontSize: 14,
  },
});
