'use server'

import {Ollama} from 'ollama'
import * as fs from 'fs'
import * as path from 'path'
import * as XLSX from 'xlsx'
import {chroma} from '@/lib/chroma'
import {generateFileName, convertExcelToTxt, chunkText} from '@/scripts/convertExcelToTxt'
import {withErrorHandler} from '@/errors'
import {convertExcelToTxtUniversal} from "@/scripts/convertExcelToTxtUniversal";


// --- ФУНКЦИЯ INGEST TO CHROMA ---
// 1) отправляет их в Ollama для embed()
// 2) создаёт коллекцию в Chroma
// 3) добавляет embeddings + метаданные
async function ingestToChroma(chunks: string[], fileName: string, userId: string, collectionName: string) {
    const ollamaClient = new Ollama({host: "http://127.0.0.1:11434"})

    // Векторизация всех чанков
    const response = await ollamaClient.embed({
        model: "nomic-embed-text",
        input: chunks,
    });
    const vectors: number[][] = response.embeddings

    // Полное имя коллекции с userId
    const fullCollectionName = `user_${userId}_${collectionName}`
    const collection = await chroma.getOrCreateCollection({ name: fullCollectionName, embeddingFunction: undefined })
    await collection.add({
        ids: chunks.map((_, i) => `doc-${Date.now()}-${i}`),
        documents: chunks,
        embeddings: vectors,
        // Добавление метаданных для фильтрации
        metadatas: chunks.map(() => ({ fileName: fileName, collection: collectionName, userId })),
    })
    console.log(`✅ Загружено ${chunks.length} чанков из ${fileName} в коллекцию ${fullCollectionName}`)
    return {
        message: `✅ Файл '${fileName}' успешно загружен и векторизован (${chunks.length} чанков) в коллекцию ${fullCollectionName}!`,
    }}

/**
 * Принимает FormData, обрабатывает Excel/TXT, векторизует и сохраняет в ChromaDB.
 * @param formData Объект FormData, содержащий поле 'file'.
 * @returns Объект { ok: true, data: {message: string} } или { ok: false, error: string }
 */
//todo добавить данные полей формы, когда решим какие
export const uploadRagAction = withErrorHandler (async (formData: FormData, userId: string) => {
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.isAdmin) {
    //     throw new Error('Permission denied')
    // }
    // const userId = session.user.id

    if (!userId) throw new Error('Не указан userId')

    // --- Получаем имя коллекции из формы, если есть ---
    const collectionNameField = formData.get('collectionName') as string | null
    const collectionName = collectionNameField?.trim() || 'notes1'

    const file = formData.get('file') as File | null
    if (!file) {
        throw new Error('Файл не передан')
    }

    //читаем
    const fileName = file.name || 'uploaded'
    const mime = file.type || ''
    const buffer = Buffer.from(await file.arrayBuffer())

    let text = ''

    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const tempDir = path.resolve("./tmp")
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

        const safeName = `${Date.now()}_${path.basename(fileName)}`
        const inputPath = path.join(tempDir, safeName)
        await fs.promises.writeFile(inputPath, buffer)

        const outputPath = path.join(tempDir, generateFileName("converted.txt"))
        const workbook = XLSX.read(buffer, {type: 'buffer'})

        try {
            // Попытка конвертации по стандартному шаблону для Тенд. упр.
            convertExcelToTxt(workbook, inputPath, outputPath)
        } catch (err) {
            console.warn(`⚠️ convertExcelToTxt failed, falling back to universal converter: ${(err as Error).message}`)
            convertExcelToTxtUniversal(workbook, outputPath)
        }

        text = fs.readFileSync(outputPath, "utf-8")
    }
    else if (mime.startsWith("text/") || fileName.endsWith(".txt")) {
        text = await file.text()
    }
    else {
        throw new Error('Поддерживаются только файлы .txt, .xls и .xlsx')
    }

    //Разбиваем, векторизуем и сохраняем
    if (!text || text.trim().length === 0) {
        throw new Error('Файл пустой или не может быть прочитан как текст')
    }
    const chunks = chunkText(text, 1200)
    return await ingestToChroma(chunks, fileName, collectionName)
})