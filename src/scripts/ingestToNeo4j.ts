'use server'

import { driver } from '@/lib/neo4j'
import { Ollama } from 'ollama'

// создаёт (Chunk)-[:PART_OF]->(File)
export const ingestToNeo4j = async (chunks: string[], fileName: string, collectionName: string) => {
    const ollamaClient = new Ollama({host: 'http://127.0.0.1:11434'})

    // эмбеддинги
    const response = await ollamaClient.embed({
        model: 'nomic-embed-text',
        input: chunks
    })
    const vectors: number[][] = response.embeddings

    const session = driver.session()

    try {
        for (let i = 0; i < chunks.length; i++) {
            const id = `chunk-${Date.now()}-${i}`
            const text = chunks[i]
            const embedding = vectors[i]

            // создаём узлы
            await session.run(
                `
                MERGE (f:File {name: $fileName, collection: $collectionName})
                MERGE (c:Chunk {id: $id})
                SET c.text = $text,
                    c.embedding = $embedding
                MERGE (c)-[:PART_OF]->(f)
                `,
                {
                    id,
                    text,
                    embedding,
                    fileName,
                    collectionName
                }
            )
        }

        console.log(`✅ Neo4j: сохранено ${chunks.length} чанков из ${fileName}`)
        return {
            message: `✅ Файл '${fileName}' загружен в Neo4j (${chunks.length} чанков)`
        }
    } finally {
        await session.close()
    }
}
