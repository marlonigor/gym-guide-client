import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { seedDatabase } from '../../../database/seed';
import { colors } from '../../../theme';

export default function SetupScreen({ onComplete }) {
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        setLoading(true);
        const result = await seedDatabase();

        if (result.success) {
            try {
                await AsyncStorage.setItem('app_setup_completed', 'true');
                setLoading(false);
                Alert.alert('Sucesso!', 'Banco de dados populado.', [
                    { text: 'Continuar', onPress: onComplete }
                ]);
            } catch (e) {
                setLoading(false);
                console.error('Erro ao salvar persistência:', e);
                Alert.alert('Aviso', 'Banco criado, mas houve um erro ao salvar status.');
                onComplete();
            }
        } else {
            setLoading(false);
            Alert.alert('Erro', `Falha ao popular o banco:\n${result.error?.message || JSON.stringify(result.error)}`);
        }
    };

    const handleSkip = async () => {
        try {
            await AsyncStorage.setItem('app_setup_completed', 'true');
            onComplete();
        } catch (e) {
            console.error('Erro ao pular setup:', e);
            onComplete();
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

            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipButtonText}>Já tenho dados → Pular</Text>
            </TouchableOpacity>
        </View>
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
        color: colors.text,
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
