import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ======================================
// TABELAS PRINCIPAIS
// ======================================

// Grupos Musculares (Peito, Costas, Pernas, etc.)
export const muscleGroups = sqliteTable('muscle_groups', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    imageUrl: text('image_url'),
    icon: text('icon'), // Emoji ou nome de ícone
});

export const muscleGroupsRelations = relations(muscleGroups, ({ many }) => ({
    subMuscles: many(subMuscles),
    exercises: many(exercises),
}));

// Submúsculos (Peitoral Superior, Grande Dorsal, etc.)
export const subMuscles = sqliteTable('sub_muscles', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    groupId: integer('group_id').references(() => muscleGroups.id),
    name: text('name').notNull(),
    description: text('description'),
});

export const subMusclesRelations = relations(subMuscles, ({ one, many }) => ({
    group: one(muscleGroups, {
        fields: [subMuscles.groupId],
        references: [muscleGroups.id],
    }),
    exerciseTargets: many(exerciseTargets),
}));

// Equipamentos (Halteres, Barra, Máquina, etc.)
export const equipments = sqliteTable('equipments', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    icon: text('icon'),
});

export const equipmentsRelations = relations(equipments, ({ many }) => ({
    exerciseEquipments: many(exerciseEquipments),
}));

// Exercícios
export const exercises = sqliteTable('exercises', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    mediaUrl: text('media_url'),
    instructions: text('instructions'), // JSON string: ["passo1", "passo2"]
    muscleGroupId: integer('muscle_group_id').references(() => muscleGroups.id),
});

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
    muscleGroup: one(muscleGroups, {
        fields: [exercises.muscleGroupId],
        references: [muscleGroups.id],
    }),
    targets: many(exerciseTargets),
    equipments: many(exerciseEquipments),
}));

// ======================================
// TABELAS PIVOT (N:N)
// ======================================

// Exercício <-> Submúsculo (target_type: primary, secondary, stabilizer)
export const exerciseTargets = sqliteTable('exercise_targets', {
    exerciseId: integer('exercise_id').references(() => exercises.id),
    subMuscleId: integer('sub_muscle_id').references(() => subMuscles.id),
    targetType: text('target_type').default('primary'),
});

export const exerciseTargetsRelations = relations(exerciseTargets, ({ one }) => ({
    exercise: one(exercises, {
        fields: [exerciseTargets.exerciseId],
        references: [exercises.id],
    }),
    subMuscle: one(subMuscles, {
        fields: [exerciseTargets.subMuscleId],
        references: [subMuscles.id],
    }),
}));

// Exercício <-> Equipamento
export const exerciseEquipments = sqliteTable('exercise_equipments', {
    exerciseId: integer('exercise_id').references(() => exercises.id),
    equipmentId: integer('equipment_id').references(() => equipments.id),
});

export const exerciseEquipmentsRelations = relations(exerciseEquipments, ({ one }) => ({
    exercise: one(exercises, {
        fields: [exerciseEquipments.exerciseId],
        references: [exercises.id],
    }),
    equipment: one(equipments, {
        fields: [exerciseEquipments.equipmentId],
        references: [equipments.id],
    }),
}));