'use client'

import { useState } from 'react'

const SemanticSearch = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])

    const search = async () => {
        const res = await fetch('/api/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    query Search($q: String!) {
                        semanticSearch(query: $q) {
                            id
                            text
                            score
                            document { name class }
                            entities { value type }
                        }
                    }
                `,
                variables: { q: query }
            })
        })

        const json = await res.json()
        setResults(json.data.semanticSearch)
    }

    return (
        <div className='p-6 max-w-2xl mx-auto'>
            <h1 className='text-2xl font-bold mb-6'>🔎 Semantic Search</h1>

            <div className='flex space-x-3 mb-4'>
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className='border px-3 py-2 rounded w-full'
                    placeholder='Введите запрос...'
                />

                <button
                    onClick={search}
                    className='px-4 py-2 bg-blue-600 text-white rounded'
                >
                    Искать
                </button>
            </div>

            <div className='space-y-4'>
                {results.map((r: any) => (
                    <div key={r.id} className='border rounded p-4 bg-white shadow-sm'>
                        <div className='text-sm text-gray-500'>
                            score: {r.score.toFixed(4)}
                        </div>

                        <p className='mt-2 whitespace-pre-wrap'>{r.text}</p>

                        <div className='mt-3 text-sm text-gray-700'>
                            Документ: <b>{r.document.name}</b> ({r.document.class})
                        </div>

                        <div className='mt-2 flex flex-wrap gap-2'>
                            {r.entities.map((e: any, i: number) => (
                                <span key={i} className='px-2 py-1 text-xs bg-gray-100 rounded'>
                                    {e.type}: {e.value}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SemanticSearch
