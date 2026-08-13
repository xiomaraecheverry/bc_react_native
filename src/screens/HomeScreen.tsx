import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Header } from '../components/Header';
import { ItemCard } from '../components/ItemCard';
import { listaProyectos } from '../data/mockData';
import { Proyecto } from '../types';

interface Props {
  onSelectProyecto: (proyecto: Proyecto) => void;
}

// Pantalla principal
export const HomeScreen = ({ onSelectProyecto }: Props) => {
  const [proyectos, setProyectos] = useState<Proyecto[]>(listaProyectos);
  const [busqueda, setBusqueda] = useState('');
  const [favoritosIds, setFavoritosIds] = useState<string[]>([]);
  const [soloFavoritos, setSoloFavoritos] = useState(false);

  // Estado para el formulario de nuevo proyecto
  const [mostrarFormNuevo, setMostrarFormNuevo] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaCiudad, setNuevaCiudad] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');

  // Toggle de favorito
  const toggleFavorito = (id: string) => {
    if (favoritosIds.includes(id)) {
      setFavoritosIds(favoritosIds.filter((favId) => favId !== id));
    } else {
      setFavoritosIds([...favoritosIds, id]);
    }
  };

  // Filtrado de proyectos por nombre, ciudad y favoritos
  const proyectosFiltrados = proyectos.filter((item) => {
    const coincideTexto =
      item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.ciudad.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideFavorito = soloFavoritos ? favoritosIds.includes(item.id) : true;
    return coincideTexto && coincideFavorito;
  });

  // Agregar un nuevo proyecto a la lista en tiempo real
  const agregarNuevoProyecto = () => {
    if (!nuevoNombre.trim() || !nuevaCiudad.trim() || !nuevoPrecio.trim()) {
      Alert.alert('Formulario incompleto', 'Por favor llena nombre, ciudad y precio del proyecto.');
      return;
    }

    const nuevoItem: Proyecto = {
      id: Date.now().toString(),
      nombre: nuevoNombre,
      ciudad: nuevaCiudad,
      precio: `$${nuevoPrecio}`,
      imagen: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80',
      descripcion: 'Nuevo proyecto registrado en la Cooperativa de Vivienda.',
      area: '60 m²',
      habitaciones: 3,
      banos: 2,
      cuotaInicial: `$${(parseInt(nuevoPrecio.replace(/\D/g, '')) * 0.1 || 10000000).toLocaleString()}`,
    };

    setProyectos([nuevoItem, ...proyectos]);
    setNuevoNombre('');
    setNuevaCiudad('');
    setNuevoPrecio('');
    setMostrarFormNuevo(false);
    Alert.alert('¡Éxito!', 'Proyecto agregado correctamente.');
  };

  const renderHeaderComponent = () => (
    <View>
      <Header />

      {/* Resumen del Asociado */}
      <View style={styles.cajaUsuario}>
        <View style={styles.filauUsuario}>
          <Text style={styles.textoUsuario}>👋 Hola, Asociado(a)</Text>
          <View style={styles.badgeEstado}>
            <Text style={styles.textoBadgeEstado}>Al día</Text>
          </View>
        </View>
        <Text style={styles.textoAhorro}>
          Ahorro en Cooperativa: <Text style={styles.montoHighlight}>$10.000.000 COP</Text>
        </Text>
        <Text style={styles.subtextoSimulador}>
          💡 Capacidad de crédito pre-aprobado hasta 80%
        </Text>
      </View>

      {/* Buscador de Proyectos */}
      <View style={styles.cajaBuscador}>
        <Text style={styles.labelBuscador}>🔍 Buscar proyecto de vivienda:</Text>
        <TextInput
          style={styles.inputBuscador}
          placeholder="Filtrar por nombre o ciudad (Ej. Bogotá, Medellín)..."
          value={busqueda}
          onChangeText={setBusqueda}
          clearButtonMode="while-editing"
        />

        {/* Filtros rápidos y botón de agregar */}
        <View style={styles.filaFiltros}>
          <TouchableOpacity
            style={[styles.botonFiltro, !soloFavoritos && styles.botonFiltroActivo]}
            onPress={() => setSoloFavoritos(false)}
          >
            <Text style={[styles.textoFiltro, !soloFavoritos && styles.textoFiltroActivo]}>
              Todos ({proyectos.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botonFiltro, soloFavoritos && styles.botonFiltroActivo]}
            onPress={() => setSoloFavoritos(true)}
          >
            <Text style={[styles.textoFiltro, soloFavoritos && styles.textoFiltroActivo]}>
              ❤️ Mis Intereses ({favoritosIds.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botonNuevo}
            onPress={() => setMostrarFormNuevo(!mostrarFormNuevo)}
          >
            <Text style={styles.textoBotonNuevo}>
              {mostrarFormNuevo ? '❌ Cerrar' : '➕ Nuevo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Formulario desplegable para agregar nuevo proyecto */}
      {mostrarFormNuevo && (
        <View style={styles.cajaFormNuevo}>
          <Text style={styles.tituloFormNuevo}>➕ Registrar Nuevo Proyecto</Text>

          <TextInput
            style={styles.inputForm}
            placeholder="Nombre del proyecto (Ej. Torres del Parque)"
            value={nuevoNombre}
            onChangeText={setNuevoNombre}
          />
          <TextInput
            style={styles.inputForm}
            placeholder="Ciudad (Ej. Armenia, Bucaramanga)"
            value={nuevaCiudad}
            onChangeText={setNuevaCiudad}
          />
          <TextInput
            style={styles.inputForm}
            placeholder="Precio total (Ej. 130000000)"
            keyboardType="numeric"
            value={nuevoPrecio}
            onChangeText={setNuevoPrecio}
          />

          <TouchableOpacity style={styles.botonGuardarNuevo} onPress={agregarNuevoProyecto}>
            <Text style={styles.textoGuardarNuevo}>Guardar Proyecto</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.tituloLista}>
        Proyectos Disponibles ({proyectosFiltrados.length}):
      </Text>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.cajaVacia}>
      <Text style={styles.textoVacio}>No hay proyectos para mostrar.</Text>
      <Text style={styles.subtextoVacio}>
        {soloFavoritos
          ? 'No has guardado proyectos en "Mis Intereses". Toca el ❤️ en una tarjeta.'
          : 'Prueba buscando otra palabra clave o agrega un nuevo proyecto.'}
      </Text>
    </View>
  );

  return (
    <View style={styles.pantalla}>
      <FlatList
        data={proyectosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemCard 
            proyecto={item} 
            onSelect={onSelectProyecto}
            esFavorito={favoritosIds.includes(item.id)}
            onToggleFavorito={toggleFavorito}
          />
        )}
        ListHeaderComponent={renderHeaderComponent}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  listContainer: {
    paddingBottom: 24,
  },
  cajaUsuario: {
    backgroundColor: '#ffffff',
    padding: 14,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  filauUsuario: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  textoUsuario: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  badgeEstado: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  textoBadgeEstado: {
    color: '#15803d',
    fontSize: 11,
    fontWeight: 'bold',
  },
  textoAhorro: {
    fontSize: 14,
    color: '#334155',
  },
  montoHighlight: {
    fontWeight: 'bold',
    color: '#0055aa',
  },
  subtextoSimulador: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 6,
    fontStyle: 'italic',
  },
  cajaBuscador: {
    marginHorizontal: 12,
    marginTop: 14,
    marginBottom: 6,
  },
  labelBuscador: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputBuscador: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  filaFiltros: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  botonFiltro: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
  },
  botonFiltroActivo: {
    backgroundColor: '#0055aa',
  },
  textoFiltro: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  textoFiltroActivo: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  botonNuevo: {
    marginLeft: 'auto',
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  textoBotonNuevo: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cajaFormNuevo: {
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#059669',
  },
  tituloFormNuevo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8,
  },
  inputForm: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    padding: 8,
    fontSize: 13,
    marginBottom: 8,
    backgroundColor: '#f8fafc',
  },
  botonGuardarNuevo: {
    backgroundColor: '#059669',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  textoGuardarNuevo: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  tituloLista: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0f172a',
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 4,
  },
  cajaVacia: {
    padding: 30,
    alignItems: 'center',
  },
  textoVacio: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#64748b',
  },
  subtextoVacio: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
});


