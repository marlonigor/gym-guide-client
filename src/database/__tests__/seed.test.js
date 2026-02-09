import { seedDatabase } from '../seed';
import { expoDb, db } from '../db';

// Mock do banco de dados
jest.mock('../db', () => {
    const mockValues = jest.fn().mockResolvedValue({});
    const mockInsert = jest.fn(() => ({
        values: mockValues,
    }));

    return {
        expoDb: {
            execSync: jest.fn(),
            execAsync: jest.fn(),
        },
        db: {
            insert: mockInsert,
        },
    };
});

describe('database/seed', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('seedDatabase deve executar comandos SQL e inserir dados', async () => {
        const result = await seedDatabase();

        if (!result.success) {
            throw new Error(`Seed failed: ${JSON.stringify(result.error)}`);
        }

        expect(result.success).toBe(true);
        expect(expoDb.execSync).toHaveBeenCalled();
        expect(db.insert).toHaveBeenCalled();
    });

    it('seedDatabase deve falhar graciosamente se houver erro SQL', async () => {
        expoDb.execSync.mockImplementationOnce(() => {
            throw new Error('SQLite Error');
        });

        const result = await seedDatabase();
        expect(result.success).toBe(false);
        expect(result.error.message).toBe('SQLite Error');
    });
});
