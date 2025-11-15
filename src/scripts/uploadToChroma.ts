import * as fs from "fs";
import dotenv from "dotenv";
import { CloudClient } from "chromadb";

dotenv.config();

export async function uploadToChroma(filePath: string) {
    const chroma = new CloudClient({
        apiKey: process.env.CHROMA_API_KEY!,
        tenant: process.env.CHROMA_TENANT!,
        database: process.env.CHROMA_DB!,
    });

    const COLLECTION_NAME = "auctions-data";

    console.log(`📤 Загружаем ${filePath} в Chroma Cloud...`);
    const text = fs.readFileSync(filePath, "utf-8");
    const chunks = text.split("---").map((t) => t.trim()).filter(Boolean);

    const collections = await chroma.listCollections();
    const exists = collections.find((c) => c.name === COLLECTION_NAME);

    const collection = exists
        ? await chroma.getCollection({ name: COLLECTION_NAME })
        : await chroma.createCollection({ name: COLLECTION_NAME });

    await collection.add({
        ids: chunks.map((_, i) => `doc-${Date.now()}-${i}`),
        documents: chunks,
    });

    const count = await collection.count();
    console.log(`✅ Загружено ${chunks.length} новых документов`);
    console.log(`📊 Теперь всего документов в коллекции "${COLLECTION_NAME}": ${count}`);
}
