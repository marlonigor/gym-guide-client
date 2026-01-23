import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from './src/features/muscles/screens/HomeScreen';
import ExercisesScreen from './src/features/exercises/screens/ExercisesScreen';
import ExerciseDetailScreen from './src/features/exercises/screens/ExerciseDetailScreen';

// Database
import { seedDatabase } from './src/database/seed';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();

// Tela de Setup inicial (apenas para debug/dev)
function SetupScreen({ onComplete }) {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    const success = await seedDatabase();
    setLoading(false);

    if (success) {
      Alert.alert('Sucesso!', 'Banco de dados populado.', [
        { text: 'Continuar', onPress: onComplete }
      ]);
    } else {
      Alert.alert('Erro', 'Falha ao popular o banco.');
    }
  };

  return (
    <View style={styles.setupContainer}>
      <Text style={styles.setupTitle}>🏋️ GymGuide</Text>
      <Text style={styles.setupSubtitle}>Primeira vez? Vamos criar o banco de dados.</Text>

      <TouchableOpacity
        style={[styles.setupButton, loading && styles.setupButtonDisabled]}
        onPress={handleSeed}
        disabled={loading}
      >
        <Text style={styles.setupButtonText}>
          {loading ? 'Criando...' : 'Inicializar Banco'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={onComplete}>
        <Text style={styles.skipButtonText}>Já tenho dados → Pular</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  // Em produção, você pode verificar se o banco já tem dados
  // e pular a tela de setup automaticamente

  if (!isReady) {
    return <SetupScreen onComplete={() => setIsReady(true)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Exercises" component={ExercisesScreen} />
        <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  setupContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  setupTitle: {
    fontSize: 48,
    marginBottom: 16,
  },
  setupSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  setupButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
  },
  setupButtonDisabled: {
    opacity: 0.6,
  },
  setupButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    padding: 12,
  },
  skipButtonText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});