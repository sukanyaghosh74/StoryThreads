'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Heart, Eye, EyeOff } from 'lucide-react'
import { AnonToggle } from './AnonToggle'

export function ComposeCard() {
  const { data: session } = useSession()
  const [body, setBody] = useState('')
  const [anonymous, setAnonymous] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResonance, setShowResonance] = useState(false)
  const [resonantFragments, setResonantFragments] = useState<Array<{ id: string; body: string; anonymous: boolean }>>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim() || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/fragments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: body.trim(), anonymous })
      })

      if (response.ok) {
        const data = await response.json()
        setResonantFragments(data.resonance || [])
        setShowResonance(true)
        setBody('')
        
        // Show success message
        const toast = document.createElement('div')
        toast.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
        toast.textContent = 'Thanks for trusting us with this.'
        document.body.appendChild(toast)
        setTimeout(() => toast.remove(), 3000)
      }
    } catch (error) {
      console.error('Error submitting fragment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="text-center">
          <Heart className="h-16 w-16 text-rose-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Turn personal context into shared narratives
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in to share your story fragments and discover threads of connection with others.
          </p>
          <button
            onClick={() => window.location.href = '/api/auth/signin'}
            className="bg-rose-500 text-white px-6 py-3 rounded-2xl hover:bg-rose-600 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-soft p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Share something true
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What's something true you're carrying right now?"
              className="w-full min-h-[120px] p-4 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              maxLength={600}
              required
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {body.length}/600 characters
              </span>
              <AnonToggle 
                anonymous={anonymous} 
                onChange={setAnonymous} 
              />
            </div>
          </div>
          
          <div className="text-center">
            <button
              type="submit"
              disabled={!body.trim() || isSubmitting}
              className="bg-rose-500 text-white px-8 py-3 rounded-2xl hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? 'Sharing...' : 'Share with care'}
            </button>
          </div>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          No metrics. You can delete anytime.
        </p>
      </div>

      {/* Resonance Panel */}
      {showResonance && resonantFragments.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl shadow-soft p-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            People who felt similarly...
          </h3>
          <div className="space-y-3">
            {resonantFragments.map((fragment) => (
              <div key={fragment.id} className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-700 italic">"{fragment.body}"</p>
                <p className="text-sm text-gray-500 mt-2">
                  — {fragment.anonymous ? 'Someone' : 'Anonymous'}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowResonance(false)}
            className="mt-4 text-rose-500 hover:text-rose-600 text-sm transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}
