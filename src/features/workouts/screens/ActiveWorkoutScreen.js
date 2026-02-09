import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../../theme';
import { startWorkout, finishWorkout, addExerciseToWorkout, addSetToExercise, updateSet } from '../../../services/workout.service';
import ExerciseSelectionModal from '../../../components/ExerciseSelectionModal';

export default function ActiveWorkoutScreen({ navigation }) {
    const [workout, setWorkout] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timer, setTimer] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        initWorkout();
        startTimer();
        return () => clearInterval(timerRef.current);
    }, []);

    const initWorkout = async () => {
        try {
            const newWorkout = await startWorkout('Treino do Dia');
            setWorkout(newWorkout);
            setLoading(false);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível iniciar o treino.');
            navigation.goBack();
        }
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAddExercise = () => {
        setModalVisible(true);
    };

    const handleSelectExercise = async (selectedEx) => {
        try {
            const newEx = await addExerciseToWorkout(workout.id, selectedEx.id, exercises.length + 1);

            // Adiciona uma série inicial automaticamente
            const initialSet = await addSetToExercise(newEx.id);

            setExercises(prev => [...prev, { ...newEx, name: selectedEx.name, sets: [initialSet] }]);
        } catch (error) {
            Alert.alert('Erro', 'Falha ao adicionar exercício.');
        }
    };

    const handleAddSet = async (exIndex) => {
        try {
            const ex = exercises[exIndex];
            const newSet = await addSetToExercise(ex.id);
            const updatedExercises = [...exercises];
            updatedExercises[exIndex].sets.push(newSet);
            setExercises(updatedExercises);
        } catch (error) {
            Alert.alert('Erro', 'Falha ao adicionar série.');
        }
    };

    const handleUpdateSet = async (exIndex, setIndex, data) => {
        try {
            const setId = exercises[exIndex].sets[setIndex].id;
            await updateSet(setId, data);

            const updatedExercises = [...exercises];
            updatedExercises[exIndex].sets[setIndex] = {
                ...updatedExercises[exIndex].sets[setIndex],
                ...data
            };
            setExercises(updatedExercises);
        } catch (error) {
            console.error('Update set error:', error);
        }
    };

    const handleFinish = async () => {
        Alert.alert(
            'Finalizar Treino',
            'Deseja salvar esta sessão?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sim, Finalizar',
                    onPress: async () => {
                        await finishWorkout(workout.id);
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    if (loading) return <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>{workout.name}</Text>
                    <Text style={styles.timer}>{formatTime(timer)}</Text>
                </View>
                <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
                    <Text style={styles.finishButtonText}>Finalizar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                {exercises.map((ex, exIdx) => (
                    <View key={ex.id} style={styles.exerciseCard}>
                        <Text style={styles.exerciseName}>{ex.name}</Text>

                        <View style={styles.setsHeader}>
                            <Text style={[styles.setHeaderText, { width: 40 }]}>Série</Text>
                            <Text style={[styles.setHeaderText, { flex: 1 }]}>Peso (kg)</Text>
                            <Text style={[styles.setHeaderText, { flex: 1 }]}>Reps</Text>
                            <Text style={[styles.setHeaderText, { width: 40 }]}>V</Text>
                        </View>

                        {ex.sets.map((set, setIdx) => (
                            <View key={set.id} style={styles.setRow}>
                                <Text style={styles.setNumber}>{setIdx + 1}</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder="0"
                                    placeholderTextColor={colors.textMuted}
                                    onChangeText={(val) => handleUpdateSet(exIdx, setIdx, { weight: parseInt(val) || 0 })}
                                />
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder="0"
                                    placeholderTextColor={colors.textMuted}
                                    onChangeText={(val) => handleUpdateSet(exIdx, setIdx, { reps: parseInt(val) || 0 })}
                                />
                                <TouchableOpacity
                                    style={[styles.checkButton, set.isCompleted && styles.checkButtonActive]}
                                    onPress={() => handleUpdateSet(exIdx, setIdx, { isCompleted: !set.isCompleted })}
                                >
                                    <Text style={styles.checkText}>{set.isCompleted ? '✓' : ''}</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        <TouchableOpacity style={styles.addSetButton} onPress={() => handleAddSet(exIdx)}>
                            <Text style={styles.addSetText}>+ Adicionar Série</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity style={styles.addExerciseButton} onPress={handleAddExercise}>
                    <Text style={styles.addExerciseText}>+ Adicionar Exercício</Text>
                </TouchableOpacity>
            </ScrollView>

            <ExerciseSelectionModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSelect={handleSelectExercise}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: colors.surface
    },
    title: { ...typography.h2, color: colors.text },
    timer: { ...typography.body, color: colors.primary, fontWeight: 'bold' },
    finishButton: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: borderRadius.sm },
    finishButtonText: { ...typography.body, color: colors.text, fontWeight: 'bold' },
    scroll: { padding: spacing.md },
    exerciseCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md },
    exerciseName: { ...typography.h3, color: colors.primary, marginBottom: spacing.md },
    setsHeader: { flexDirection: 'row', marginBottom: spacing.sm },
    setHeaderText: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
    setRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
    setNumber: { width: 40, textAlign: 'center', color: colors.textSecondary, ...typography.body },
    input: { flex: 1, backgroundColor: colors.background, borderRadius: borderRadius.sm, paddingHorizontal: 8, height: 35, color: colors.text, textAlign: 'center' },
    checkButton: { width: 40, height: 35, borderRadius: borderRadius.sm, backgroundColor: colors.surfaceLight, justifyContent: 'center', alignItems: 'center' },
    checkButtonActive: { backgroundColor: colors.success },
    checkText: { color: colors.text, fontWeight: 'bold' },
    addSetButton: { marginTop: spacing.sm, paddingVertical: 8, alignItems: 'center' },
    addSetText: { ...typography.body, color: colors.textSecondary, fontSize: 13 },
    addExerciseButton: { backgroundColor: colors.surfaceLight, padding: spacing.lg, borderRadius: borderRadius.lg, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: colors.textSecondary },
    addExerciseText: { ...typography.h3, color: colors.textSecondary }
});
