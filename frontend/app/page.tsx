import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-light tracking-tight">BERT Platform</h1>
          <p className="text-xl text-gray-600">AI-powered text prediction and generation</p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-2 gap-6">
          
          <Link href="/predict" className="group">
            <div className="border border-gray-200 rounded-xl p-10 hover:border-black transition-all hover:shadow-lg">
              <h2 className="text-3xl font-medium mb-3">Predict</h2>
              <p className="text-gray-600 text-lg mb-6">Fill in masked words with contextual AI predictions</p>
              <div className="text-sm text-gray-400 group-hover:text-black transition-colors">
                Try it →
              </div>
            </div>
          </Link>

          <Link href="/generate" className="group">
            <div className="border border-gray-200 rounded-xl p-10 hover:border-black transition-all hover:shadow-lg">
              <h2 className="text-3xl font-medium mb-3">Generate</h2>
              <p className="text-gray-600 text-lg mb-6">Create original stories from your themes and ideas</p>
              <div className="text-sm text-gray-400 group-hover:text-black transition-colors">
                Try it →
              </div>
            </div>
          </Link>

        </div>

        {/* Auth Links */}
        <div className="flex justify-center gap-6 text-sm">
          <Link href="/login" className="text-gray-600 hover:text-black transition-colors">
            Sign In
          </Link>
          <span className="text-gray-300">•</span>
          <Link href="/signup" className="text-gray-600 hover:text-black transition-colors">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  )
}