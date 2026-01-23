import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Tabela de Exercícios
export const exercises = sqliteTable('exercises', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    mediaUrl: text('media_url'),
    instructions: text('instructions'), // Vamos salvar como JSON string
    muscleGroupId: integer('muscle_group_id'), // Futuro relacionamento
});

// Tabela de Grupos Musculares
export const muscleGroups = sqliteTable('muscle_groups', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    imageUrl: text('image_url'),
});