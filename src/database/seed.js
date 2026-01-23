import { db } from './db';
import { exercises, muscleGroups } from './schema';
import { openDatabaseSync } from 'expo-sqlite';

// SQL para criar tabelas manualmente (Garante que existem)
const createTablesSql = `
  CREATE TABLE IF NOT EXISTS muscle_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image_url TEXT
  );
  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    media_url TEXT,
    instructions TEXT,
    muscle_group_id INTEGER
  );
`;

export async function seedDatabase() {
    const expoDb = openDatabaseSync('gymguide.db');

    try {
        // 1. Criar Tabelas
        await expoDb.execAsync(createTablesSql);

        // 2. Limpar dados antigos (Reset)
        await db.delete(exercises);
        await db.delete(muscleGroups);

        console.log('🧹 Banco limpo!');

        // 3. Inserir Grupos Musculares
        const peito = await db.insert(muscleGroups).values({
            name: 'Peitoral',
            imageUrl: 'https://example.com/chest.png'
        }).returning(); // Retorna o dado criado para pegarmos o ID

        const costas = await db.insert(muscleGroups).values({
            name: 'Dorsal',
            imageUrl: 'https://example.com/back.png'
        }).returning();

        // 4. Inserir Exercícios
        await db.insert(exercises).values([
            {
                name: 'Supino Reto',
                mediaUrl: 'https://media.giphy.com/supino.gif',
                instructions: JSON.stringify(['Deite no banco', 'Empurre a barra']),
                muscleGroupId: peito[0].id
            },
            {
                name: 'Flexão de Braço',
                mediaUrl: 'https://media.giphy.com/pushup.gif',
                instructions: JSON.stringify(['Mãos no chão', 'Desça o corpo']),
                muscleGroupId: peito[0].id
            },
            {
                name: 'Puxada Alta',
                mediaUrl: 'https://media.giphy.com/pullup.gif',
                instructions: JSON.stringify(['Puxe a barra até o peito']),
                muscleGroupId: costas[0].id
            }
        ]);

        console.log('🌱 Seed realizado com sucesso!');
        return true;
    } catch (error) {
        console.error('Erro no seed:', error);
        return false;
    }
}