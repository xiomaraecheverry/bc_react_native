// App.tsx — Ejercicio 01: Store Básico con Zustand
// Demostración completa de stores Zustand tipados y consumidos
// en múltiples componentes sin prop drilling.

import React, { useState } from 'react';
import { create } from 'zustand';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// ============================================================
// PASO 1 — Store Counter
// ============================================================
interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// ============================================================
// PASO 3 — Store Todo
// ============================================================
interface Todo {
  id: string;
  text: string;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (id: string) => void;
}

const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  addTodo: (text) =>
    set((state) => ({
      todos: [...state.todos, { id: Date.now().toString(), text }],
    })),
  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
}));

// ============================================================
// COMPONENTES
// ============================================================

function CounterSection(): React.JSX.Element {
  // PASO 2 — Consumir con selectores
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Contador</Text>
      <Text style={styles.counter}>{count}</Text>
      <View style={styles.row}>
        <Pressable style={styles.btn} onPress={decrement}>
          <Text style={styles.btnText}>−</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={increment}>
          <Text style={styles.btnText}>+</Text>
        </Pressable>
      </View>
      <Pressable style={styles.resetBtn} onPress={reset}>
        <Text style={styles.resetBtnText}>Reset</Text>
      </Pressable>
    </View>
  );
}

function TodoSection(): React.JSX.Element {
  const [inputText, setInputText] = useState('');

  const todos = useTodoStore((state) => state.todos);
  const addTodo = useTodoStore((state) => state.addTodo);
  const removeTodo = useTodoStore((state) => state.removeTodo);

  function handleAdd(): void {
    if (inputText.trim() === '') return;
    addTodo(inputText.trim());
    setInputText('');
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Lista de tareas</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Nueva tarea..."
          placeholderTextColor="#6e7681"
          onSubmitEditing={handleAdd}
        />
        <Pressable style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.btnText}>+</Text>
        </Pressable>
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoRow}>
            <Text style={styles.todoText}>{item.text}</Text>
            <Pressable onPress={() => removeTodo(item.id)}>
              <Text style={styles.removeText}>✕</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Sin tareas aún</Text>
        }
        scrollEnabled={false}
      />
    </View>
  );
}

// PASO 4 — Componente separado que lee el store sin prop drilling
function StatsPanel(): React.JSX.Element {
  const totalCount = useTodoStore((state) => state.todos.length);
  return (
    <View style={styles.statsPanel}>
      <Text style={styles.statsText}>Tareas en el store: {totalCount}</Text>
      <Text style={styles.statsHint}>
        (Sin prop drilling — lee el store directamente)
      </Text>
    </View>
  );
}

export default function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ejercicio 01 — Store Básico</Text>
      <CounterSection />
      <TodoSection />
      <StatsPanel />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e6edf3',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#161b22',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b949e',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  counter: {
    fontSize: 48,
    fontWeight: '700',
    color: '#61DAFB',
    textAlign: 'center',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    backgroundColor: '#21262d',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  btnText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e6edf3',
  },
  resetBtn: {
    marginTop: 8,
    backgroundColor: '#21262d',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  resetBtnText: {
    fontSize: 13,
    color: '#8b949e',
  },
  input: {
    flex: 1,
    backgroundColor: '#0d1117',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#30363d',
    padding: 10,
    color: '#e6edf3',
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: '#61DAFB',
    borderRadius: 8,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
  },
  todoText: {
    flex: 1,
    fontSize: 14,
    color: '#e6edf3',
  },
  removeText: {
    fontSize: 14,
    color: '#f85149',
    paddingLeft: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#6e7681',
    textAlign: 'center',
    paddingVertical: 8,
  },
  statsPanel: {
    backgroundColor: '#161b22',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#61DAFB',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#61DAFB',
  },
  statsHint: {
    fontSize: 11,
    color: '#6e7681',
    marginTop: 4,
  },
});
