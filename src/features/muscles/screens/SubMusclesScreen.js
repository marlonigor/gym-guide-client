import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getSubMusclesByGroup } from '../../../services/exercises.service';
import { colors, spacing, borderRadius, typography } from '../../../theme';

export default function SubMusclesScreen({ route, navigation }) {
    const { muscleGroupId, muscleGroupName } = route.params;
    const [subMuscles, setSubMuscles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSubMuscles();
    }, [muscleGroupId]);

    const loadSubMuscles = async () => {
        try {
            setLoading(true);
            const data = await getSubMusclesByGroup(muscleGroupId);
            setSubMuscles(data);
        } catch (error) {
            console.error('Erro ao carregar sub-músculos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubGroupPress = (subMuscle) => {
        navigation.navigate('Exercises', {
            subMuscleId: subMuscle.id,
            subMuscleName: subMuscle.name
        });
    };

    const renderCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handleSubGroupPress(item)}
            activeOpacity={0.7}
        >
            <Text style={styles.cardTitle}>{item.name}</Text>
            {item.description ? (
                <Text style={styles.cardDesc}>{item.description}</Text>
            ) : null}
        </TouchableOpacity>
    );

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
                <Text style={styles.title}>{muscleGroupName}</Text>
                <Text style={styles.subtitle}>Selecione a região específica</Text>
            </View>

            {loading ? (
                <Text style={styles.loadingText}>Carregando...</Text>
            ) : subMuscles.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Nenhum sub-músculo encontrado.</Text>
                </View>
            ) : (
                <FlatList
                    data={subMuscles}
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
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: 50,
        paddingBottom: spacing.lg,
    },
    backButton: {
        marginBottom: spacing.sm,
    },
    backText: {
        ...typography.body,
        color: colors.primary,
    },
    title: {
        ...typography.h1,
        color: colors.text,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
    },
    list: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
        gap: spacing.md,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
    },
    cardTitle: {
        ...typography.h3,
        color: colors.text,
        marginBottom: 2,
    },
    cardDesc: {
        ...typography.caption,
        color: colors.textMuted,
    },
    loadingText: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 50,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        ...typography.body,
        color: colors.textMuted,
    },
});
