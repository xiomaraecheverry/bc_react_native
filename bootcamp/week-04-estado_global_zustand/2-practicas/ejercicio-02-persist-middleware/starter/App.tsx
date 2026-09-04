// App.tsx — Ejercicio 02: Persist Middleware
// Demuestra el middleware `persist` de Zustand con AsyncStorage
// para persistir el estado entre reinicios de la aplicación.

import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// ============================================================
// STORE CON PERSIST + ASYNCSTORAGE
// ============================================================

interface Note {
  id: string;
  text: string;
  createdAt: number;
}

interface NotesStore {
  notes: Note[];
  hasHydrated: boolean;
  addNote: (text: string) => void;
  removeNote: (id: string) => void;
  setHydrated: (value: boolean) => void;
}

export const useNotesStore = create<NotesStore>()(
  persist(
    (set) => ({
      notes: [],
      hasHydrated: false,
      addNote: (text) =>
        set((state) => ({
          notes: [
            ...state.notes,
            { id: Date.now().toString(), text, createdAt: Date.now() },
          ],
        })),
      removeNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),
      setHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'notes-storage-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ notes: state.notes } as NotesStore),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function App(): React.JSX.Element {
  const [inputText, setInputText] = useState('');

  const notes = useNotesStore((state) => state.notes);
  const addNote = useNotesStore((state) => state.addNote);
  const removeNote = useNotesStore((state) => state.removeNote);
  const hasHydrated = useNotesStore((state) => state.hasHydrated);

  function handleAdd(): void {
    if (inputText.trim() === '') return;
    addNote(inputText.trim());
    setInputText('');
  }

  if (!hasHydrated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#61DAFB" />
          <Text style={styles.loadingText}>Cargando datos guardados...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ejercicio 02 — Persist</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Notas guardadas en AsyncStorage: {notes.length}
        </Text>
        <Text style={styles.infoHint}>
          Cierra y reabre la app — las notas persisten automáticamente
        </Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Escribe una nota..."
          placeholderTextColor="#6e7681"
          onSubmitEditing={handleAdd}
        />
        <Pressable style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>+</Text>
        </Pressable>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.noteRow}>
            <View style={styles.noteContent}>
              <Text style={styles.noteText}>{item.text}</Text>
              <Text style={styles.noteDate}>
                {new Date(item.createdAt).toLocaleTimeString('es-CO', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <Pressable onPress={() => removeNote(item.id)}>
              <Text style={styles.removeText}>✕</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay notas guardadas.</Text>
            <Text style={styles.emptyHint}>
              Agrega una nota y reinicia la app para probar persist.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e6edf3',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingText: {
    color: '#8b949e',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: 'rgba(97, 218, 251, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#61DAFB',
  },
  infoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#61DAFB',
  },
  infoHint: {
    fontSize: 11,
    color: '#8b949e',
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#161b22',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#30363d',
    padding: 12,
    color: '#e6edf3',
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: '#61DAFB',
    borderRadius: 8,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0d1117',
  },
  list: {
    gap: 8,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161b22',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  noteContent: {
    flex: 1,
  },
  noteText: {
    fontSize: 14,
    color: '#e6edf3',
  },
  noteDate: {
    fontSize: 11,
    color: '#6e7681',
    marginTop: 2,
  },
  removeText: {
    fontSize: 16,
    color: '#f85149',
    paddingLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#8b949e',
  },
  emptyHint: {
    fontSize: 12,
    color: '#6e7681',
    marginTop: 6,
    textAlign: 'center',
  },
});
