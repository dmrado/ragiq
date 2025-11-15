import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

// === Генерация имени файла с датой === todo она одинаковая с точ что в convertExcelToTxt надо выносить наверх
// export function generateFileName(baseName: string) {
//     const now = new Date();
//     const stamp = now.toISOString().replace(/[:.]/g, "-");
//     const ext = path.extname(baseName);
//     const name = path.basename(baseName, ext);
//     return `${name}_${stamp}${ext}`;
// }

// === Универсальная конвертация Excel в TXT ===
export function convertExcelToTxtUniversal(workbook: XLSX.WorkBook, outputFile: string) {
    if (workbook.SheetNames.length === 0) {
        throw new Error("❌ Excel файл пустой.");
    }

    const texts: string[] = [];

    workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const data: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" }); // defval = "" чтобы не было undefined

        if (data.length === 0) return;

        // Формируем текст универсально: каждая строка как "Колонка: значение"
        data.forEach((row, rowIndex) => {
            const rowText = Object.entries(row)
                .map(([key, value]) => `${key}: ${value}`)
                .join("\n");
            texts.push(`Sheet: ${sheetName}, Row ${rowIndex + 1}:\n${rowText}\n---\n`);
        });
    });

    const finalText = texts.join("\n");
    fs.writeFileSync(outputFile, finalText, "utf-8");
    console.log(`✅ Универсальная конвертация завершена. Результат в ${outputFile}`);
}

// === Вспомогательная функция для чанков ===
export function chunkText(text: string, size: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += size) {
        chunks.push(text.slice(i, i + size));
    }
    return chunks;
}

// === Проверка типа файла для загрузки ===
export function isAllowedFileType(fileName: string, mimeType: string) {
    const allowedExt = [".xls", ".xlsx", ".txt"];
    const ext = path.extname(fileName).toLowerCase();
    return allowedExt.includes(ext) || mimeType.startsWith("text/");
}
