import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Proyecto } from '../types';
import { agregarSolicitudCredito } from '../services/storage';

interface Props {
  proyecto: Proyecto;
  onBack: () => void;
  onSolicitudExitosa?: () => void;
}

export const DetailScreen = ({ proyecto, onBack, onSolicitudExitosa }: Props) => {
  const [nombreAsociado, setNombreAsociado] = useState('');
  const [telefono, setTelefono] = useState('');
  const [montoSolicitado, setMontoSolicitado] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviarSolicitud = async () => {
    if (!nombreAsociado.trim() || !telefono.trim()) {
      Alert.alert('Campos incompletos', 'Por favor ingresa tu nombre y número de contacto.');
      return;
    }

    try {
      setEnviando(true);
      await agregarSolicitudCredito({
        proyectoId: proyecto.id,
        nombreProyecto: proyecto.nombre,
        nombreAsociado,
        telefono,
        montoSolicitado: montoSolicitado.trim() ? `$${montoSolicitado}` : proyecto.precio,
      });

      Alert.alert(
        '¡Solicitud Registrada!',
        `Gracias ${nombreAsociado}. Tu solicitud para "${proyecto.nombre}" ha sido guardada. Puedes consultar su estado en la pestaña "Mis Solicitudes".`,
        [
          {
            text: 'Aceptar',
            onPress: () => {
              if (onSolicitudExitosa) {
                onSolicitudExitosa();
              } else {
                onBack();
              }
            },
          },
        ]
      );
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la solicitud. Intenta nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ScrollView style={styles.pantalla}>
      {/* Botón regresar */}
      <TouchableOpacity style={styles.botonVolver} onPress={onBack}>
        <Text style={styles.textoVolver}>← Volver a la lista de proyectos</Text>
      </TouchableOpacity>

      {/* Foto del proyecto */}
      <Image source={{ uri: proyecto.imagen }} style={styles.imagenPrincipal} />

      <View style={styles.contenido}>
        <View style={styles.encabezado}>
          <Text style={styles.nombre}>{proyecto.nombre}</Text>
          <Text style={styles.ciudad}>📍 {proyecto.ciudad}, Colombia</Text>
        </View>

        {/* Ficha técnica */}
        <View style={styles.cajaSpecs}>
          <View style={styles.specItem}>
            <Text style={styles.specTitulo}>Precio Desde</Text>
            <Text style={styles.specValorHighlight}>{proyecto.precio}</Text>
          </View>
          <View style={styles.divisor} />
          <View style={styles.specItem}>
            <Text style={styles.specTitulo}>Cuota Inicial</Text>
            <Text style={styles.specValor}>{proyecto.cuotaInicial}</Text>
          </View>
        </View>

        <View style={styles.cajaDetallesGrid}>
          <View style={styles.gridCell}>
            <Text style={styles.gridLabel}>Área Total</Text>
            <Text style={styles.gridValue}>📐 {proyecto.area}</Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.gridLabel}>Habitaciones</Text>
            <Text style={styles.gridValue}>🛏️ {proyecto.habitaciones}</Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.gridLabel}>Baños</Text>
            <Text style={styles.gridValue}>🚿 {proyecto.banos}</Text>
          </View>
        </View>

        {/* Descripción */}
        <Text style={styles.seccionTitulo}>Descripción del Proyecto</Text>
        <Text style={styles.descripcion}>{proyecto.descripcion}</Text>

        {/* Formulario de Postulación */}
        <View style={styles.formularioCaja}>
          <Text style={styles.formTitulo}>Solicitar Crédito / Asesoría</Text>
          <Text style={styles.formSubtitulo}>
            Completa tus datos para recibir estudio de crédito habitacional sin costo.
          </Text>

          <Text style={styles.labelInput}>Nombre completo:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. María Pérez"
            value={nombreAsociado}
            onChangeText={setNombreAsociado}
          />

          <Text style={styles.labelInput}>Teléfono de contacto:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 3001234567"
            keyboardType="phone-pad"
            value={telefono}
            onChangeText={setTelefono}
          />

          <Text style={styles.labelInput}>Monto a financiar estimado (opcional):</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 80000000"
            keyboardType="numeric"
            value={montoSolicitado}
            onChangeText={setMontoSolicitado}
          />

          <TouchableOpacity
            style={[styles.botonEnviar, enviando && styles.botonDeshabilitado]}
            onPress={enviarSolicitud}
            disabled={enviando}
          >
            <Text style={styles.textoBotonEnviar}>
              {enviando ? 'Guardando...' : 'Enviar Solicitud de Vivienda'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  botonVolver: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  textoVolver: {
    color: '#0055aa',
    fontSize: 14,
    fontWeight: 'bold',
  },
  imagenPrincipal: {
    width: '100%',
    height: 220,
  },
  contenido: {
    padding: 16,
  },
  encabezado: {
    marginBottom: 16,
  },
  nombre: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  ciudad: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 4,
  },
  cajaSpecs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    marginBottom: 16,
  },
  specItem: {
    flex: 1,
    alignItems: 'center',
  },
  divisor: {
    width: 1,
    height: '80%',
    backgroundColor: '#cbd5e1',
  },
  specTitulo: {
    fontSize: 12,
    color: '#64748b',
  },
  specValorHighlight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#047857',
    marginTop: 2,
  },
  specValor: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 2,
  },
  cajaDetallesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  gridCell: {
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginTop: 2,
  },
  seccionTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 8,
    marginBottom: 6,
  },
  descripcion: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 20,
  },
  formularioCaja: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginTop: 10,
    marginBottom: 30,
  },
  formTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0055aa',
  },
  formSubtitulo: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  labelInput: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#f8fafc',
  },
  botonEnviar: {
    backgroundColor: '#0055aa',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  botonDeshabilitado: {
    backgroundColor: '#94a3b8',
  },
  textoBotonEnviar: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
