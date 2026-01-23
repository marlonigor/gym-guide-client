import { db } from './db';
import { exercises, muscleGroups, equipments } from './schema';
import { openDatabaseSync } from 'expo-sqlite';

// SQL para criar tabelas
const createTablesSql = `
  CREATE TABLE IF NOT EXISTS muscle_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    image_url TEXT,
    icon TEXT
  );
  CREATE TABLE IF NOT EXISTS sub_muscles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER,
    name TEXT NOT NULL,
    description TEXT
  );
  CREATE TABLE IF NOT EXISTS equipments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT
  );
  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    media_url TEXT,
    instructions TEXT,
    muscle_group_id INTEGER
  );
`;

// Dados iniciais de grupos musculares
const muscleGroupsData = [
    { name: 'Peitoral', slug: 'chest', icon: '🫁' },
    { name: 'Costas', slug: 'back', icon: '🔙' },
    { name: 'Ombros', slug: 'shoulders', icon: '💪' },
    { name: 'Braços', slug: 'arms', icon: '💪' },
    { name: 'Pernas', slug: 'legs', icon: '🦵' },
    { name: 'Core', slug: 'core', icon: '🎯' },
];

// Dados iniciais de exercícios
const exercisesData = [
    // Peitoral (id: 1)
    { name: 'Supino Reto', muscleGroupId: 1, instructions: '["Deite no banco", "Segure a barra na largura dos ombros", "Desça até o peito", "Empurre para cima"]' },
    { name: 'Supino Inclinado', muscleGroupId: 1, instructions: '["Ajuste o banco para 30-45°", "Segure a barra", "Desça controladamente", "Empurre para cima"]' },
    { name: 'Flexão de Braço', muscleGroupId: 1, instructions: '["Mãos na largura dos ombros", "Corpo reto", "Desça até o chão", "Empurre para cima"]' },
    { name: 'Crucifixo', muscleGroupId: 1, instructions: '["Deite no banco com halteres", "Braços abertos", "Feche em arco", "Controle a descida"]' },

    // Costas (id: 2)
    { name: 'Puxada Alta', muscleGroupId: 2, instructions: '["Segure a barra larga", "Puxe até o peito", "Contraia as costas", "Volte controlado"]' },
    { name: 'Remada Curvada', muscleGroupId: 2, instructions: '["Incline o tronco", "Puxe a barra para o abdômen", "Contraia as escápulas", "Desça controlado"]' },
    { name: 'Remada Unilateral', muscleGroupId: 2, instructions: '["Apoie um joelho no banco", "Puxe o halter para a cintura", "Mantenha o cotovelo próximo", "Desça controlado"]' },

    // Ombros (id: 3)
    { name: 'Desenvolvimento', muscleGroupId: 3, instructions: '["Segure halteres na altura dos ombros", "Empurre para cima", "Desça controlado", "Não trave os cotovelos"]' },
    { name: 'Elevação Lateral', muscleGroupId: 3, instructions: '["Halteres ao lado do corpo", "Eleve até a linha dos ombros", "Mantenha cotovelos levemente flexionados", "Desça controlado"]' },
    { name: 'Elevação Frontal', muscleGroupId: 3, instructions: '["Halteres à frente das coxas", "Eleve até a altura dos olhos", "Mantenha os braços retos", "Desça controlado"]' },

    // Braços (id: 4)
    { name: 'Rosca Direta', muscleGroupId: 4, instructions: '["Barra na largura dos ombros", "Curl para cima", "Cotovelos fixos", "Desça controlado"]' },
    { name: 'Tríceps Corda', muscleGroupId: 4, instructions: '["Segure a corda", "Estenda os braços para baixo", "Abra no final", "Volte controlado"]' },
    { name: 'Rosca Martelo', muscleGroupId: 4, instructions: '["Halteres com pegada neutra", "Curl para cima", "Cotovelos fixos", "Desça controlado"]' },

    // Pernas (id: 5)
    { name: 'Agachamento Livre', muscleGroupId: 5, instructions: '["Barra nos trapézios", "Desça até paralelo", "Joelhos alinhados", "Suba explosivo"]' },
    { name: 'Leg Press', muscleGroupId: 5, instructions: '["Pés na plataforma", "Desça controlado", "Não trave os joelhos", "Empurre para cima"]' },
    { name: 'Stiff', muscleGroupId: 5, instructions: '["Barra à frente das coxas", "Desça mantendo as pernas retas", "Sinta o alongamento", "Suba contraindo glúteos"]' },

    // Core (id: 6)
    { name: 'Prancha', muscleGroupId: 6, instructions: '["Apoie antebraços e pés", "Corpo reto", "Contraia o abdômen", "Mantenha 30-60s"]' },
    { name: 'Abdominal Crunch', muscleGroupId: 6, instructions: '["Deite com joelhos flexionados", "Mãos atrás da cabeça", "Eleve os ombros", "Contraia o abdômen"]' },
    { name: 'Russian Twist', muscleGroupId: 6, instructions: '["Sente inclinado para trás", "Pés elevados ou no chão", "Gire o tronco lado a lado", "Segure peso opcional"]' },
];

export async function seedDatabase() {
    const expoDb = openDatabaseSync('gymguide.db');

    try {
        // 1. Criar Tabelas
        await expoDb.execAsync(createTablesSql);

        // 2. Limpar dados antigos
        await db.delete(exercises);
        await db.delete(muscleGroups);
        console.log('🧹 Banco limpo!');

        // 3. Inserir Grupos Musculares
        for (const group of muscleGroupsData) {
            await db.insert(muscleGroups).values(group);
        }
        console.log('✅ Grupos musculares inseridos!');

        // 4. Inserir Exercícios
        for (const exercise of exercisesData) {
            await db.insert(exercises).values(exercise);
        }
        console.log('✅ Exercícios inseridos!');

        console.log('🌱 Seed realizado com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro no seed:', error);
        return false;
    }
}