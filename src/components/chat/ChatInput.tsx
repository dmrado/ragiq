'use client'

import {useState, useTransition} from 'react'
import {ragQueryUserFirstAction} from '@/actions/ragQueryUserFirstAction'
import {SearchResult} from '@/app/chat/page'
import {h} from "preact";

interface Props {
    userId: string
    initialResults?: SearchResult[]
}

export const ChatInput = ({userId, initialResults = []}: Props) => {
    const [input, setInput] = useState('')
    const [answer, setAnswer] = useState('')
    const [isPending, startTransition] = useTransition()
    //предыдущие результаты при монтировании
    const [history, setHistory] = useState<SearchResult[]>(initialResults ?? [])

    // Можно использовать initialResults для отображения истории поиска/ответов
    // Например, объединяем их в textarea для просмотра контекста
    // const initialText = initialResults.map(r => r.text).join('\n---\n')

    const handleSubmit = () => {
        startTransition(async () => {
            //todo динамически передавать коллекцию или ограничиться userId, когда сделаешь не забудь убрать в ragQueryUserFirstAction и personalCollection в ChatPage
            const res = await ragQueryUserFirstAction(input, userId, 'notes1')
            setAnswer(res)
            setHistory(prev => [...prev, {text: input, score: 0, collection: 'user_input'}])
        })
    }

    return (
        <div className="flex flex-col gap-4">
        <textarea
            className="w-full p-2 border rounded"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Введите вопрос"
        />

            <div className="flex gap-2">
                <button className="button_blue" onClick={handleSubmit} disabled={isPending}>
                    Отправить
                </button>
                <button className="button_red" onClick={() => setInput('')}>
                    Очистить
                </button>
            </div>

            {isPending ? (
                'Загрузка...'
            ) : (
                //Используем фрагмент для группировки нескольких элементов
                <>
                    {history.length > 0 && (
                        <div className="p-4 mt-4 border rounded-md bg-gray-100 whitespace-pre-wrap">
                            {history.map((h, idx) => (
                                <div key={idx}>
                                    <strong>{h.collection === 'user_input' ? 'Вы' : 'Документ'}:</strong> {h.text}
                                    <hr className="my-2"/>
                                </div>
                            ))}
                        </div>
                    )}
                    {answer && (
                        <div className="p-4 mt-4 border rounded-md bg-gray-50 whitespace-pre-wrap">
                            <strong>Ответ ИИ:</strong>
                            <div>{answer}</div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}