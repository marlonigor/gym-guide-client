import { fetchWgerExercises, fetchWgerExerciseDetail } from '../wger.service';

describe('wger.service', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('fetchWgerExercises deve retornar lista de exercícios', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ results: [{ name: 'Bench Press' }] }),
            })
        );

        const data = await fetchWgerExercises();
        expect(data.results[0].name).toBe('Bench Press');
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/exercise/'),
            expect.any(Object)
        );
    });

    it('fetchWgerExercises deve lançar erro em falha da API', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 500,
            })
        );

        await expect(fetchWgerExercises()).rejects.toThrow('Wger API Error: 500');
    });

    it('fetchWgerExerciseDetail deve retornar detalhes do exercício', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ description: 'Test Description' }),
            })
        );

        const data = await fetchWgerExerciseDetail(1);
        expect(data.description).toBe('Test Description');
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/exerciseinfo/1/'),
        );
    });
});
