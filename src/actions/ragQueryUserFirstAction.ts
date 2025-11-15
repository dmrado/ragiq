'use server'

import { searchChroma } from '@/lib/searchChroma'
import { askOllama } from '@/lib/ollama'
import { getEmbeddings } from '@/lib/ollama'
import {searchRagAction} from "@/actions/searchRagAction";

/**
 * Универсальный RAG-запрос: сначала ищет по огороду пользователя, затем в глобальной базе.
 * Формирует ответ через LLM. Ищет по коллекции пользователя через searchChroma (внутри этой функции можно сделать fallback на глобальную базу
 * — зависит от реализации searchChroma).  * Если ничего не найдено — возвращает сообщение об ошибке.
 * Если есть результаты — формирует контекст для LLM и генерирует финальный текст ответа.Используется,
 * когда нужен готовый ответ от ИИ по найденным документам.
 * @param query Запрос пользователя
 * @param userId Id пользователя
 * @param collectionName Базовое имя коллекции (например, 'notes1')
 */
export async function ragQueryUserFirstAction(query: string, userId: string, collectionName = 'notes1') {
    // Поиск в огороде пользователя + fallback на глобальную базу
    const results = await searchRagAction(query, userId, collectionName)

    if (!results.documents || results.documents.length === 0) {
        return "❌ Ничего не найдено ни в вашем огороде, ни в глобальной базе."
    }

    // Объединяем найденные документы для LLM
    const context = results.documents.join("\n---\n")

    // Формируем промпт для LLM
    const prompt = `
Используй следующую информацию для ответа на вопрос:
${context}

Вопрос: ${query}

Ответь максимально подробно и понятно.
`

    // Отправка в LLM
    const answer = await askOllama(prompt)
    return answer
}
