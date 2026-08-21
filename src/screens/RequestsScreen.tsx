import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Header } from '../components/Header';
import { SolicitudCredito } from '../types';
import { getSolicitudesPersistidas } from '../services/storage';

export const RequestsScreen = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudCredito[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarSolicitudes = useCallback(async () => {
    try {
      const data = await getSolicitudesPersistidas();
      setSolicitudes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarSolicitudes();
    }, [cargarSolicitudes])
  );

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case 'Aprobado':
        return { bg: '#dcfce7', text: '#15803d' };
      case 'Pre-Aprobado':
        return { bg: '#e0f2fe', text: '#0369a1' };
      case 'Documentación Recibida':
        return { bg: '#fef3c7', text: '#b45309' };
      default:
        return { bg: '#f3e8ff', text: '#7e22ce' };
    }
  };

  const renderHeader = () => (
    <View>
      <Header />

      {/* Perfil del asociado */}
      <View style={styles.cajaPerfil}>
        <View style={styles.avatarCaja}>
          <Text style={styles.textoAvatar}>👤</Text>
        </View>
        <View style={styles.infoPerfil}>
          <Text style={styles.nombreAsociado}>Asociado(a) Cooperativa</Text>
          <Text style={styles.idAsociado}>C.C. 1.098.765.432 • Estado: Al día</Text>
          <Text style={styles.ahorroSub}>
            Ahorro total acumulado: <Text style={styles.montoBold}>$10.000.000 COP</Text>
          </Text>
        </View>
      </View>

      <View style={styles.cajaTitulo}>
        <Text style={styles.tituloSeccion}>📋 Mis Solicitudes de Vivienda</Text>
        <Text style={styles.subtituloSeccion}>
          Historial de créditos solicitados y su estado en el comité de vivienda.
        </Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.cajaVacia}>
      <Text style={styles.iconoVacio}>📄</Text>
      <Text style={styles.textoVacio}>Sin solicitudes registradas</Text>
      <Text style={styles.subtextoVacio}>
        Ingresa al detalle de cualquier proyecto de vivienda para realizar la postulación de tu crédito.
      </Text>
    </View>
  );

  return (
    <View style={styles.pantalla}>
      <FlatList
        data={solicitudes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const colors = getBadgeColor(item.estado);
          return (
            <View style={styles.tarjetaSolicitud}>
              <View style={styles.encabezadoSolicitud}>
                <Text style={styles.nombreProyecto}>{item.nombreProyecto}</Text>
                <View style={[styles.badgeEstado, { backgroundColor: colors.bg }]}>
                  <Text style={[styles.textoBadge, { color: colors.text }]}>{item.estado}</Text>
                </View>
              </View>

              <View style={styles.cuerpoSolicitud}>
                <Text style={styles.detallesSolicitud}>
                  👤 <Text style={styles.boldText}>Solicitante:</Text> {item.nombreAsociado}
                </Text>
                <Text style={styles.detallesSolicitud}>
                  📞 <Text style={styles.boldText}>Teléfono:</Text> {item.telefono}
                </Text>
                {item.montoSolicitado ? (
                  <Text style={styles.detallesSolicitud}>
                    💰 <Text style={styles.boldText}>Monto a financiar:</Text> {item.montoSolicitado}
                  </Text>
                ) : null}
              </View>

              <View style={styles.pieSolicitud}>
                <Text style={styles.fechaSolicitud}>📅 Fecha: {item.fecha}</Text>
                <Text style={styles.idReferencia}>Ref: #{item.id.slice(-6)}</Text>
              </View>
            </View>
          );
        }}
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
    paddingBottom: 30,
  },
  cajaPerfil: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginTop: 12,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  avatarCaja: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textoAvatar: {
    fontSize: 24,
  },
  infoPerfil: {
    flex: 1,
  },
  nombreAsociado: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  idAsociado: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  ahorroSub: {
    fontSize: 12,
    color: '#334155',
    marginTop: 4,
  },
  montoBold: {
    fontWeight: 'bold',
    color: '#0055aa',
  },
  cajaTitulo: {
    marginHorizontal: 12,
    marginTop: 14,
    marginBottom: 8,
  },
  tituloSeccion: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtituloSeccion: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  tarjetaSolicitud: {
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  encabezadoSolicitud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nombreProyecto: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0055aa',
    flex: 1,
  },
  badgeEstado: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  textoBadge: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  cuerpoSolicitud: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  detallesSolicitud: {
    fontSize: 13,
    color: '#334155',
    marginVertical: 2,
  },
  boldText: {
    fontWeight: 'bold',
  },
  pieSolicitud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 6,
  },
  fechaSolicitud: {
    fontSize: 11,
    color: '#94a3b8',
  },
  idReferencia: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: 'bold',
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
