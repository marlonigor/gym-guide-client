import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, FlatList, Alert } from 'react-native';
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider';
import { database } from './src/database';
import { seedDatabase } from './src/database/seed';

const DebugScreen = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  // Função para buscar dados do banco
  const refreshData = async () => {
    const allExercises = await database.get('exercises').query().fetch();
    setExercises(allExercises);
  };

  // Carrega dados ao abrir
  useEffect(() => {
    refreshData();
  }, []);

  const handleSeed = async () => {
    setLoading(true);
    try {
      await seedDatabase(); // Roda nosso script
      await refreshData();  // Atualiza a lista na tela
      Alert.alert('Sucesso', 'Dados gerados!');
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🛠️ Painel de Debug</Text>
      <Text style={styles.subtitle}>Total Exercícios: {exercises.length}</Text>

      <View style={styles.buttonContainer}>
        <Button title={loading ? "Gerando..." : "Gerar Dados de Teste"} onPress={handleSeed} />
      </View>

      <FlatList
        data={exercises}
        keyExtractor={item => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemSub}>ID: {item.id}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default function App() {
  return (
    <DatabaseProvider database={database}>
      <SafeAreaView style={styles.container}>
        <DebugScreen />
      </SafeAreaView>
    </DatabaseProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
  card: { flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 16, elevation: 2 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: '#1a1a1a' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  buttonContainer: { marginBottom: 20 },
  list: { flex: 1 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  itemSub: { fontSize: 12, color: '#999' }
});