'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Predict() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!text.includes('[MASK]')) {
      setError('Please include [MASK] in your text')
      return
    }

    setLoading(true)
    setError('')
    setResult('')

    try {
      const res = await fetch('https://bert-story-api.proudsea-fc459dc9.eastus.azurecontainerapps.io/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!res.ok) throw new Error('Request failed')

      const data = await res.json()
      setResult(data.predictions?.[0] || 'No prediction')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const examples = [
    'The [MASK] is shining brightly today.',
    'I love to eat [MASK] for breakfast.',
    'She plays the [MASK] beautifully.',
    'The [MASK] chased the mouse across the room.',
  ]

  return (
    <div className="min-h-screen p-6">
      
      <div className="max-w-3xl mx-auto space-y-10 py-12">
        
        {/* Header */}
        <div className="space-y-2">
          <Link href="/" className="text-sm text-gray-500 hover:text-black transition-colors inline-block mb-4">
            ← Back
          </Link>
          <h1 className="text-5xl font-light">Word Prediction</h1>
          <p className="text-xl text-gray-600">Use [MASK] to mark words you want predicted</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Example: The [MASK] chased the mouse."
              className="w-full border border-gray-300 rounded-xl p-5 text-lg focus:outline-none focus:border-black transition-colors resize-none"
              rows={5}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
          >
            {loading ? 'Predicting...' : 'Predict'}
          </button>

        </form>

        {/* Error */}
        {error && (
          <div className="border border-red-300 bg-red-50 text-red-800 p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="border border-gray-300 rounded-xl p-8 space-y-4 bg-white">
            <div className="text-sm text-gray-500 uppercase tracking-wide">Prediction</div>
            <div className="text-3xl font-medium">{result}</div>
            <div className="pt-4 border-t border-gray-100">
              <div className="text-gray-600">{text.replace('[MASK]', result)}</div>
            </div>
          </div>
        )}

        {/* Examples */}
        <div className="pt-8 space-y-4">
          <div className="text-sm text-gray-500 uppercase tracking-wide">Example Sentences</div>
          <div className="grid gap-3">
            {examples.map((example, i) => (
              <button
                key={i}
                onClick={() => {
                  setText(example)
                  setResult('')
                  setError('')
                }}
                className="text-left p-4 border border-gray-200 rounded-lg hover:border-black transition-colors text-gray-700 hover:text-black"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}