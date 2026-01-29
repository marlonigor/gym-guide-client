import { db, expoDb } from './db';
import { exercises, muscleGroups, equipments, subMuscles, exerciseTargets, exerciseEquipments } from './schema';

// SQL para criar tabelas (Alinhado com schema.js)
const createTablesSql = `
  DROP TABLE IF EXISTS exercise_equipments;
  DROP TABLE IF EXISTS exercise_targets;
  DROP TABLE IF EXISTS exercises;
  DROP TABLE IF EXISTS sub_muscles;
  DROP TABLE IF EXISTS equipments;
  DROP TABLE IF EXISTS muscle_groups;

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
    description TEXT,
    FOREIGN KEY (group_id) REFERENCES muscle_groups (id)
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
    muscle_group_id INTEGER,
    FOREIGN KEY (muscle_group_id) REFERENCES muscle_groups (id)
  );

  CREATE TABLE IF NOT EXISTS exercise_targets (
    exercise_id INTEGER,
    sub_muscle_id INTEGER,
    target_type TEXT DEFAULT 'primary',
    FOREIGN KEY (exercise_id) REFERENCES exercises (id),
    FOREIGN KEY (sub_muscle_id) REFERENCES sub_muscles (id)
  );

  CREATE TABLE IF NOT EXISTS exercise_equipments (
    exercise_id INTEGER,
    equipment_id INTEGER,
    FOREIGN KEY (exercise_id) REFERENCES exercises (id),
    FOREIGN KEY (equipment_id) REFERENCES equipments (id)
  );
`;

// -- DADOS MOCKADOS --

const muscleGroupsData = [
  { id: 1, name: 'Peitoral', slug: 'chest', icon: '🫁' },
  { id: 2, name: 'Costas', slug: 'back', icon: '🔙' },
  { id: 3, name: 'Ombros', slug: 'shoulders', icon: '💪' },
  { id: 4, name: 'Bíceps', slug: 'biceps', icon: '💪' },
  { id: 5, name: 'Tríceps', slug: 'triceps', icon: '💪' },
  { id: 6, name: 'Pernas', slug: 'legs', icon: '🦵' },
  { id: 7, name: 'Core', slug: 'core', icon: '🎯' },
  { id: 8, name: 'Outros', slug: 'others', icon: '➕' },
];

const subMusclesData = [
  // 1. Peitoral
  { id: 101, groupId: 1, name: 'Peitoral Superior', description: '' },
  { id: 102, groupId: 1, name: 'Peitoral Médio', description: '' },
  { id: 103, groupId: 1, name: 'Peitoral Inferior', description: '' },

  // 2. Costas
  { id: 201, groupId: 2, name: 'Dorsal', description: '' },
  { id: 202, groupId: 2, name: 'Meio das costas', description: '' },
  { id: 203, groupId: 2, name: 'Lombar', description: '' },

  // 3. Ombros
  { id: 301, groupId: 3, name: 'Ombro Frontal', description: '' },
  { id: 302, groupId: 3, name: 'Ombro Lateral', description: '' },
  { id: 303, groupId: 3, name: 'Ombro Posterior', description: '' },

  // 4. Bíceps
  { id: 401, groupId: 4, name: 'Bíceps Cabeça Longa', description: '' },
  { id: 402, groupId: 4, name: 'Bíceps Cabeça Curta', description: '' },
  { id: 403, groupId: 4, name: 'Braquial', description: '' },

  // 5. Tríceps
  { id: 501, groupId: 5, name: 'Tríceps Cabeça Longa', description: '' },
  { id: 502, groupId: 5, name: 'Tríceps Cabeça Lateral', description: '' },
  { id: 503, groupId: 5, name: 'Tríceps Cabeça Medial', description: '' },

  // 6. Pernas
  { id: 601, groupId: 6, name: 'Quadríceps', description: '' },
  { id: 602, groupId: 6, name: 'Posterior de Coxa', description: '' },
  { id: 603, groupId: 6, name: 'Glúteos', description: '' },
  { id: 604, groupId: 6, name: 'Panturrilhas', description: '' },

  // 7. Core
  { id: 701, groupId: 7, name: 'Abdômen Superior', description: '' },
  { id: 702, groupId: 7, name: 'Abdômen Inferior', description: '' },
  { id: 703, groupId: 7, name: 'Oblíquos', description: '' },
  { id: 704, groupId: 7, name: 'Lombar', description: '' },

  // 8. Outros
  { id: 801, groupId: 8, name: 'Trapézio', description: '' },
  { id: 802, groupId: 8, name: 'Antebraço', description: '' },
  { id: 803, groupId: 8, name: 'Adutores', description: '' },
  { id: 804, groupId: 8, name: 'Abdutores', description: '' },
  { id: 805, groupId: 8, name: 'Pescoço', description: '' },
];

