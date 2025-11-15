import { driver } from '@/lib/neo4j'
import { Ollama } from 'ollama'

export const resolvers = {
    Query: {
        semanticSearch: async (_: any, { query }: any) => {
            const session = driver.session()
            const ollama = new Ollama({host: 'http://127.0.0.1:11434'})

            // vector embedding
            const res = await ollama.embed({
                model: 'nomic-embed-text',
                input: query
            })

            const vector = res.embeddings[0]

            // vector search Neo4j
            const result = await session.run(
                `
                CALL db.index.vector.queryNodes(
                    'chunk_embeddings_index',
                    10,
                    $vector
                )
                YIELD node, score

                RETURN node, score
                ORDER BY score DESC
                `,
                { vector }
            )

            // map results
            const chunks = []
            for (const row of result.records) {
                const node = row.get('node')
                const score = row.get('score')

                // fetch doc + entities
                const rels = await session.run(
                    `
                    MATCH (c:Chunk {id: $id})-[:PART_OF]->(d:Document)
                    OPTIONAL MATCH (e:Entity)-[:MENTIONED_IN]->(c)
                    RETURN d, collect(e) as ents
                    `,
                    { id: node.properties.id }
                )

                const r = rels.records[0]
                const d = r.get('d')
                const ents = r.get('ents')

                chunks.push({
                    id: node.properties.id,
                    text: node.properties.text,
                    score,
                    document: d.properties,
                    entities: ents.map((e: any) => e.properties)
                })
            }

            await session.close()
            return chunks
        }
    }
}
