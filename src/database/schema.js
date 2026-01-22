import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
    version: 1,
    tables: [
        // 1. Tabela de Grupos Musculares [cite: 42]
        tableSchema({
            name: 'muscle_groups',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'slug', type: 'string', isIndexed: true }, // Indexado para busca rápida
                { name: 'image_url', type: 'string', isOptional: true },
            ]
        }),
        // 2. Tabela de Submúsculos [cite: 49]
        tableSchema({
            name: 'sub_muscles',
            columns: [
                { name: 'group_id', type: 'string', isIndexed: true }, // FK para muscle_groups
                { name: 'name', type: 'string' },
                { name: 'description', type: 'string', isOptional: true },
            ]
        }),
        // 3. Tabela de Equipamentos [cite: 56]
        tableSchema({
            name: 'equipments',
            columns: [
                { name: 'name', type: 'string' },
            ]
        }),
        // 4. A Tabela Principal: Exercícios [cite: 61]
        tableSchema({
            name: 'exercises',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'media_url', type: 'string', isOptional: true },
                { name: 'instructions', type: 'string', isOptional: true }, // Armazenaremos o JSONB como string
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' }, // Crítico para Sync [cite: 67]
            ]
        }),
        // 5. Pivot: Exercício <-> Músculo (ExerciseTargets) [cite: 70]
        tableSchema({
            name: 'exercise_targets',
            columns: [
                { name: 'exercise_id', type: 'string', isIndexed: true },
                { name: 'sub_muscle_id', type: 'string', isIndexed: true },
                { name: 'type', type: 'string' }, // 'primary', 'secondary', 'stabilizer'
            ]
        }),
        // 6. Pivot: Exercício <-> Equipamento (ExerciseEquipments) [cite: 77]
        tableSchema({
            name: 'exercise_equipments',
            columns: [
                { name: 'exercise_id', type: 'string', isIndexed: true },
                { name: 'equipment_id', type: 'string', isIndexed: true },
            ]
        }),
    ]
})