const equipmentsData = [
  { id: 1, name: 'Barra', icon: '🏋️' },
  { id: 2, name: 'Halteres', icon: 'dumbbell' },
  { id: 3, name: 'Peso do Corpo', icon: 'human' },
  { id: 4, name: 'Polia', icon: 'cable' },
  { id: 5, name: 'Máquina', icon: 'machine' },
];

const exercisesData = [
  // Peitoral
  { id: 1, name: 'Supino Inclinado (Halteres)', muscleGroupId: 1, instructions: '["Banco 45 graus", "Empurre halteres para cima"]' },
  { id: 2, name: 'Supino Reto (Barra)', muscleGroupId: 1, instructions: '["Deite no banco", "Segure a barra", "Desça até o peito", "Empurre"]' },
  { id: 3, name: 'Crossover (Polia)', muscleGroupId: 1, instructions: '["Puxe as polias para baixo", "Contraia o peito"]' },
  { id: 4, name: 'Supino Inclinado (Máquina)', muscleGroupId: 1, instructions: '["Ajuste o assento", "Empurre a máquina"]' }, // NEW: Alternative for 101
  { id: 5, name: 'Flexão Declinada', muscleGroupId: 1, instructions: '["Pés elevados", "Mãos no chão", "Flexione"]' }, // NEW: Bodyweight Alternative for 101/102

  // Costas
  { id: 6, name: 'Puxada Alta (Barra Fixa)', muscleGroupId: 2, instructions: '["Pendure-se", "Puxe o corpo até o queixo passar da barra"]' },
  { id: 7, name: 'Remada Curvada', muscleGroupId: 2, instructions: '["Incline o tronco", "Puxe a barra até o umbigo"]' },
  { id: 8, name: 'Puxada Frente (Polia)', muscleGroupId: 2, instructions: '["Puxe a barra até o peito"]' }, // NEW: Alternative for 201

  // Ombros
  { id: 9, name: 'Elevação Lateral', muscleGroupId: 3, instructions: '["Eleve os braços lateralmente"]' },
  { id: 10, name: 'Desenvolvimento (Halteres)', muscleGroupId: 3, instructions: '["Empurre os halteres para cima"]' }, // NEW for 301

  // Bíceps
  { id: 11, name: 'Rosca Direta (Barra)', muscleGroupId: 4, instructions: '["Segure a barra", "Flexione os cotovelos"]' },
  { id: 12, name: 'Rosca Martelo', muscleGroupId: 4, instructions: '["Pegada neutra", "Flexione"]' }, // NEW for 403

  // Tríceps
  { id: 13, name: 'Tríceps Corda', muscleGroupId: 5, instructions: '["Estenda o cotovelo"]' },
  { id: 14, name: 'Tríceps Testa', muscleGroupId: 5, instructions: '["Deitado", "Flexione cotovelos até a testa"]' }, // NEW for 501

  // Pernas
  { id: 15, name: 'Agachamento Livre', muscleGroupId: 6, instructions: '["Desça o quadril", "Mantenha postura"]' },
  { id: 16, name: 'Leg Press 45', muscleGroupId: 6, instructions: '["Empurre a plataforma"]' }, // NEW for 601
  { id: 17, name: 'Cadeira Extensora', muscleGroupId: 6, instructions: '["Estenda os joelhos"]' }, // NEW for 601

  // Outros (Trapézio, Antebraço)
  { id: 18, name: 'Encolhimento (Halteres)', muscleGroupId: 8, instructions: '["Eleve os ombros"]' }, // NEW for 801
  { id: 19, name: 'Rosca Punho', muscleGroupId: 8, instructions: '["Apoie o braço", "Flexione o punho"]' }, // NEW for 802
];

