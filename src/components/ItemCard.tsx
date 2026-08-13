import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Proyecto } from '../types';

interface Props {
  proyecto: Proyecto;
  onSelect?: (proyecto: Proyecto) => void;
  esFavorito?: boolean;
  onToggleFavorito?: (id: string) => void;
}

// Tarjeta para mostrar la casa o apartamento
export const ItemCard = ({ 
  proyecto, 
  onSelect, 
  esFavorito = false, 
  onToggleFavorito 
}: Props) => {
  return (
    <View style={styles.tarjeta}>
      <View style={styles.contenedorFoto}>
        <Image source={{ uri: proyecto.imagen }} style={styles.foto} />
        <View style={styles.badgeCiudad}>
          <Text style={styles.textoBadge}>{proyecto.ciudad}</Text>
        </View>

        {/* Botón de me interesa / favorito */}
        <TouchableOpacity
          style={styles.botonFavorito}
          onPress={() => onToggleFavorito && onToggleFavorito(proyecto.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.iconoFavorito}>{esFavorito ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.nombre}>{proyecto.nombre}</Text>
      
      <View style={styles.caracteristicas}>
        <Text style={styles.tagSpec}>📐 {proyecto.area}</Text>
        <Text style={styles.tagSpec}>🛏️ {proyecto.habitaciones} hab</Text>
        <Text style={styles.tagSpec}>🚿 {proyecto.banos} baños</Text>
      </View>

      <View style={styles.pieTarjeta}>
        <View>
          <Text style={styles.etiquetaPrecio}>Precio desde:</Text>
          <Text style={styles.precio}>{proyecto.precio}</Text>
        </View>

        <TouchableOpacity 
          style={styles.boton} 
          onPress={() => onSelect && onSelect(proyecto)}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBoton}>Ver detalles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contenedorFoto: {
    position: 'relative',
  },
  foto: {
    width: '100%',
    height: 140,
    borderRadius: 6,
  },
  badgeCiudad: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 85, 170, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  textoBadge: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  botonFavorito: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconoFavorito: {
    fontSize: 16,
  },
  nombre: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 10,
  },
  caracteristicas: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
    marginBottom: 10,
  },
  tagSpec: {
    fontSize: 12,
    color: '#666666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pieTarjeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  etiquetaPrecio: {
    fontSize: 11,
    color: '#777777',
  },
  precio: {
    fontSize: 15,
    color: '#00796b',
    fontWeight: 'bold',
  },
  boton: {
    backgroundColor: '#0055aa',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  textoBoton: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
});


