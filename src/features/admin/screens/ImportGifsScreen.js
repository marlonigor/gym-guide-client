import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { db } from '../../../database/db';
import { exercises } from '../../../database/schema';
import { eq } from 'drizzle-orm';
import { colors, spacing, borderRadius, typography } from '../../../theme';

export default function ImportGifsScreen({ navigation }) {
    const [importing, setImporting] = useState(false);
    const [results, setResults] = useState(null);

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['text/csv', 'text/comma-separated-values'],
            });

            if (result.canceled) return;

            const file = result.assets[0];
            processCSV(file.uri);
        } catch (error) {
            console.error('Pick error:', error);
            Alert.alert('Erro', 'Não foi possível ler o arquivo.');
        }
    };

    const processCSV = async (uri) => {
        try {
            setImporting(true);
            const content = await FileSystem.readAsStringAsync(uri);
            const lines = content.split('\n');

            let updated = 0;
            let errors = 0;

            // Pular cabeçalho: id,exercise_name,gif_url
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                // Regex para lidar com nomes entre aspas que contém vírgulas
                const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

                if (parts.length >= 3) {
                    const id = parseInt(parts[0].replace(/"/g, ''));
                    const gifUrl = parts[2].replace(/"/g, '').trim();

                    if (id && gifUrl) {
                        try {
                            await db.update(exercises)
                                .set({ mediaUrl: gifUrl })
                                .where(eq(exercises.id, id));
                            updated++;
                        } catch (err) {
                            console.error(`Error updating ID ${id}:`, err);
                            errors++;
                        }
                    }
                }
            }

            setResults({ updated, errors, total: lines.length - 1 });
            Alert.alert('Sucesso', `Importação concluída!\n✅ ${updated} atualizados\n❌ ${errors} erros`);
        } catch (error) {
            console.error('Process error:', error);
            Alert.alert('Erro', 'Falha ao processar o arquivo CSV.');
        } finally {
            setImporting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 30 }}
                >
                    <Text style={styles.backText}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Importar CSV</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Instruções</Text>
                    <Text style={styles.text}>
                        O arquivo CSV deve ter o seguinte formato (sem espaços antes/depois das vírgulas):
                    </Text>
                    <View style={styles.codeBlock}>
                        <Text style={styles.codeText}>id,exercise_name,gif_url</Text>
                        <Text style={styles.codeText}>5,"Flexão Declinada",https://...</Text>
                    </View>
                    <Text style={styles.footerText}>
                        Dica: Use o CSV gerado pelo Auto-Fetch como base.
                    </Text>
                </View>

                {importing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Processando CSV...</Text>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handlePickDocument}>
                        <Text style={styles.buttonText}>Selecionar Arquivo CSV</Text>
                    </TouchableOpacity>
                )}

                {results && (
                    <View style={styles.resultsCard}>
                        <Text style={styles.resultsTitle}>Último Resultado</Text>
                        <Text style={styles.resultItem}>Sucessos: {results.updated}</Text>
                        <Text style={styles.resultItem}>Erros: {results.errors}</Text>
                        <Text style={styles.resultItem}>Total processado: {results.total}</Text>
                    </View>
                )}
            </ScrollView>
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
    backText: {
        ...typography.body,
        color: colors.primary,
        marginBottom: spacing.sm,
    },
    title: {
        ...typography.h1,
        color: colors.text,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
    },
    cardTitle: {
        ...typography.h3,
        color: colors.text,
        marginBottom: spacing.md,
    },
    text: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: spacing.md,
    },
    codeBlock: {
        backgroundColor: colors.background,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
    },
    codeText: {
        color: colors.primary,
        fontFamily: 'monospace',
        fontSize: 12,
    },
    footerText: {
        ...typography.caption,
        color: colors.textMuted,
        fontStyle: 'italic',
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        alignItems: 'center',
    },
    buttonText: {
        ...typography.h3,
        color: colors.text,
    },
    loadingContainer: {
        alignItems: 'center',
        padding: spacing.xl,
    },
    loadingText: {
        ...typography.body,
        color: colors.text,
        marginTop: spacing.md,
    },
    resultsCard: {
        marginTop: spacing.xl,
        borderTopWidth: 1,
        borderTopColor: colors.surfaceLight,
        paddingTop: spacing.lg,
    },
    resultsTitle: {
        ...typography.h3,
        color: colors.text,
        marginBottom: spacing.md,
    },
    resultItem: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
});
