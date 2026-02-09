import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { searchExercises } from '../services/exercises.service';

export default function ExerciseSelectionModal({ visible, onClose, onSelect }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            handleSearch('');
        }
    }, [visible]);

    const handleSearch = async (text) => {
        setQuery(text);
        setLoading(true);
        try {
            const data = await searchExercises(text);
            setResults(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Selecionar Exercício</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Buscar exercício..."
                        placeholderTextColor={colors.textMuted}
                        value={query}
                        onChangeText={handleSearch}
                        autoFocus
                    />

                    {loading ? (
                        <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary} />
                    ) : (
                        <FlatList
                            data={results}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.item}
                                    onPress={() => {
                                        onSelect(item);
                                        onClose();
                                    }}
                                >
                                    <Text style={styles.itemName}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>Nenhum exercício encontrado.</Text>
                            }
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
    content: {
        backgroundColor: colors.surface,
        height: '80%',
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.lg
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
    title: { ...typography.h2, color: colors.text },
    closeText: { ...typography.body, color: colors.error },
    input: {
        backgroundColor: colors.background,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        color: colors.text,
        marginBottom: spacing.md,
        ...typography.body
    },
    item: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.surfaceLight },
    itemName: { ...typography.body, color: colors.text },
    emptyText: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 }
});
