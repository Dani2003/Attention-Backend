'use client'

import { useState } from 'react'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

const API_BASE = 'https://bert-story-api.proudsea-fc459dc9.eastus.azurecontainerapps.io'

export default function PredictPage() {
  const [inputText, setInputText] = useState('')
  const [prediction, setPrediction] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputText.includes('[MASK]')) {
      setError('Please include [MASK] token in your input text')
      return
    }

    setLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      })

      if (!response.ok) {
        throw new Error('Prediction request failed')
      }

      const data = await response.json()
      setPrediction(data.predictions?.[0] || 'No prediction available')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const exampleSentences = [
    'The capital of France is [MASK].',
    'I love to eat [MASK] for breakfast.',
    'The [MASK] is shining brightly today.',
    'She plays the [MASK] beautifully.',
  ]

  const loadExample = (example: string) => {
    setInputText(example)
    setPrediction(null)
    setError(null)
  }

  return (
    <main className="min-h-screen gradient-navy py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            BERT Word Prediction
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Advanced masked language modeling for context-aware word prediction
          </p>
        </div>

        {/* Main Card */}
        <div className="card-glass p-8 rounded-2xl space-y-6">
          <form onSubmit={handlePredict} className="space-y-6">
            <div>
              <label htmlFor="input-text" className="block text-lg font-semibold text-white mb-3">
                Enter your text with [MASK] token
              </label>
              <textarea
                id="input-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="input-navy w-full p-4 rounded-lg text-lg min-h-[120px] resize-y"
                placeholder="Example: The [MASK] chased the mouse."
                required
              />
              <p className="text-sm text-blue-300 mt-2">
                Use [MASK] to indicate where you want the model to predict a word
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
                  Processing...
                </>
              ) : (
                'Predict Word'
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

          {/* Prediction Result */}
          {prediction && (
            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-6 space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-semibold text-green-300">Prediction Result</h3>
              </div>
              <div className="bg-navy-950/50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-white">{prediction}</p>
              </div>
              <p className="text-sm text-blue-300">
                Original: {inputText.replace('[MASK]', `[${prediction}]`)}
              </p>
            </div>
          )}
        </div>

        {/* Example Sentences */}
        <div className="card-glass p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">Try These Examples</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {exampleSentences.map((example, idx) => (
              <button
                key={idx}
                onClick={() => loadExample(example)}
                className="text-left p-4 bg-navy-900/50 hover:bg-navy-800/50 rounded-lg border border-blue-500/20 hover:border-blue-400/40 transition-all"
              >
                <p className="text-blue-200">{example}</p>
              </button>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="card-glass p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">How It Works</h2>
          <div className="space-y-3 text-blue-200">
            <p className="flex items-start gap-3">
              <span className="text-cyan-300 font-bold flex-shrink-0">1.</span>
              <span>Enter a sentence with one [MASK] token where you want to predict a word</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-cyan-300 font-bold flex-shrink-0">2.</span>
              <span>Our BERT model analyzes the surrounding context bidirectionally</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-cyan-300 font-bold flex-shrink-0">3.</span>
              <span>The most contextually appropriate word is predicted and displayed</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}