// Pivot: Exercício <-> Equipamento
const exerciseEquipmentsData = [
  { exerciseId: 1, equipmentId: 2 },
  { exerciseId: 2, equipmentId: 1 },
  { exerciseId: 3, equipmentId: 4 },
  { exerciseId: 4, equipmentId: 5 }, // Maquina
  { exerciseId: 5, equipmentId: 3 }, // Peso corpo

  { exerciseId: 6, equipmentId: 3 }, // Barra fixa = Peso corpo
  { exerciseId: 7, equipmentId: 1 },
  { exerciseId: 8, equipmentId: 4 },

  { exerciseId: 9, equipmentId: 2 },
  { exerciseId: 10, equipmentId: 2 },

  { exerciseId: 11, equipmentId: 1 },
  { exerciseId: 12, equipmentId: 2 },

  { exerciseId: 13, equipmentId: 4 },
  { exerciseId: 14, equipmentId: 1 },

  { exerciseId: 15, equipmentId: 1 },
  { exerciseId: 16, equipmentId: 5 },
  { exerciseId: 17, equipmentId: 5 },

  { exerciseId: 18, equipmentId: 2 },
  { exerciseId: 19, equipmentId: 1 },
];

// Pivot: Exercício <-> SubMúsculos
const exerciseTargetsData = [
  // Peitoral Superior (101)
  { exerciseId: 1, subMuscleId: 101, targetType: 'primary' }, // Supino Inc Halteres
  { exerciseId: 4, subMuscleId: 101, targetType: 'primary' }, // Supino Inc Maquina
  { exerciseId: 5, subMuscleId: 101, targetType: 'primary' }, // Flexão Declinada (Targeting upper chest mostly)

  // Peitoral Médio (102)
  { exerciseId: 2, subMuscleId: 102, targetType: 'primary' }, // Supino Reto

  // Peitoral Inferior (103)
  { exerciseId: 3, subMuscleId: 103, targetType: 'primary' }, // Crossover

  // Dorsal (201)
  { exerciseId: 6, subMuscleId: 201, targetType: 'primary' }, // Barra Fixa
  { exerciseId: 8, subMuscleId: 201, targetType: 'primary' }, // Puxada Polia

  // Meio Costas (202)
  { exerciseId: 7, subMuscleId: 202, targetType: 'primary' }, // Remada Curvada

  // Ombro Frontal (301)
  { exerciseId: 10, subMuscleId: 301, targetType: 'primary' }, // Desenv.

  // Ombro Lateral (302)
  { exerciseId: 9, subMuscleId: 302, targetType: 'primary' }, // Elev. Lateral

  // Bíceps (401 - Longa, 403 - Braquial)
  { exerciseId: 11, subMuscleId: 401, targetType: 'primary' }, // Rosca Direta
  { exerciseId: 12, subMuscleId: 403, targetType: 'primary' }, // Rosca Martelo

  // Tríceps
  { exerciseId: 13, subMuscleId: 502, targetType: 'primary' }, // Corda -> Lateral
  { exerciseId: 14, subMuscleId: 501, targetType: 'primary' }, // Testa -> Longa

  // Quadríceps (601)
  { exerciseId: 15, subMuscleId: 601, targetType: 'primary' }, // Agachamento
  { exerciseId: 16, subMuscleId: 601, targetType: 'primary' }, // Leg Press
  { exerciseId: 17, subMuscleId: 601, targetType: 'primary' }, // Extensora

  // Outros
  { exerciseId: 18, subMuscleId: 801, targetType: 'primary' }, // Trapézio
  { exerciseId: 19, subMuscleId: 802, targetType: 'primary' }, // Antebraço
];

export async function seedDatabase() {
  try {
    console.log('⏳ Iniciando Seed...');

    // 1. Criar Tabelas
    await expoDb.execAsync(createTablesSql);

    console.log('🧹 Tabelas recriadas!');

    // 3. Inserir Dados Base
    await db.insert(muscleGroups).values(muscleGroupsData);
    await db.insert(subMuscles).values(subMusclesData);
    await db.insert(equipments).values(equipmentsData);
    console.log('✅ Dados base inseridos!');

    // 4. Inserir Exercícios
    await db.insert(exercises).values(exercisesData);
    console.log('✅ Exercícios inseridos!');

    // 5. Inserir Relações
    await db.insert(exerciseEquipments).values(exerciseEquipmentsData);
    await db.insert(exerciseTargets).values(exerciseTargetsData);
    console.log('✅ Relações inseridas!');

    console.log('🌱 Seed concluído com sucesso!');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    return { success: false, error };
  }
}