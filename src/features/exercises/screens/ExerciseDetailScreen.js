import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../../theme';
import { getExerciseAlternatives } from '../../../services/exercises.service';

export default function ExerciseDetailScreen({ route, navigation }) {
    const { exercise } = route.params;
    const [alternatives, setAlternatives] = useState([]);
    const [loadingAlternatives, setLoadingAlternatives] = useState(true);

    // Parse das instruções (vem como JSON string)
    let instructions = [];
    try {
        instructions = JSON.parse(exercise.instructions || '[]');
    } catch (e) {
        instructions = [];
    }

    useEffect(() => {
        loadAlternatives();
    }, [exercise]);

    const loadAlternatives = async () => {
        try {
            setLoadingAlternatives(true);
            // Identificar o alvo primário
            const primaryTarget = exercise.targets?.find(t => t.targetType === 'primary');

            if (primaryTarget) {
                const data = await getExerciseAlternatives(primaryTarget.subMuscleId, exercise.id);
                setAlternatives(data);
            } else {
                setAlternatives([]);
            }
        } catch (error) {
            console.error('Erro ao carregar alternativas:', error);
        } finally {
            setLoadingAlternatives(false);
        }
    };

    const renderAlternativeItem = (altExercise) => {
        const isBodyweight = altExercise.equipments?.some(e => e.equipment?.id === 3);

        return (
            <TouchableOpacity
                key={altExercise.id}
                style={styles.altCard}
                onPress={() => navigation.push('ExerciseDetail', { exercise: altExercise })}
            >
                <View style={styles.altContent}>
                    <Text style={styles.altTitle}>{altExercise.name}</Text>
                    {isBodyweight && (
                        <View style={styles.badgeContainer}>
                            <Text style={styles.badgeText}>Peso do Corpo</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 30 }}
                >
                    <Text style={styles.backText}>← Voltar</Text>
                </TouchableOpacity>
            </View>

            {/* Área da mídia (GIF/Imagem) */}
            <View style={styles.mediaContainer}>
                {exercise.mediaUrl ? (
                    <Image
                        source={{ uri: exercise.mediaUrl }}
                        style={styles.media}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.mediaPlaceholder}>
                        <Text style={styles.placeholderIcon}>🏋️</Text>
                        <Text style={styles.placeholderText}>Sem imagem</Text>
                    </View>
                )}
            </View>

            {/* Nome do exercício */}
            <View style={styles.content}>
                <Text style={styles.title}>{exercise.name}</Text>

                {/* Instruções */}
                <View style={styles.instructionsContainer}>
                    <Text style={styles.sectionTitle}>Como executar</Text>

                    {instructions.length > 0 ? (
                        instructions.map((instruction, index) => (
                            <View key={index} style={styles.instructionItem}>
                                <View style={styles.stepBadge}>
                                    <Text style={styles.stepNumber}>{index + 1}</Text>
                                </View>
                                <Text style={styles.instructionText}>{instruction}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noInstructions}>Instruções não disponíveis.</Text>
                    )}
                </View>

                {/* Alternativas */}
                <View style={[styles.instructionsContainer, { marginTop: spacing.lg }]}>
                    <Text style={styles.sectionTitle}>
                        Variações & Alternativas
                    </Text>
                    <Text style={styles.sectionSubtitle}>
                        Para o mesmo grupo muscular
                    </Text>

                    {loadingAlternatives ? (
                        <ActivityIndicator color={colors.primary} />
                    ) : alternatives.length > 0 ? (
                        alternatives.map(renderAlternativeItem)
                    ) : (
                        <Text style={styles.noInstructions}>Nenhuma alternativa encontrada.</Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: 50,
        paddingBottom: spacing.md,
    },
    backButton: {},
    backText: {
        ...typography.body,
        color: colors.primary,
    },
    mediaContainer: {
        width: '100%',
        height: 250,
        backgroundColor: colors.surface,
    },
    media: {
        width: '100%',
        height: '100%',
    },
    mediaPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderIcon: {
        fontSize: 60,
        marginBottom: spacing.sm,
    },
    placeholderText: {
        ...typography.caption,
        color: colors.textMuted,
    },
    content: {
        padding: spacing.lg,
        paddingBottom: 50,
    },
    title: {
        ...typography.h1,
        color: colors.text,
        marginBottom: spacing.lg,
    },
    instructionsContainer: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    sectionSubtitle: {
        ...typography.caption,
        color: colors.textMuted,
        marginBottom: spacing.lg,
    },
    instructionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    stepBadge: {
        width: 28,
        height: 28,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    stepNumber: {
        ...typography.caption,
        color: colors.text,
        fontWeight: '700',
    },
    instructionText: {
        ...typography.body,
        color: colors.textSecondary,
        flex: 1,
        lineHeight: 24,
    },
    noInstructions: {
        ...typography.body,
        color: colors.textMuted,
        fontStyle: 'italic',
    },
    altCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceLight,
    },
    altContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    altTitle: {
        ...typography.body,
        color: colors.text,
        marginRight: spacing.sm,
    },
    badgeContainer: {
        backgroundColor: colors.surfaceLight,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    badgeText: {
        ...typography.small,
        color: colors.textMuted,
    },
    arrow: {
        color: colors.primary,
        fontSize: 18,
        marginLeft: spacing.sm,
    },
});
