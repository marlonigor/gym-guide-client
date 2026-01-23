import { Model } from '@nozbe/watermelondb'
import { text, relation } from '@nozbe/watermelondb/decorators'

export class Equipment extends Model {
    static table = 'equipments'
    static associations = {
        exercise_equipments: { type: 'has_many', foreignKey: 'equipment_id' },
    }
    @text('name') name
}

export class ExerciseTarget extends Model {
    static table = 'exercise_targets'
    static associations = {
        exercises: { type: 'belongs_to', key: 'exercise_id' },
        sub_muscles: { type: 'belongs_to', key: 'sub_muscle_id' },
    }
    @text('type') type
    @relation('exercises', 'exercise_id') exercise
    @relation('sub_muscles', 'sub_muscle_id') subMuscle
}

export class ExerciseEquipment extends Model {
    static table = 'exercise_equipments'
    static associations = {
        exercises: { type: 'belongs_to', key: 'exercise_id' },
        equipments: { type: 'belongs_to', key: 'equipment_id' },
    }
    @relation('exercises', 'exercise_id') exercise
    @relation('equipments', 'equipment_id') equipment
}