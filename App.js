import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider';
import { database } from './src/database'; // Importa nossa instância criada anteriormente

// Componente temporário só para validar a conexão visualmente
const ConnectionCheck = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>GymGuide MVP</Text>
      <Text style={styles.status}>✅ Banco de Dados: Conectado</Text>
      <Text style={styles.status}>📂 Tabelas carregadas: {database.collections.map(c => c.table).join(', ')}</Text>
    </View>
  );
};

export default function App() {
  return (
    <DatabaseProvider database={database}>
      <SafeAreaView style={styles.container}>
        <ConnectionCheck />
      </SafeAreaView>
    </DatabaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  status: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});