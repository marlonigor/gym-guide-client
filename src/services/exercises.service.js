import { db } from '../database/db';
import { exercises } from '../database/schema';
import { eq } from 'drizzle-orm';

export const getExercisesByMuscleGroup = async (muscleGroupId) => {
    try {
        const data = await db.query.exercises.findMany({
            where: eq(exercises.muscleGroupId, muscleGroupId),
            with: {
                equipments: {
                    with: {
                        equipment: true
                    }
                },
                targets: {
                    with: {
                        subMuscle: true
                    }
                }
            }
        });
        return data;
    } catch (error) {
        console.error('Error in getExercisesByMuscleGroup:', error);
        throw error;
    }
};

export const getExerciseDetails = async (exerciseId) => {
    try {
        const data = await db.query.exercises.findFirst({
            where: eq(exercises.id, exerciseId),
            with: {
                muscleGroup: true,
                equipments: {
                    with: {
                        equipment: true
                    }
                },
                targets: {
                    with: {
                        subMuscle: true
                    }
                }
            }
        });
        return data;
    } catch (error) {
        console.error('Error in getExerciseDetails:', error);
        throw error;
    }
};
