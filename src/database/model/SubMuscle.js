import { Model } from '@nozbe/watermelondb'
import { text, relation, immutableRelation } from '@nozbe/watermelondb/decorators'

export default class SubMuscle extends Model {
    static table = 'sub_muscles'
    static associations = {
        muscle_groups: { type: 'belongs_to', key: 'group_id' },
        exercise_targets: { type: 'has_many', foreignKey: 'sub_muscle_id' },
    }

    @text('name') name
    @text('description') description

    // Relação direta com o pai (Grupo Muscular)
    @relation('muscle_groups', 'group_id') muscleGroup
}