import {execSync} from "child_process";
import {Ollama} from "ollama";

const ollamaClient = new Ollama({host: "http://localhost:11434"});
const EMBEDDING_MODEL = "nomic-embed-text";

/**
 * Возвращает самую лёгкую доступную модель из списка установленных.
 * Если ни одна не найдена — пробует pull.
 */
export async function getAvailableLLM(): Promise<string> {
    try {
        const result = execSync("ollama list", {encoding: "utf-8"});
        const lines = result.split("\n").slice(1);
        const models = lines
            .map((line) => line.trim().split(/\s+/)[0])
            .filter(Boolean);

        // Приоритет лёгких моделей todo сделать выбор приоритетно оптимальной для разных мощностей
        const preferred = [
            "llama3.1:1b", // ~1.0B
            "deepseek-coder:1.3b-base", // ~1.3B
            "llama3.1:3b-instruct-q4_K_M", // ~3.0B
            "phi3:mini", // ~3.8B
            "deepseek-coder:6.7b-instruct", // ~6.7B
            "mistral:7b-instruct-q4_K_M", // ~7.0B
            "llama3.1:8b-instruct-q4_K_M", // ~8.0B
            "llama3:latest",
        ];

        for (const p of preferred) {
            if (models.includes(p)) {
                console.log(`✅ Выбрана самая лёгкая доступная модель: ${p}`);
                return p;
            }
        }

        // fallback
        console.warn("⚠️ Подходящая лёгкая модель не найдена, пробуем загрузить первую доступную...");
        for (const p of preferred) {
            try {
                console.log(`⬇️ Загружаем модель ${p}...`);
                await ollamaClient.pull({model: p});
                console.log(`✅ Модель ${p} загружена и выбрана.`);
                return p;
            } catch (err: any) {
                console.warn(`⚠️ Не удалось загрузить ${p}: ${err.message}`);
            }
        }

        throw new Error("❌ Нет доступных моделей Ollama.");
    } catch (err: any) {
        console.error("❌ Ошибка при получении списка моделей:", err.message);
        return "llama3.1:3b-instruct-q4_K_M"; // безопасный fallback
    }
}

/**
 * Отправка промпта в Ollama LLM
 */
export async function askOllama(prompt: string): Promise<string> {
    const model = await getAvailableLLM();
    console.log(`🧠 Используем LLM: ${model}`);

    try {
        const response = await ollamaClient.chat({
            model,
            messages: [{role: "user", content: prompt}],
        });
        return response.message?.content ?? "";
    } catch (err: any) {
        console.error(`❌ Ошибка при работе с Ollama (${model}):`, err.message);
        return "⚠️ Ошибка при обращении к LLM.";
    }
}

/**
 * Генерация эмбеддингов через Ollama
 */
export async function getEmbeddings(texts: string[]): Promise<number[][]> {
    const responses = await Promise.all(
        texts.map(async (text) => {
            const res = await ollamaClient.embeddings({
                model: EMBEDDING_MODEL,
                prompt: text,
            });
            return res.embedding;
        })
    );

    return responses;
}
