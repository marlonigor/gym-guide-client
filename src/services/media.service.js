import * as FileSystem from 'expo-file-system';

const MEDIA_DIRECTORY = `${FileSystem.documentDirectory}gym_media/`;

// Garante que o diretório de mídia existe
const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(MEDIA_DIRECTORY);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(MEDIA_DIRECTORY, { intermediates: true });
    }
};

/**
 * Gera um nome de arquivo local seguro a partir de uma URL
 */
const getFileNameFromUrl = (url) => {
    if (!url) return null;
    const extension = url.split('.').pop() || 'jpg';
    // Remove caracteres especiais e usa hash simples ou base64 do nome original
    const safeName = url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return `${safeName}.${extension}`;
};

/**
 * Retorna o caminho local de um arquivo se ele existir, senão retorna null
 */
export const getLocalMediaPath = async (remoteUrl) => {
    if (!remoteUrl) return null;
    const fileName = getFileNameFromUrl(remoteUrl);
    const localUri = `${MEDIA_DIRECTORY}${fileName}`;

    const fileInfo = await FileSystem.getInfoAsync(localUri);
    return fileInfo.exists ? localUri : null;
};

/**
 * Baixa uma mídia para o armazenamento local
 */
export const downloadAndCacheMedia = async (remoteUrl) => {
    if (!remoteUrl) return null;

    try {
        await ensureDirExists();
        const fileName = getFileNameFromUrl(remoteUrl);
        const localUri = `${MEDIA_DIRECTORY}${fileName}`;

        const fileInfo = await FileSystem.getInfoAsync(localUri);
        if (fileInfo.exists) return localUri;

        const downloadRes = await FileSystem.downloadAsync(remoteUrl, localUri);
        return downloadRes.uri;
    } catch (error) {
        console.error('Erro ao baixar mídia:', error);
        return null;
    }
};

/**
 * Limpa todo o cache de mídia
 */
export const clearMediaCache = async () => {
    try {
        await FileSystem.deleteAsync(MEDIA_DIRECTORY, { idempotent: true });
        await ensureDirExists();
    } catch (error) {
        console.error('Erro ao limpar cache:', error);
    }
};
