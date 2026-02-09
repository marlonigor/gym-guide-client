import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../../database/db';
import { muscleGroups } from '../../../database/schema';
import { colors, spacing, borderRadius, typography } from '../../../theme';
import { useSetup } from '../../../contexts/SetupContext';

export default function HomeScreen({ navigation }) {
    const { resetSetup } = useSetup();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMuscleGroups();
    }, []);

    const loadMuscleGroups = async () => {
        try {
            const data = await db.select().from(muscleGroups);
            setGroups(data);
        } catch (error) {
            console.log('Erro ao carregar grupos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGroupPress = (group) => {
        navigation.navigate('SubMuscles', {
            muscleGroupId: group.id,
            muscleGroupName: group.name
        });
    };

    const renderCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handleGroupPress(item)}
            activeOpacity={0.7}
        >
            <Text style={styles.cardIcon}>{item.icon || '💪'}</Text>
            <Text style={styles.cardTitle}>{item.name}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            <View style={styles.header}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.title}>GymGuide</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.navigate('WgerSync')} style={{ marginRight: spacing.md }}>
                            <Text style={{ color: colors.success, fontSize: 13 }}>🌍 Sync</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('ImportGifs')} style={{ marginRight: spacing.md }}>
                            <Text style={{ color: colors.primary, fontSize: 13 }}>⚙️ GIF</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={resetSetup}>
                            <Text style={{ color: colors.error, fontSize: 12 }}>Reset Data</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.subtitle}>Escolha o grupo muscular</Text>
            </View>

            <TouchableOpacity
                style={styles.startWorkoutButton}
                onPress={() => navigation.navigate('ActiveWorkout')}
            >
                <Text style={styles.startWorkoutText}>🏋️ Iniciar Novo Treino</Text>
            </TouchableOpacity>

            {groups.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Nenhum dado encontrado.</Text>
                    <Text style={styles.emptyHint}>Rode o seed para popular o banco.</Text>

                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={resetSetup}
                    >
                        <Text style={styles.resetButtonText}>Resetar e Tentar Setup</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={groups}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderCard}
                    numColumns={2}
                    contentContainerStyle={styles.grid}
                    columnWrapperStyle={styles.row}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 50,
    },
    header: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h1,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
    },
    grid: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.xl,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    card: {
        flex: 0.48,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
    },
    cardIcon: {
        fontSize: 40,
        marginBottom: spacing.sm,
    },
    cardTitle: {
        ...typography.h3,
        color: colors.text,
        textAlign: 'center',
    },
    loadingText: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 100,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    emptyText: {
        ...typography.h3,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    emptyHint: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },
    resetButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
    },
    resetButtonText: {
        color: colors.text,
        ...typography.h3,
    },
    startWorkoutButton: {
        backgroundColor: colors.primary,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    startWorkoutText: {
        ...typography.h3,
        color: colors.text,
        fontWeight: 'bold',
    },
});
