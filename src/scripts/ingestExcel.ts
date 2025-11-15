import { generateFileName, convertExcelToTxt } from "./convertExcelToTxt";
import { uploadToChroma } from "./uploadToChroma";
import { execSync } from "child_process";

// Excel → TXT → загрузка файла в Chroma через uploadToChroma
// включает проверку Ollama, конвертацию файла, вызов uploadToChroma
// НЕ занимается векторизацией чанков напрямую
function checkOllama() {
    try {
        execSync("curl -s http://localhost:11434/api/version", { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
}

async function main() {
    console.log("🚀 Полный процесс: Excel → TXT → Chroma");

    if (!checkOllama()) {
        console.error("❌ Ollama сервер не запущен. Сначала выполни:  ollama serve");
        process.exit(1);
    }

    const INPUT_FILE = "auctions.xlsx";
    const OUTPUT_FILE = generateFileName("auctions_dataset.txt");

    convertExcelToTxt(INPUT_FILE, OUTPUT_FILE);
    await uploadToChroma(OUTPUT_FILE);

    console.log("🎉 Готово: пайплайн завершён!");
}

main().catch(console.error);
