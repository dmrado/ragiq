import { Ollama } from 'ollama'
/*
Выделение сущностей (NER)
«Амикацин» → entity=drug
«ФЗ-187», «ПП-125» → entity=document
«Статья 5» → entity=article
*/
export const extractEntities = async (text: string) => {
    const client = new Ollama({host: 'http://127.0.0.1:11434'})

    const prompt = `
Извлеки сущности из текста.
Возвращай МАССИВ JSON-объектов вида:
[
  { "type": "drug" | "law" | "postanovlenie" | "article" | "section" | "person" | "org", "value": "..." }
]
Извлекай строго сущности, никаких объяснений.

Текст:
${text.slice(0, 4000)}
`

    const res = await client.generate({
        model: 'llama3.1',
        prompt
    })

    try {
        return JSON.parse(res.response)
    } catch {
        return []
    }
}
