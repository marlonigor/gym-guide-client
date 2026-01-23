import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, FlatList, Alert } from 'react-native';
import { db } from './src/database/db';
import { exercises } from './src/database/schema';
import { seedDatabase } from './src/database/seed';

// O Drizzle é agnóstico de framework, usamos useEffect padrão para buscar dados
const DebugScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Função para ler o banco
  const refreshData = async () => {
    try {
      // SELECT * FROM exercises
      const allExercises = await db.select().from(exercises);
      setData(allExercises);
    } catch (e) {
      console.log("Tabela ainda não existe ou erro de leitura", e);
    }
  };

  // Carrega ao abrir
  useEffect(() => {
    refreshData();
  }, []);

  const handleSeed = async () => {
    setLoading(true);
    const success = await seedDatabase();
    if (success) {
      await refreshData();
      Alert.alert('Sucesso', 'Banco recriado com Drizzle!');
    } else {
      Alert.alert('Erro', 'Falha ao criar dados.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🦕 Drizzle ORM Debug</Text>
      <Text style={styles.subtitle}>Total Exercícios: {data.length}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? "Criando Tabelas..." : "Criar Banco e Dados"}
          onPress={handleSeed}
          color="#841584"
        />
      </View>

      <FlatList
        data={data}
        keyExtractor={item => String(item.id)}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemSub}>ID: {item.id} | Grupo ID: {item.muscleGroupId}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <DebugScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20, paddingTop: 50 },
  card: { flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 16, elevation: 2 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: '#1a1a1a' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  buttonContainer: { marginBottom: 20 },
  list: { flex: 1 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  itemSub: { fontSize: 12, color: '#999' }
});