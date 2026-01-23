import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

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

// Submúsculos (Peitoral Superior, Grande Dorsal, etc.)
export const subMuscles = sqliteTable('sub_muscles', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    groupId: integer('group_id').references(() => muscleGroups.id),
    name: text('name').notNull(),
    description: text('description'),
});

// Equipamentos (Halteres, Barra, Máquina, etc.)
export const equipments = sqliteTable('equipments', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    icon: text('icon'),
});

// Exercícios
export const exercises = sqliteTable('exercises', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    mediaUrl: text('media_url'),
    instructions: text('instructions'), // JSON string: ["passo1", "passo2"]
    muscleGroupId: integer('muscle_group_id').references(() => muscleGroups.id),
});

// ======================================
// TABELAS PIVOT (N:N) - Para V2
// ======================================

// Exercício <-> Submúsculo (target_type: primary, secondary, stabilizer)
export const exerciseTargets = sqliteTable('exercise_targets', {
    exerciseId: integer('exercise_id').references(() => exercises.id),
    subMuscleId: integer('sub_muscle_id').references(() => subMuscles.id),
    targetType: text('target_type').default('primary'),
});

// Exercício <-> Equipamento
export const exerciseEquipments = sqliteTable('exercise_equipments', {
    exerciseId: integer('exercise_id').references(() => exercises.id),
    equipmentId: integer('equipment_id').references(() => equipments.id),
});