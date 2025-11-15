'use client'

import { useState, useRef } from 'react'
import { uploadRagNeoAction } from '@/actions/uploadRagNeoAction'

const UploadNeo = () => {
    const [file, setFile] = useState<File | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [message, setMessage] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const reset = () => {
        setFile(null)
        setProgress(0)
        setMessage('')
    }

    const handleDrag = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
        if (e.type === 'dragleave') setDragActive(false)
    }

    const handleDrop = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        const f = e.dataTransfer.files?.[0]
        if (!f) return
        if (!allow(f.name)) {
            setMessage('❌ Разрешены только PDF и TXT')
            return
        }
        setFile(f)
    }

    const allow = (name: string) => {
        return name.endsWith('.pdf') || name.endsWith('.txt')
    }

    const handleSelect = (e: any) => {
        const f = e.target.files?.[0]
        if (!f) return
        if (!allow(f.name)) {
            setMessage('❌ Разрешены только PDF и TXT')
            return
        }
        setFile(f)
    }

    const onSubmit = async (e: any) => {
        e.preventDefault()
        if (!file) return

        setIsUploading(true)
        setMessage('')

        const formData = new FormData()
        formData.append('file', file)

        // визуальный прогресс
        const p = setInterval(() => {
            setProgress(x => (x < 90 ? x + 10 : x))
        }, 200)

        const result = await uploadRagNeoAction(formData)

        clearInterval(p)
        setProgress(100)
        setIsUploading(false)

        if (result?.message) setMessage(result.message)
        else setMessage('❌ Ошибка при загрузке')
    }

    return (
        <main className='p-6 max-w-xl min-h-screen mx-auto'>
            <h1 className='text-2xl font-bold mb-6'>
                📡 Загрузка PDF/TXT в Neo4j
            </h1>

            <form onSubmit={onSubmit} className='bg-white rounded-md px-8 pt-6 pb-8 shadow'>

                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-10 text-center transition
                        ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                    `}
                >
                    <p className='text-gray-600 mb-3'>
                        Перетащите файл сюда<br/>или
                    </p>

                    <button
                        type='button'
                        onClick={() => fileInputRef.current?.click()}
                        className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
                    >
                        Выбрать файл
                    </button>

                    <input
                        type='file'
                        ref={fileInputRef}
                        accept='.pdf,.txt'
                        onChange={handleSelect}
                        className='hidden'
                    />

                    {file && (
                        <p className='mt-3 text-gray-800 font-medium'>
                            📄 {file.name}
                        </p>
                    )}
                </div>

                {isUploading && (
                    <div className='w-full bg-gray-200 rounded h-3 mt-4'>
                        <div
                            className='bg-blue-600 h-3 rounded transition-all'
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}

                <div className='flex space-x-4 mt-6'>
                    <button
                        type='submit'
                        disabled={!file || isUploading}
                        className={`px-4 py-2 text-white rounded
                            ${!file || isUploading
                            ? 'bg-gray-400'
                            : 'bg-green-600 hover:bg-green-700'}
                        `}
                    >
                        {isUploading ? 'Загружается...' : 'Загрузить'}
                    </button>

                    <button
                        type='button'
                        disabled={isUploading}
                        onClick={reset}
                        className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded'
                    >
                        Сбросить
                    </button>
                </div>

                {message && (
                    <div
                        className={`mt-4 p-3 rounded border text-sm
                            ${message.startsWith('✅')
                            ? 'bg-green-50 text-green-800 border-green-200'
                            : 'bg-red-50 text-red-800 border-red-200'}
                        `}
                    >
                        {message}
                    </div>
                )}
            </form>
        </main>
    )
}

export default UploadNeo
