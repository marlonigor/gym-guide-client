import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import HomeScreen from './src/features/muscles/screens/HomeScreen';
import ExercisesScreen from './src/features/exercises/screens/ExercisesScreen';
import ExerciseDetailScreen from './src/features/exercises/screens/ExerciseDetailScreen';
import SetupScreen from './src/features/setup/screens/SetupScreen';

// Theme
import { colors } from './src/theme';
import { SetupContext } from './src/contexts/SetupContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      const setupCompleted = await AsyncStorage.getItem('app_setup_completed');
      if (setupCompleted === 'true') {
        setIsReady(true);
      }
    } catch (e) {
      console.log('Erro ao ler persistência:', e);
    } finally {
      setChecking(false);
    }
  };

  const contextValue = {
    isReady,
    setSetupCompleted: (value) => setIsReady(value),
    resetSetup: async () => {
      try {
        await AsyncStorage.removeItem('app_setup_completed');
        setIsReady(false);
      } catch (e) {
        console.error('Erro ao resetar setup:', e);
      }
    }
  };

  if (checking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SetupContext.Provider value={contextValue}>
      {!isReady ? (
        <SetupScreen onComplete={() => setIsReady(true)} />
      ) : (
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
      )}
    </SetupContext.Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});