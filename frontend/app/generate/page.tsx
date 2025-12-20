'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Generate() {
  const [theme, setTheme] = useState('')
  const [story, setStory] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError('')
    setStory([])

    try {
      const res = await fetch('https://bert-story-api.proudsea-fc459dc9.eastus.azurecontainerapps.io/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          user_id: 'user',
        }),
      })

      if (!res.ok) throw new Error('Request failed')

      const data = await res.json()
      setStory(data.story || [])
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const examples = [
    'A journey through space',
    'Lost in a mysterious forest',
    'The last day on Earth',
    'A robot learning emotions',
    'Time traveler paradox',
  ]

  return (
    <div className="min-h-screen p-6">
      
      <div className="max-w-3xl mx-auto space-y-10 py-12">
        
        {/* Header */}
        <div className="space-y-2">
          <Link href="/" className="text-sm text-gray-500 hover:text-black transition-colors inline-block mb-4">
            ← Back
          </Link>
          <h1 className="text-5xl font-light">Story Generation</h1>
          <p className="text-xl text-gray-600">Enter a theme and let AI create a story</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Example: space adventure"
              className="w-full border border-gray-300 rounded-xl p-5 text-lg focus:outline-none focus:border-black transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
          >
            {loading ? 'Generating Story...' : 'Generate Story'}
          </button>

        </form>

        {/* Error */}
        {error && (
          <div className="border border-red-300 bg-red-50 text-red-800 p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Story Result */}
        {story.length > 0 && (
          <div className="border border-gray-300 rounded-xl p-8 space-y-6 bg-white">
            <div className="text-sm text-gray-500 uppercase tracking-wide">Generated Story</div>
            <div className="space-y-4 text-lg leading-relaxed text-gray-800">
              {story.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {/* Examples */}
        <div className="pt-8 space-y-4">
          <div className="text-sm text-gray-500 uppercase tracking-wide">Suggested Themes</div>
          <div className="grid gap-3">
            {examples.map((example, i) => (
              <button
                key={i}
                onClick={() => {
                  setTheme(example)
                  setStory([])
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