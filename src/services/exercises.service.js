import { db } from '../database/db';
import { exercises, subMuscles } from '../database/schema';
import { eq } from 'drizzle-orm';

export const getSubMusclesByGroup = async (muscleGroupId) => {
    try {
        const data = await db.query.subMuscles.findMany({
            where: eq(subMuscles.groupId, muscleGroupId),
        });
        return data;
    } catch (error) {
        console.error('Error in getSubMusclesByGroup:', error);
        throw error;
    }
};

export const getExercisesBySubMuscle = async (subMuscleId) => {
    try {
        const targets = await db.query.exerciseTargets.findMany({
            where: (target, { eq }) => eq(target.subMuscleId, subMuscleId),
            with: {
                exercise: {
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
                }
            }
        });
        // Map to return just the exercises
        return targets.map(t => t.exercise);
    } catch (error) {
        console.error('Error in getExercisesBySubMuscle:', error);
        throw error;
    }
};

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

export const getExerciseAlternatives = async (subMuscleId, excludeExerciseId) => {
    try {
        // 1. Encontrar exercícios que tenham o mesmo sub-músculo como alvo PRIMÁRIO
        const alternatives = await db.query.exerciseTargets.findMany({
            where: (target, { eq, and }) => and(
                eq(target.subMuscleId, subMuscleId),
                eq(target.targetType, 'primary')
            ),
            with: {
                exercise: {
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
                }
            }
        });

        // 2. Filtrar o próprio exercício e formatar
        const parsedAlternatives = alternatives
            .map(a => a.exercise)
            .filter(ex => ex.id !== excludeExerciseId);

        // 3. Ordenar: Prioridade para NÃO ser peso do corpo (ID 3)
        // Se equipmentId === 3 -> Peso do corpo. Jogar para o final.
        parsedAlternatives.sort((a, b) => {
            const isBodyweightA = a.equipments.some(e => e.equipment.id === 3);
            const isBodyweightB = b.equipments.some(e => e.equipment.id === 3);

            if (isBodyweightA === isBodyweightB) return 0;
            return isBodyweightA ? 1 : -1; // Se A é bodyweight, vai para depois (1)
        });

        return parsedAlternatives;
    } catch (error) {
        console.error('Error in getExerciseAlternatives:', error);
        return [];
    }
};
