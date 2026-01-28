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
  { id: 4, name: 'Braços', slug: 'arms', icon: '💪' },
  { id: 5, name: 'Pernas', slug: 'legs', icon: '🦵' },
  { id: 6, name: 'Core', slug: 'core', icon: '🎯' },
];

const subMusclesData = [
  // Peito
  { id: 1, groupId: 1, name: 'Peitoral Maior', description: 'Parte principal do peito' },
  { id: 2, groupId: 1, name: 'Peitoral Superior', description: 'Parte alta, clavicular' },
  { id: 3, groupId: 1, name: 'Peitoral Inferior', description: 'Parte baixa' },
  // Costas
  { id: 4, groupId: 2, name: 'Grande Dorsal', description: 'As "asas" das costas' },
  { id: 5, groupId: 2, name: 'Trapézio', description: 'Parte superior das costas' },
  // Ombros
  { id: 6, groupId: 3, name: 'Deltoide Anterior', description: 'Frente do ombro' },
  { id: 7, groupId: 3, name: 'Deltoide Lateral', description: 'Lado do ombro' },
  // Braços
  { id: 8, groupId: 4, name: 'Bíceps', description: 'Frente do braço' },
  { id: 9, groupId: 4, name: 'Tríceps', description: 'Fundo do braço' },
];

const equipmentsData = [
  { id: 1, name: 'Barra', icon: '🏋️' },
  { id: 2, name: 'Halteres', icon: 'dumbbell' },
  { id: 3, name: 'Peso do Corpo', icon: 'human' },
  { id: 4, name: 'Polia', icon: 'cable' },
  { id: 5, name: 'Máquina', icon: 'machine' },
];

const exercisesData = [
  // Peitoral (id: 1)
  { id: 1, name: 'Supino Reto', muscleGroupId: 1, instructions: '["Deite no banco", "Segure a barra", "Desça até o peito", "Empurre"]' },
  { id: 2, name: 'Flexão de Braço', muscleGroupId: 1, instructions: '["Mãos no chão", "Corpo reto", "Desça até o chão", "Empurre"]' },
  { id: 3, name: 'Supino Inclinado (Halteres)', muscleGroupId: 1, instructions: '["Banco 45 graus", "Empurre halteres para cima"]' },

  // Costas (id: 2)
  { id: 4, name: 'Barra Fixa', muscleGroupId: 2, instructions: '["Pendure-se", "Puxe o corpo até o queixo passar da barra"]' },

  // Braços (id: 4)
  { id: 5, name: 'Rosca Direta', muscleGroupId: 4, instructions: '["Segure a barra", "Flexione o cotovelo"]' },
];

// Pivot: Exercício <-> Equipamento
const exerciseEquipmentsData = [
  { exerciseId: 1, equipmentId: 1 }, // Supino Reto -> Barra
  { exerciseId: 2, equipmentId: 3 }, // Flexão -> Peso Corpo
  { exerciseId: 3, equipmentId: 2 }, // Supino Inclinado -> Halteres
  { exerciseId: 4, equipmentId: 3 }, // Barra Fixa -> Peso Corpo
  { exerciseId: 5, equipmentId: 1 }, // Rosca Direta -> Barra
];

// Pivot: Exercício <-> SubMúsculos
const exerciseTargetsData = [
  { exerciseId: 1, subMuscleId: 1, targetType: 'primary' }, // Supino Reto -> Peitoral Maior
  { exerciseId: 1, subMuscleId: 6, targetType: 'secondary' }, // Supino Reto -> Deltoide Ant
  { exerciseId: 1, subMuscleId: 9, targetType: 'secondary' }, // Supino Reto -> Tríceps

  { exerciseId: 2, subMuscleId: 1, targetType: 'primary' }, // Flexão -> Peitoral Maior

  { exerciseId: 3, subMuscleId: 2, targetType: 'primary' }, // Supino Inc -> Peitoral Superior

  { exerciseId: 4, subMuscleId: 4, targetType: 'primary' }, // Barra Fixa -> Dorsal
  { exerciseId: 5, subMuscleId: 8, targetType: 'primary' }, // Rosca Direta -> Bíceps
];

export async function seedDatabase() {
  try {
    console.log('⏳ Iniciando Seed...');

    // 1. Criar Tabelas
    await expoDb.execAsync(createTablesSql);

    // 2. Limpar tudo (Agora feito via DROP TABLES no passo 1)
    // await db.delete(exerciseTargets);
    // await db.delete(exerciseEquipments);
    // await db.delete(exercises);
    // await db.delete(subMuscles);
    // await db.delete(equipments);
    // await db.delete(muscleGroups);
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