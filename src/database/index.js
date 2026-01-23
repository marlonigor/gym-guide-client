import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import schema from './schema'
import { dbModels } from './model'

// 1. Configuração do Adaptador (a ponte para o SQLite)
const adapter = new SQLiteAdapter({
    schema,
    // (Opcional) Migrations:
    // migrations, 
    // O nome do arquivo do banco no dispositivo
    dbName: 'gymguide',
    // JSI é a nova arquitetura (mais rápida), ativada por padrão no Expo moderno
    jsi: true,

    onSetUpError: error => {
        // Tratamento de erro na inicialização (ex: banco corrompido)
        console.error('Database failed to load:', error)
    }
})

// 2. Instanciação do Banco de Dados
export const database = new Database({
    adapter,
    modelClasses: dbModels,
})