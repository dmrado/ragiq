export const typeDefs = /* GraphQL */ `
    type Document {
        name: String!
        class: String!
    }

    type Entity {
        value: String!
        type: String!
    }

    type Chunk {
        id: ID!
        text: String!
        score: Float
        document: Document
        entities: [Entity]
    }

    type Query {
        semanticSearch(query: String!): [Chunk]
    }
`