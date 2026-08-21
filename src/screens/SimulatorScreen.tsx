import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Header } from '../components/Header';
import { Proyecto } from '../types';

interface Props {
  onIrADetalle?: (proyecto: Proyecto) => void;
}

export const SimulatorScreen = ({ onIrADetalle }: Props) => {
  const [montoVivienda, setMontoVivienda] = useState('150000000');
  const [porcentajeCuotaInicial, setPorcentajeCuotaInicial] = useState(20);
  const [plazoAnos, setPlazoAnos] = useState(15);
  const [tipoVivienda, setTipoVivienda] = useState<'VIS' | 'No VIS'>('VIS');

  // Cálculo financiero
  const valorViviendaNum = parseFloat(montoVivienda.replace(/\D/g, '')) || 0;
  const cuotaInicialMonto = (valorViviendaNum * porcentajeCuotaInicial) / 100;
  const montoAFinanciar = valorViviendaNum - cuotaInicialMonto;

  // Tasa de interés mensual preferencial cooperativa
  const tasaInteresMensual = tipoVivienda === 'VIS' ? 0.008 : 0.0095; // 0.8% mensual para VIS, 0.95% para No VIS
  const numeroMeses = plazoAnos * 12;

  // Fórmula cuota fija sistema francés
  const cuotaMensual =
    montoAFinanciar > 0 && numeroMeses > 0
      ? (montoAFinanciar *
          (tasaInteresMensual * Math.pow(1 + tasaInteresMensual, numeroMeses))) /
        (Math.pow(1 + tasaInteresMensual, numeroMeses) - 1)
      : 0;

  const primerMesInteres = montoAFinanciar * tasaInteresMensual;
  const primerMesCapital = Math.max(0, cuotaMensual - primerMesInteres);

  const formatoMoneda = (val: number) => {
    return '$' + Math.round(val).toLocaleString('es-CO');
  };

  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.scrollContent}>
      <Header />

      <View style={styles.contenedor}>
        <View style={styles.cardHeader}>
          <Text style={styles.tituloSimulador}>🧮 Simulador de Crédito de Vivienda</Text>
          <Text style={styles.subtituloSimulador}>
            Calcula la cuota mensual estimada para adquirir tu casa o apartamento con tasas preferenciales de la cooperativa.
          </Text>
        </View>

        {/* Tipo de vivienda */}
        <Text style={styles.labelInput}>Tipo de Vivienda:</Text>
        <View style={styles.filaOpciones}>
          <TouchableOpacity
            style={[styles.botonOpcion, tipoVivienda === 'VIS' && styles.botonOpcionActivo]}
            onPress={() => setTipoVivienda('VIS')}
          >
            <Text style={[styles.textoOpcion, tipoVivienda === 'VIS' && styles.textoOpcionActiva]}>
              🏠 VIS (Subsidio Cooperativo)
            </Text>
            <Text style={styles.subtextoOpcion}>Tasa: 0.8% mensual (9.6% EA)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botonOpcion, tipoVivienda === 'No VIS' && styles.botonOpcionActivo]}
            onPress={() => setTipoVivienda('No VIS')}
          >
            <Text style={[styles.textoOpcion, tipoVivienda === 'No VIS' && styles.textoOpcionActiva]}>
              🏢 No VIS
            </Text>
            <Text style={styles.subtextoOpcion}>Tasa: 0.95% mensual (11.4% EA)</Text>
          </TouchableOpacity>
        </View>

        {/* Monto de la Vivienda */}
        <Text style={styles.labelInput}>Valor Total de la Vivienda (COP):</Text>
        <TextInput
          style={styles.inputMoneda}
          keyboardType="numeric"
          value={montoVivienda}
          onChangeText={(val) => setMontoVivienda(val.replace(/[^0-9]/g, ''))}
          placeholder="Ej. 150000000"
        />

        {/* Porcentaje Cuota Inicial */}
        <Text style={styles.labelInput}>
          % Cuota Inicial Aportada: <Text style={styles.valorHighlight}>{porcentajeCuotaInicial}%</Text>
        </Text>
        <View style={styles.filaBotonesPorcentaje}>
          {[10, 20, 30, 40].map((pct) => (
            <TouchableOpacity
              key={pct}
              style={[
                styles.chipPorcentaje,
                porcentajeCuotaInicial === pct && styles.chipPorcentajeActivo,
              ]}
              onPress={() => setPorcentajeCuotaInicial(pct)}
            >
              <Text
                style={[
                  styles.textoChipPorcentaje,
                  porcentajeCuotaInicial === pct && styles.textoChipPorcentajeActivo,
                ]}
              >
                {pct}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Plazo en Años */}
        <Text style={styles.labelInput}>
          Plazo del Crédito: <Text style={styles.valorHighlight}>{plazoAnos} Años</Text> ({numeroMeses} meses)
        </Text>
        <View style={styles.filaBotonesPlazo}>
          {[5, 10, 15, 20].map((anos) => (
            <TouchableOpacity
              key={anos}
              style={[styles.chipPlazo, plazoAnos === anos && styles.chipPlazoActivo]}
              onPress={() => setPlazoAnos(anos)}
            >
              <Text
                style={[
                  styles.textoChipPlazo,
                  plazoAnos === anos && styles.textoChipPlazoActivo,
                ]}
              >
                {anos} años
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tarjeta de Resultados */}
        <View style={styles.cajaResultado}>
          <Text style={styles.tituloResultado}>📊 Resumen de tu Simulación</Text>

          <View style={styles.filaResumen}>
            <Text style={styles.labelResumen}>Valor Vivienda:</Text>
            <Text style={styles.valorResumen}>{formatoMoneda(valorViviendaNum)}</Text>
          </View>

          <View style={styles.filaResumen}>
            <Text style={styles.labelResumen}>Cuota Inicial ({porcentajeCuotaInicial}%):</Text>
            <Text style={styles.valorResumen}>{formatoMoneda(cuotaInicialMonto)}</Text>
          </View>

          <View style={styles.filaResumen}>
            <Text style={styles.labelResumen}>Monto a Financiar:</Text>
            <Text style={styles.valorResumenBold}>{formatoMoneda(montoAFinanciar)}</Text>
          </View>

          <View style={styles.divisor} />

          <View style={styles.cajaCuotaMensual}>
            <Text style={styles.etiquetaCuotaMensual}>Cuota Mensual Estimada:</Text>
            <Text style={styles.montoCuotaMensual}>{formatoMoneda(cuotaMensual)}</Text>
            <Text style={styles.subtextoCuota}>Incluye seguro de deudores estimado</Text>
          </View>

          <View style={styles.desgloseCaja}>
            <Text style={styles.desgloseTitulo}>Desglose estimado primer mes:</Text>
            <View style={styles.filaDesglose}>
              <Text style={styles.textoDesglose}>🟢 Abono a Capital:</Text>
              <Text style={styles.valorDesglose}>{formatoMoneda(primerMesCapital)}</Text>
            </View>
            <View style={styles.filaDesglose}>
              <Text style={styles.textoDesglose}>🔵 Intereses Cooperativa:</Text>
              <Text style={styles.valorDesglose}>{formatoMoneda(primerMesInteres)}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.botonAsesoria}
          onPress={() =>
            Alert.alert(
              '¡Estudio Pre-Aprobado!',
              `Con tu cuota inicial de ${formatoMoneda(
                cuotaInicialMonto
              )} y tus ahorros en la cooperativa, puedes solicitar este crédito a ${plazoAnos} años.`,
              [{ text: 'Entendido' }]
            )
          }
        >
          <Text style={styles.textoBotonAsesoria}>Solicitar Pre-Aprobación Inmediata</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  contenedor: {
    padding: 14,
  },
  cardHeader: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 16,
  },
  tituloSimulador: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0055aa',
    marginBottom: 4,
  },
  subtituloSimulador: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  labelInput: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 10,
    marginBottom: 6,
  },
  valorHighlight: {
    color: '#0055aa',
  },
  filaOpciones: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  botonOpcion: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
  },
  botonOpcionActivo: {
    borderColor: '#0055aa',
    backgroundColor: '#e0f2fe',
  },
  textoOpcion: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
  },
  textoOpcionActiva: {
    color: '#0055aa',
  },
  subtextoOpcion: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  inputMoneda: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  filaBotonesPorcentaje: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  chipPorcentaje: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  chipPorcentajeActivo: {
    backgroundColor: '#0055aa',
  },
  textoChipPorcentaje: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
  },
  textoChipPorcentajeActivo: {
    color: '#ffffff',
  },
  filaBotonesPlazo: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  chipPlazo: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  chipPlazoActivo: {
    backgroundColor: '#059669',
  },
  textoChipPlazo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
  },
  textoChipPlazoActivo: {
    color: '#ffffff',
  },
  cajaResultado: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#059669',
    marginTop: 8,
  },
  tituloResultado: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 12,
  },
  filaResumen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  labelResumen: {
    fontSize: 13,
    color: '#475569',
  },
  valorResumen: {
    fontSize: 13,
    color: '#0f172a',
  },
  valorResumenBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0055aa',
  },
  divisor: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 10,
  },
  cajaCuotaMensual: {
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  etiquetaCuotaMensual: {
    fontSize: 13,
    color: '#166534',
    fontWeight: '600',
  },
  montoCuotaMensual: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803d',
    marginVertical: 4,
  },
  subtextoCuota: {
    fontSize: 11,
    color: '#16a34a',
  },
  desgloseCaja: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 6,
  },
  desgloseTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 6,
  },
  filaDesglose: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  textoDesglose: {
    fontSize: 12,
    color: '#64748b',
  },
  valorDesglose: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  botonAsesoria: {
    backgroundColor: '#0055aa',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  textoBotonAsesoria: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
