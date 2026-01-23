import { Model } from '@nozbe/watermelondb'
import { text, date, json, children } from '@nozbe/watermelondb/decorators'

// Função sanitizadora para garantir que sempre retorne um array
const sanitizeInstructions = (raw) => {
    return Array.isArray(raw) ? raw : []
}

export default class Exercise extends Model {
    static table = 'exercises'

    // Define relações para o WatermelonDB saber buscar dados linkados
    static associations = {
        exercise_targets: { type: 'has_many', foreignKey: 'exercise_id' },
        exercise_equipments: { type: 'has_many', foreignKey: 'exercise_id' },
    }

    @text('name') name
    @text('media_url') mediaUrl
    // @json faz o parse/stringify automático
    @json('instructions', sanitizeInstructions) instructions
    @date('created_at') createdAt
    @date('updated_at') updatedAt

    // Shortcuts para acessar os registros relacionados
    @children('exercise_targets') targets
    @children('exercise_equipments') equipments
}