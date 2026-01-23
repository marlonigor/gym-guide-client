import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

// Abre (ou cria) o arquivo do banco de dados
const expoDb = openDatabaseSync('gymguide.db');

// Inicializa o ORM
export const db = drizzle(expoDb, { schema });