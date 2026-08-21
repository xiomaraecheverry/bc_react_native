import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Header } from '../components/Header';
import { ItemCard } from '../components/ItemCard';
import { Proyecto } from '../types';
import {
  getProyectosPersistidos,
  getFavoritosPersistidos,
  guardarFavoritosPersistidos,
} from '../services/storage';

interface Props {
  onSelectProyecto: (proyecto: Proyecto) => void;
}

export const FavoritesScreen = ({ onSelectProyecto }: Props) => {
  const [proyectosFavoritos, setProyectosFavoritos] = useState<Proyecto[]>([]);
  const [favoritosIds, setFavoritosIds] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarFavoritos = useCallback(async () => {
    try {
      const [todos, ids] = await Promise.all([
        getProyectosPersistidos(),
        getFavoritosPersistidos(),
      ]);
      setFavoritosIds(ids);
      const filtrados = todos.filter((p) => ids.includes(p.id));
      setProyectosFavoritos(filtrados);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarFavoritos();
    }, [cargarFavoritos])
  );

  const toggleFavorito = async (id: string) => {
    const nuevosIds = favoritosIds.filter((favId) => favId !== id);
    setFavoritosIds(nuevosIds);
    setProyectosFavoritos(proyectosFavoritos.filter((p) => p.id !== id));
    await guardarFavoritosPersistidos(nuevosIds);
  };

  const renderHeader = () => (
    <View>
      <Header />
      <View style={styles.cajaTitulo}>
        <Text style={styles.titulo}>❤️ Mis Proyectos Favoritos</Text>
        <Text style={styles.subtitulo}>
          Proyectos de vivienda que has guardado para consultar o solicitar crédito.
        </Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.cajaVacia}>
      <Text style={styles.iconoVacio}>🏡</Text>
      <Text style={styles.textoVacio}>Aún no tienes favoritos guardados</Text>
      <Text style={styles.subtextoVacio}>
        Explora la lista de proyectos en la pestaña "Inicio" y presiona el ❤️ en las tarjetas que te interesen.
      </Text>
    </View>
  );

  return (
    <View style={styles.pantalla}>
      <FlatList
        data={proyectosFavoritos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemCard
            proyecto={item}
            onSelect={onSelectProyecto}
            esFavorito={true}
            onToggleFavorito={toggleFavorito}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!cargando ? renderEmpty : null}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  listContent: {
    paddingBottom: 24,
  },
  cajaTitulo: {
    backgroundColor: '#ffffff',
    padding: 14,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitulo: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  cajaVacia: {
    padding: 40,
    alignItems: 'center',
  },
  iconoVacio: {
    fontSize: 48,
    marginBottom: 10,
  },
  textoVacio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#475569',
  },
  subtextoVacio: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
});
