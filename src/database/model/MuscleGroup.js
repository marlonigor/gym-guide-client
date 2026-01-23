import { Model } from '@nozbe/watermelondb'
import { text, children } from '@nozbe/watermelondb/decorators'

export default class MuscleGroup extends Model {
    static table = 'muscle_groups'
    static associations = {
        sub_muscles: { type: 'has_many', foreignKey: 'group_id' },
    }

    @text('name') name
    @text('slug') slug
    @text('image_url') imageUrl

    @children('sub_muscles') subMuscles
}