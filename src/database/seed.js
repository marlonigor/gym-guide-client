import { database } from './index';

export async function seedDatabase() {
    await database.write(async () => {
        // 1. Limpar banco (opcional, bom para testes)
        await database.get('exercises').query().destroyAllPermanently();
        await database.get('muscle_groups').query().destroyAllPermanently();

        // 2. Criar Grupo Muscular (Ex: Peito)
        const chestGroup = await database.get('muscle_groups').create(group => {
            group.name = 'Peitoral';
            group.slug = 'peito';
            group.imageUrl = 'https://example.com/chest.png';
        });

        // 3. Criar Exercício (Ex: Supino Reto)
        await database.get('exercises').create(exercise => {
            exercise.name = 'Supino Reto com Barra';
            exercise.mediaUrl = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtY3l6Y3l6Y3l6/giphy.gif';
            exercise.instructions = ['Deite-se no banco', 'Segure a barra', 'Empurre para cima'];
            exercise.createdAt = Date.now();
            exercise.updatedAt = Date.now();
        });

        // 4. Criar Outro Exercício
        await database.get('exercises').create(exercise => {
            exercise.name = 'Flexão de Braço';
            exercise.instructions = ['Mãos no chão', 'Desça o peito', 'Suba'];
            exercise.createdAt = Date.now();
            exercise.updatedAt = Date.now();
        });
    });

    console.log('🌱 Dados de seed plantados com sucesso!');
}