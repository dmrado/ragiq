import { ChatInput } from '@/components/chat/ChatInput'
import { searchRagAction } from '@/actions/searchRagAction'

interface Props {
    searchParams?: { q?: string }
}

export interface SearchResult {
    text: string
    score: number
    collection: string
}

const ChatPage = async ({ searchParams }: Props) => {
    const userId = '11' // сюда можно подставить getServerSession
    const personalCollection = 'notes1'
    const generalCollection = 'general_notes'

    const query = (searchParams?.q ?? '').trim()

    let results: SearchResult[] = []
    let initialAnswer: string | null = null

    if (query.length >= 3) {
        const chromaResults = await searchRagAction(
            query,
            userId,
            personalCollection,
            generalCollection,
            5,
            5
        )

        // Преобразуем в наш интерфейс
        if (Array.isArray(chromaResults)) {
            results = chromaResults.flatMap(r => {
                if (!r.text) return []
                return [
                    {
                        text: r.text,
                        score: r.score ?? 0,
                        collection: r.collection ?? personalCollection
                    }
                ]
            })

            // Формируем initialAnswer для показа сверху
            if (results.length > 0) {
                initialAnswer = results.map(r => r.text).join('\n---\n')
            }
        } else {
            initialAnswer = `Ошибка поиска: ${chromaResults.message ?? 'Неизвестная ошибка'}`
        }
    }

    return (
        <main className="p-6 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Диалог с ИИ</h1>

            {query && initialAnswer ? (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h2 className="font-semibold mb-2">Результаты поиска:</h2>
                    <pre className="whitespace-pre-wrap">{initialAnswer}</pre>
                </div>
            ) : (
                <p className="text-gray-500">Введите вопрос выше, чтобы начать чат</p>
            )}

            <ChatInput userId={userId} initialResults={results} />
        </main>
    )
}

export default ChatPage
