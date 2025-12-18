'use client'

import { useState } from 'react'
import { Loader2, AlertCircle, BookOpen } from 'lucide-react'

const API_BASE = 'https://bert-story-api.proudsea-fc459dc9.eastus.azurecontainerapps.io'

export default function GeneratePage() {
  const [theme, setTheme] = useState('')
  const [userId, setUserId] = useState('default-user')
  const [story, setStory] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError(null)
    setStory(null)

    try {
      const response = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme,
          user_id: userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Story generation failed')
      }

      const data = await response.json()
      setStory(data.story || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const exampleThemes = [
    'A journey through space',
    'Lost in a mysterious forest',
    'The last day on Earth',
    'A robot learning to feel',
    'Ancient civilization discovered',
    'Time traveler paradox',
  ]

  const loadTheme = (exampleTheme: string) => {
    setTheme(exampleTheme)
    setStory(null)
    setError(null)
  }

  return (
    <main className="min-h-screen gradient-airforce py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            AI Story Generator
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Transform simple themes into creative narratives powered by advanced language models
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 space-y-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label htmlFor="theme" className="block text-lg font-semibold text-white mb-3">
                Story Theme
              </label>
              <input
                id="theme"
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="input-navy w-full p-4 rounded-lg text-lg"
                placeholder="Enter a theme or scenario..."
                required
              />
              <p className="text-sm text-blue-200 mt-2">
                Provide a theme, setting, or concept for the AI to build a story around
              </p>
            </div>

            <div>
              <label htmlFor="userId" className="block text-lg font-semibold text-white mb-3">
                User ID (Optional)
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="input-navy w-full p-4 rounded-lg text-lg"
                placeholder="default-user"
              />
              <p className="text-sm text-blue-200 mt-2">
                Stories are saved to your user profile for future reference
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 rounded-lg text-white font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Story...
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  Generate Story
                </>
              )}
            </button>
          </form>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-300">Error</h3>
                <p className="text-red-200">{error}</p>
              </div>
            </div>
          )}

          {/* Story Result */}
          {story && story.length > 0 && (
            <div className="bg-navy-950/50 border border-cyan-500/30 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-semibold text-cyan-300">Generated Story</h3>
              </div>
              <div className="space-y-4">
                {story.map((paragraph, idx) => (
                  <p key={idx} className="text-lg text-blue-100 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Example Themes */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 space-y-4">
          <h2 className="text-xl font-bold text-white">Suggested Themes</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {exampleThemes.map((exampleTheme, idx) => (
              <button
                key={idx}
                onClick={() => loadTheme(exampleTheme)}
                className="text-left p-4 bg-navy-900/30 hover:bg-navy-800/40 rounded-lg border border-cyan-500/20 hover:border-cyan-400/40 transition-all"
              >
                <p className="text-blue-100 font-medium">{exampleTheme}</p>
              </button>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 space-y-4">
          <h2 className="text-xl font-bold text-white">Story Generation Process</h2>
          <div className="space-y-3 text-blue-100">
            <p className="flex items-start gap-3">
              <span className="text-cyan-300 font-bold flex-shrink-0">1.</span>
              <span>Provide a theme or concept that interests you</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-cyan-300 font-bold flex-shrink-0">2.</span>
              <span>Our AI analyzes the theme and generates contextually relevant content</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-cyan-300 font-bold flex-shrink-0">3.</span>
              <span>A coherent narrative is constructed and delivered in real-time</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-cyan-300 font-bold flex-shrink-0">4.</span>
              <span>Your story is automatically saved to your profile for future access</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}