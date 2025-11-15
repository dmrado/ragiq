import {getEmbeddings} from "@/lib/ollama";
import {chroma} from "@/lib/chroma";
import {withErrorHandler} from "@/errors";
import {SearchResult} from "chromadb";

/**
 * Ищет по векторной базе: ChromaDB возвращает массив документов с оценками релевантности SearchResult[] без генерации
 * ответов ИИ. Возвращает сырые результаты поиска (тексты + score + collection). Используется когда нужен список документов
 * , например для отображенрия на странице или предварительного анализа
 * 1) Сначала по личной коллекции пользователя
 * 2) Если мало релевантных результатов — по общей коллекции
 */
 export const searchRagAction = withErrorHandler( async (
    query: string,
    userId: string,
    personalCollectionName: string,
    generalCollectionName: string,
    topKPersonal = 5,
    topKGeneral = 5
): Promise<SearchResult[]> =>  {
    const queryVector = await getEmbeddings([query])
    const chunksResult: SearchResult[] = []

    // --- 1. Сначала личная коллекция ---
    const personalFullName = `user_${userId}_${personalCollectionName}`
    const personalCollection = await chroma.getOrCreateCollection({ name: personalFullName })

    const personalMatches = await personalCollection.query({
        queryEmbeddings: queryVector,
        nResults: topKPersonal,
        include: ["documents", "distances"],
    })

    if (personalMatches.documents && personalMatches.documents.length > 0) {
        for (let i = 0; i < personalMatches.documents.length; i++) {
            const doc = personalMatches.documents[i][0] || ""
            const score = personalMatches.distances?.[i][0] || 0
            chunksResult.push({ text: doc, score, collection: personalFullName })
        }
    }

    // --- 2. Если результатов мало — ищем по общей коллекции ---
    if (chunksResult.length < topKPersonal) {
        const generalCollection = await chroma.getOrCreateCollection({ name: generalCollectionName })
        const generalMatches = await generalCollection.query({
            queryEmbeddings: queryVector,
            nResults: topKGeneral,
            include: ["documents", "distances"],
        })

        if (generalMatches.documents && generalMatches.documents.length > 0) {
            for (let i = 0; i < generalMatches.documents.length; i++) {
                const doc = generalMatches.documents[i][0] || ""
                const score = generalMatches.distances?.[i][0] || 0
                chunksResult.push({ text: doc, score, collection: generalCollectionName })
            }
        }
    }

    // Сортируем по убыванию релевантности
    chunksResult.sort((a, b) => b.score - a.score)

    return chunksResult
})