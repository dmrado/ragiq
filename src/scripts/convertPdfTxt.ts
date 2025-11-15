import pdfParse from 'pdf-parse'

export const readTxt = async (buffer: Buffer) => {
    return buffer.toString('utf8')
}

export const readPdf = async (buffer: Buffer) => {
    const data = await pdfParse(buffer)
    return data.text || ''
}

export const chunkText = (text: string, size: number) => {
    const chunks = []
    let pos = 0
    while (pos < text.length) {
        chunks.push(text.slice(pos, pos + size))
        pos += size
    }
    return chunks
}
