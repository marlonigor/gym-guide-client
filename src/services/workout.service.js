import { db } from '../database/db';
import { workouts, workoutExercises, workoutSets } from '../database/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * Inicia uma nova sessão de treino
 */
export const startWorkout = async (name = 'Novo Treino') => {
    try {
        const result = await db.insert(workouts).values({
            name,
            date: new Date().toISOString(),
            startTime: new Date().toLocaleTimeString(),
            status: 'ongoing'
        }).returning();
        return result[0];
    } catch (error) {
        console.error('Error starting workout:', error);
        throw error;
    }
};

/**
 * Adiciona um exercício a um treino ativo
 */
export const addExerciseToWorkout = async (workoutId, exerciseId, order) => {
    try {
        const result = await db.insert(workoutExercises).values({
            workoutId,
            exerciseId,
            order
        }).returning();
        return result[0];
    } catch (error) {
        console.error('Error adding exercise to workout:', error);
        throw error;
    }
};

/**
 * Adiciona uma série (set) a um exercício de um treino
 */
export const addSetToExercise = async (workoutExerciseId) => {
    try {
        const result = await db.insert(workoutSets).values({
            workoutExerciseId,
            reps: 0,
            weight: 0,
            isCompleted: false
        }).returning();
        return result[0];
    } catch (error) {
        console.error('Error adding set:', error);
        throw error;
    }
};

/**
 * Atualiza os dados de uma série
 */
export const updateSet = async (setId, data) => {
    try {
        await db.update(workoutSets)
            .set(data)
            .where(eq(workoutSets.id, setId));
        return true;
    } catch (error) {
        console.error('Error updating set:', error);
        throw error;
    }
};

/**
 * Finaliza um treino
 */
export const finishWorkout = async (workoutId, status = 'completed') => {
    try {
        await db.update(workouts)
            .set({
                status,
                endTime: new Date().toLocaleTimeString()
            })
            .where(eq(workouts.id, workoutId));
        return true;
    } catch (error) {
        console.error('Error finishing workout:', error);
        throw error;
    }
};

/**
 * Busca o histórico de treinos ordenado por data
 */
export const getWorkoutHistory = async () => {
    try {
        return await db.query.workouts.findMany({
            orderBy: [desc(workouts.date)],
            with: {
                workoutExercises: {
                    with: {
                        exercise: true,
                        sets: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        throw error;
    }
};
