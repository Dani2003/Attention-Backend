import Link from 'next/link'
import { Brain, Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy-900 border-t border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">BERT Platform</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Advanced AI-powered text analysis and generation platform built with cutting-edge NLP technology.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/predict" className="text-blue-200 hover:text-white text-sm transition">
                  Word Prediction
                </Link>
              </li>
              <li>
                <Link href="/generate" className="text-blue-200 hover:text-white text-sm transition">
                  Story Generation
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-blue-200 hover:text-white text-sm transition">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-blue-200 hover:text-white text-sm transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-blue-200 hover:text-white text-sm transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-blue-200 hover:text-white text-sm transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-navy-800 p-2 rounded-lg text-blue-200 hover:text-white hover:bg-navy-700 transition"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-navy-800 p-2 rounded-lg text-blue-200 hover:text-white hover:bg-navy-700 transition"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@example.com"
                className="bg-navy-800 p-2 rounded-lg text-blue-200 hover:text-white hover:bg-navy-700 transition"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-blue-500/20 text-center">
          <p className="text-blue-300 text-sm">
            © {currentYear} BERT Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}