import { WGER_CONFIG } from '../config/wger.config';

const BASE_URL = WGER_CONFIG.baseUrl;

/**
 * Busca lista de exercícios da wger filtrado por idioma e status
 */
export const fetchWgerExercises = async (page = 1) => {
    try {
        const response = await fetch(
            `${BASE_URL}/exercise/?language=${WGER_CONFIG.language}&status=${WGER_CONFIG.status}&page=${page}`,
            {
                headers: { 'Accept': 'application/json' }
            }
        );

        if (!response.ok) throw new Error(`Wger API Error: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error('fetchWgerExercises failed:', error);
        throw error;
    }
};

/**
 * Busca detalhes de um exercício específico
 */
export const fetchWgerExerciseDetail = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/exerciseinfo/${id}/`);
        if (!response.ok) throw new Error(`Wger Detail Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('fetchWgerExerciseDetail failed:', error);
        throw error;
    }
};

/**
 * Busca lista de músculos para mapeamento
 */
export const fetchWgerMuscles = async () => {
    try {
        const response = await fetch(`${BASE_URL}/muscle/`);
        if (!response.ok) throw new Error(`Wger Muscle Error: ${response.status}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('fetchWgerMuscles failed:', error);
        return [];
    }
};
