import { Ollama } from 'ollama'

// Авто-классификация документа (через Ollama LLM)

export const classifyDocument = async (text: string) => {
    const client = new Ollama({host: 'http://127.0.0.1:11434'})

    const prompt = `
Ты — классификатор текстов. Определи тип документа.
Варианты классов строго: ['препарат', 'закон', 'постановление', 'указ', 'прочее'].
Ответ верни в JSON: {"class": "..."}.

Текст:
${text.slice(0, 2000)}
`

    const res = await client.generate({
        model: 'llama3.1',
        prompt
    })

    try {
        const json = JSON.parse(res.response)
        return json.class || 'прочее'
    } catch {
        return 'прочее'
    }
}
