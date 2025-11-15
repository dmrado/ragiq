'use server'

import { withErrorHandler } from '@/errors'
import { readPdf, readTxt, chunkText } from '@/scripts/convertPdfTxt'
import { classifyDocument } from '@/scripts/classifyDocument'
import { extractEntities } from '@/scripts/extractEntities'
import { ingestGraph } from '@/scripts/ingestGraph'
import { Ollama } from 'ollama'

export const uploadRagNeoAction = withErrorHandler(async (formData: FormData) => {
    const file = formData.get('file') as File | null
    if (!file) throw new Error('Файл не передан')

    const fileName = file.name
    const buffer = Buffer.from(await file.arrayBuffer())

    let text = ''
    if (fileName.endsWith('.pdf')) text = await readPdf(buffer)
    else if (fileName.endsWith('.txt')) text = await readTxt(buffer)
    else throw new Error('Разрешены только PDF и TXT')

    if (!text.trim()) throw new Error('Файл пустой')

    // разбивка
    const chunks = chunkText(text, 1200)

    // эмбеддинги
    const client = new Ollama({host: 'http://127.0.0.1:11434'})
    const embeddingRes = await client.embed({
        model: 'nomic-embed-text',
        input: chunks
    })
    const vectors: number[][] = embeddingRes.embeddings

    // авто-классификация
    const docClass = await classifyDocument(text)

    // выделение сущностей
    const entities = await extractEntities(text)

    // построение графа
    return await ingestGraph(chunks, vectors, fileName, docClass, entities)
})
