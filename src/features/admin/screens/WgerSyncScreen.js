import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert, TextInput } from 'react-native';
import { db } from '../../../database/db';
import { exercises } from '../../../database/schema';
import { eq } from 'drizzle-orm';
import { fetchWgerExercises, fetchWgerExerciseDetail } from '../../../services/wger.service';
import { downloadAndCacheMedia } from '../../../services/media.service';
import { colors, spacing, borderRadius, typography } from '../../../theme';

export default function WgerSyncScreen({ navigation }) {
    const [myExercises, setMyExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncingId, setSyncingId] = useState(null);
    const [wgerResults, setWgerResults] = useState({}); // Agora mapeado por ID do exercício { [exId]: results[] }
    const [exerciseQueries, setExerciseQueries] = useState({}); // Busca por exercício
    const [isSearching, setIsSearching] = useState(null);
    const [downloadingAll, setDownloadingAll] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });

    useEffect(() => {
        loadMyExercises();
    }, []);

    const loadMyExercises = async () => {
        try {
            const data = await db.select().from(exercises);
            setMyExercises(data);
        } catch (error) {
            console.error('Error loading exercises:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchWger = async (ex) => {
        const query = (exerciseQueries[ex.id] || ex.name).trim();
        if (!query) {
            Alert.alert('Aviso', 'Digite um nome para buscar.');
            return;
        }

        try {
            setIsSearching(ex.id);
            const data = await fetchWgerExercises();
            const filtered = data.results.filter(apiEx =>
                apiEx.name && apiEx.name.toLowerCase().includes(query.toLowerCase())
            );

            setWgerResults(prev => ({ ...prev, [ex.id]: filtered }));
            setSyncingId(ex.id);
        } catch (error) {
            console.error('Search error:', error);
            Alert.alert('Erro', 'Não foi possível buscar na wger.');
        } finally {
            setIsSearching(null);
        }
    };

    const handleSync = async (myEx, wgerEx) => {
        try {
            setSyncingId(myEx.id);
            const detail = await fetchWgerExerciseDetail(wgerEx.id);

            await db.update(exercises)
                .set({
                    wgerId: wgerEx.id || null,
                    wgerDescription: detail.description || null,
                    muscleMapping: JSON.stringify({
                        primary: detail.muscles || [],
                        secondary: detail.muscles_secondary || []
                    })
                })
                .where(eq(exercises.id, myEx.id));

            setWgerResults(prev => {
                const updated = { ...prev };
                delete updated[myEx.id];
                return updated;
            });

            Alert.alert('Sucesso', `${myEx.name} sincronizado!`);
            loadMyExercises();
        } catch (error) {
            console.error('Sync error:', error);
            Alert.alert('Erro', 'Falha ao sincronizar dados.');
        } finally {
            setSyncingId(null);
        }
    };

    const handleDownloadAll = async () => {
        const toDownload = myExercises.filter(ex => ex.mediaUrl);
        if (toDownload.length === 0) {
            Alert.alert('Aviso', 'Nenhum exercício com mídia para baixar.');
            return;
        }

        setDownloadingAll(true);
        setDownloadProgress({ current: 0, total: toDownload.length });

        let count = 0;
        for (const ex of toDownload) {
            try {
                await downloadAndCacheMedia(ex.mediaUrl);
                count++;
                setDownloadProgress({ current: count, total: toDownload.length });
            } catch (err) {
                console.error('Download error for', ex.name, err);
            }
        }

        setDownloadingAll(false);
        Alert.alert('Sucesso', `${count} mídias baixadas para uso offline!`);
    };

    const renderExerciseItem = ({ item }) => {
        const isActive = syncingId === item.id;
        const searchingThis = isSearching === item.id;
        const results = wgerResults[item.id] || [];

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    {item.wgerId ? (
                        <Text style={styles.syncedBadge}>✓ Sync</Text>
                    ) : (
                        <Text style={styles.pendingBadge}>Pendente</Text>
                    )}
                </View>

                <View style={styles.searchRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome na wger..."
                        placeholderTextColor={colors.textMuted}
                        defaultValue={item.name}
                        onChangeText={(txt) => setExerciseQueries(prev => ({ ...prev, [item.id]: txt }))}
                    />
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={() => handleSearchWger(item)}
                        disabled={searchingThis || syncingId === item.id && !wgerResults[item.id]}
                    >
                        {searchingThis ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <Text style={styles.buttonText}>🔍</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {isActive && results.length > 0 && !searchingThis && (
                    <View style={styles.resultsContainer}>
                        {results.slice(0, 3).map(wger => (
                            <TouchableOpacity
                                key={wger.id}
                                style={styles.resultItem}
                                onPress={() => handleSync(item, wger)}
                            >
                                <Text style={styles.resultText}>{wger.name}</Text>
                                <Text style={styles.linkText}>Vincular</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={styles.closeResults}
                            onPress={() => {
                                setSyncingId(null);
                                setWgerResults(prev => {
                                    const next = { ...prev };
                                    delete next[item.id];
                                    return next;
                                });
                            }}
                        >
                            <Text style={styles.closeResultsText}>Fechar busca</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {isActive && searchingThis && <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 10 }} />}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Sincronizar wger</Text>
                <View style={styles.subtitleRow}>
                    <Text style={styles.subtitle}>Enriqueça os exercícios com dados globais</Text>
                    <TouchableOpacity
                        style={[styles.downloadAllButton, downloadingAll && styles.disabledButton]}
                        onPress={handleDownloadAll}
                        disabled={downloadingAll || loading}
                    >
                        {downloadingAll ? (
                            <Text style={styles.downloadButtonText}>
                                {downloadProgress.current}/{downloadProgress.total} ⏳
                            </Text>
                        ) : (
                            <Text style={styles.downloadButtonText}>📥 Baixar Tudo</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={myExercises}
                    renderItem={renderExerciseItem}
                    keyExtractor={item => item.id.toString()}
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
        paddingTop: 60,
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
    subtitle: {
        ...typography.caption,
        color: colors.textSecondary,
        flex: 1,
    },
    subtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    downloadAllButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    disabledButton: {
        backgroundColor: colors.surfaceLight,
    },
    downloadButtonText: {
        ...typography.small,
        color: colors.text,
        fontWeight: 'bold',
    },
    list: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    cardTitle: {
        ...typography.h3,
        color: colors.text,
        flex: 1,
    },
    syncedBadge: {
        ...typography.small,
        color: colors.success,
        backgroundColor: colors.success + '20',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    pendingBadge: {
        ...typography.small,
        color: colors.warning,
        backgroundColor: colors.warning + '20',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    searchRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    input: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.md,
        height: 40,
        color: colors.text,
        ...typography.body,
    },
    searchButton: {
        backgroundColor: colors.surfaceLight,
        width: 40,
        height: 40,
        borderRadius: borderRadius.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
    },
    resultsContainer: {
        marginTop: spacing.sm,
        backgroundColor: colors.background,
        borderRadius: borderRadius.sm,
        overflow: 'hidden',
    },
    resultItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceLight,
    },
    resultText: {
        ...typography.body,
        color: colors.text,
        fontSize: 14,
    },
    linkText: {
        ...typography.body,
        color: colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    closeResults: {
        padding: spacing.sm,
        alignItems: 'center',
        backgroundColor: colors.surfaceLight,
    },
    closeResultsText: {
        ...typography.small,
        color: colors.textSecondary,
    }
});
