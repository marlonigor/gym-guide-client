import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getExercisesByMuscleGroup, getExercisesBySubMuscle } from '../../../services/exercises.service';
import { colors, spacing, borderRadius, typography } from '../../../theme';

export default function ExercisesScreen({ route, navigation }) {
    const { muscleGroupId, muscleGroupName, subMuscleId, subMuscleName } = route.params;
    const [exerciseList, setExerciseList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadExercises();
    }, [subMuscleId, muscleGroupId]);

    const loadExercises = async () => {
        try {
            let data = [];
            if (subMuscleId) {
                data = await getExercisesBySubMuscle(subMuscleId);
            } else if (muscleGroupId) {
                data = await getExercisesByMuscleGroup(muscleGroupId);
            }
            setExerciseList(data);
        } catch (error) {
            console.log('Erro ao carregar exercícios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExercisePress = (exercise) => {
        navigation.navigate('ExerciseDetail', { exercise });
    };

    const renderCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handleExercisePress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardArrow}>→</Text>
            </View>
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
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 30 }}
                >
                    <Text style={styles.backText}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{subMuscleName || muscleGroupName}</Text>
                <Text style={styles.subtitle}>{exerciseList.length} exercícios</Text>
            </View>

            {exerciseList.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Nenhum exercício encontrado.</Text>
                </View>
            ) : (
                <FlatList
                    data={exerciseList}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderCard}
                    contentContainerStyle={styles.list}
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
    backButton: {
        marginBottom: spacing.md,
    },
    backText: {
        ...typography.body,
        color: colors.primary,
    },
    title: {
        ...typography.h1,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    list: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        marginBottom: spacing.md,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        ...typography.h3,
        color: colors.text,
        flex: 1,
    },
    cardArrow: {
        ...typography.h2,
        color: colors.primary,
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
    },
    emptyText: {
        ...typography.body,
        color: colors.textSecondary,
    },
});
