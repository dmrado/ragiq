'use server'

import { driver } from '@/lib/neo4j'

export const ingestGraph = async (
    chunks: string[],
    embeddings: number[][],
    fileName: string,
    docClass: string,
    entities: any[]
) => {
    const session = driver.session()

    try {
        // создаём узел документа
        await session.run(
            `
            MERGE (d:Document {name: $fileName})
            SET d.class = $docClass
            `,
            { fileName, docClass }
        )

        for (let i = 0; i < chunks.length; i++) {
            const id = `chunk-${Date.now()}-${i}`
            const text = chunks[i]
            const vector = embeddings[i]

            await session.run(
                `
                MATCH (d:Document {name: $fileName})
                MERGE (c:Chunk {id: $id})
                SET c.text = $text,
                    c.embedding = $vector
                MERGE (c)-[:PART_OF]->(d)
                `,
                { id, text, vector, fileName }
            )
        }

        // сущности
        for (const ent of entities) {
            await session.run(
                `
                MERGE (e:Entity {value: $value})
                SET e.type = $type
                `,
                { value: ent.value, type: ent.type }
            )

            // связываем сущность с чанками
            await session.run(
                `
                MATCH (e:Entity {value: $value})
                MATCH (c:Chunk)
                WHERE c.text CONTAINS $value
                MERGE (e)-[:MENTIONED_IN]->(c)
                `,
                { value: ent.value }
            )
        }

        return {
            message: `✅ Neo4j граф построен: документ "${fileName}", тип: ${docClass}, сущностей: ${entities.length}`
        }
    } finally {
        await session.close()
    }
}
