'use client'
import { useState, useRef, useCallback } from 'react'
import { uploadRagAction } from '@/actions/uploadRagAction'

export const FILE_LIMIT = 10_000_000

const UploadRag = () => {
    const [file, setFile] = useState<File | null>(null)
    const [message, setMessage] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const reset = () => {
        setFile(null)
        setProgress(0)
        setMessage('')
    }

    // ===== DRAG & DROP =====
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
        else if (e.type === 'dragleave') setDragActive(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const f = e.dataTransfer.files?.[0]
        if (!f) return
        if (f.size > FILE_LIMIT) return setMessage('❌ Слишком большой файл')
        setFile(f)
    }, [])

    // ===== FILE SELECT =====
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        if (f.size > FILE_LIMIT) return setMessage('❌ Слишком большой файл')
        setFile(f)
    }

    // ===== SUBMIT =====
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return

        setMessage('')
        setIsUploading(true)
        setProgress(0)

        const formData = new FormData()
        formData.append('file', file)

        try {
            // Фейковый прогресс для UX до реальной загрузки
            const fakeProgress = setInterval(() => {
                setProgress((p) => (p < 80 ? p + 10 : p))
            }, 200)

            // мы не меняем formData, мы просто говорим TypeScript: «результат этой функции будет объектом с необязательными полями message и error».
            const result = await uploadRagAction(formData) as { message?: string; error?: string }

            clearInterval(fakeProgress)
            setProgress(100)

            if (result?.message) setMessage(result.message)
            else setMessage(`❌ Ошибка: ${result?.error || 'Неизвестная ошибка'}`)
        } catch {
            setMessage('❌ Критическая ошибка.')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <main className="p-6 max-w-xl mx-auto min-h-screen">
            <form onSubmit={onSubmit} className="bg-white rounded-md px-8 pt-6 pb-8 shadow-md">
                <h1 className="text-2xl font-bold mb-6">📚 Загрузка документа</h1>

                {/* DRAG DROP ZONE */}
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-10 text-center transition ${
                        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                >
                    <p className="text-gray-600 mb-3">
                        Перетащите файл сюда<br />
                        или
                    </p>

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="button_blue"
                    >
                        Выберите файл
                    </button>

                    <input
                        type="file"
                        accept=".txt,.xlsx,.xls"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {file && <p className="mt-3 text-gray-800 font-medium">📄 {file.name}</p>}
                </div>

                {/* PROGRESS BAR */}
                {isUploading && (
                    <div className="w-full bg-gray-200 rounded h-3 mt-4">
                        <div
                            className="bg-blue-600 h-3 rounded transition-all"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}

                {/* BUTTONS */}
                <div className="flex space-x-4 mt-6">
                    <button
                        type="submit"
                        disabled={!file || isUploading}
                        className={`button_green ${!file || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isUploading ? 'Индексируется...' : 'Загрузить'}
                    </button>

                    <button
                        type="button"
                        onClick={reset}
                        disabled={isUploading}
                        className="button_red"
                    >
                        Сбросить
                    </button>
                </div>

                {/* MESSAGE */}
                {message && (
                    <div
                        className={`mt-4 p-3 rounded text-sm border ${
                            message.startsWith('✅')
                                ? 'bg-green-50 text-green-800 border-green-200'
                                : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                    >
                        {message}
                    </div>
                )}
            </form>
        </main>
    )
}

export default UploadRag
