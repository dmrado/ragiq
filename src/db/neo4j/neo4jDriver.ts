import neo4j from 'neo4j-driver'

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'password'))
const session = driver.session()

async function createVectorIndex() {
    await session.run(`
    CREATE VECTOR INDEX chunk_embeddings_index IF NOT EXISTS
    FOR (c:Chunk)
    ON (c.embedding)
    OPTIONS { indexConfig: { 'metric': 'cosine' } };
  `)
    await session.close()
    await driver.close()
}

createVectorIndex()
