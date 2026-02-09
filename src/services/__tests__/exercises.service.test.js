import { getExerciseAlternatives } from '../exercises.service';
import { db } from '../../database/db';

jest.mock('../../database/db', () => ({
    db: {
        query: {
            exerciseTargets: {
                findMany: jest.fn().mockResolvedValue([
                    {
                        exercise: {
                            id: 2,
                            name: 'Alternative',
                            equipments: [{ equipment: { id: 1 } }],
                            targets: []
                        }
                    }
                ]),
            },
        },
    },
}));

describe('exercises.service', () => {
    it('getExerciseAlternatives deve retornar variações filtrando o exercício atual', async () => {
        const data = await getExerciseAlternatives(101, 1);
        expect(data.length).toBeGreaterThanOrEqual(1);
        expect(data[0].name).toBe('Alternative');
    });
});
