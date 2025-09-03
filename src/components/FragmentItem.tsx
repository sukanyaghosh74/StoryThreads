'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Heart, Trash2, Flag } from 'lucide-react'

interface FragmentItemProps {
  id: string
  body: string
  anonymous: boolean
  authorName?: string
  createdAt: string
  isOwnFragment?: boolean
  hasReacted?: boolean
}

export function FragmentItem({ 
  id, 
  body, 
  anonymous, 
  authorName, 
  createdAt, 
  isOwnFragment = false,
  hasReacted = false 
}: FragmentItemProps) {
  const { data: session } = useSession()
  const [isReacted, setIsReacted] = useState(hasReacted)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleReaction = async () => {
    if (!session) return

    try {
      const response = await fetch('/api/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fragmentId: id })
      })

      if (response.ok) {
        setIsReacted(!isReacted)
      }
    } catch (error) {
      console.error('Error toggling reaction:', error)
    }
  }

  const handleDelete = async () => {
    if (!isOwnFragment || !session) return

    if (!confirm('Are you sure you want to delete this fragment? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fragmentId: id })
      })

      if (response.ok) {
        // Remove from UI - in a real app, you'd want to update the parent component
        window.location.reload()
      }
    } catch (error) {
      console.error('Error deleting fragment:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleReport = async () => {
    if (!session) return

    const reason = prompt('Why are you reporting this fragment?')
    if (!reason) return

    try {
      await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fragmentId: id, reason })
      })
      
      alert('Thank you for your report. We will review it shortly.')
    } catch (error) {
      console.error('Error reporting fragment:', error)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 animate-slide-up">
      <div className="space-y-4">
        <p className="text-gray-800 leading-relaxed text-lg">
          "{body}"
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>
              — {anonymous ? 'Someone' : (authorName || 'Anonymous')}
            </span>
            <span>•</span>
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {session && (
              <button
                onClick={handleReaction}
                className={`p-2 rounded-full transition-colors ${
                  isReacted 
                    ? 'text-rose-500 bg-rose-50' 
                    : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50'
                }`}
                title={isReacted ? 'You resonated with this' : 'I resonate with this'}
              >
                <Heart className={`h-4 w-4 ${isReacted ? 'fill-current' : ''}`} />
              </button>
            )}
            
            {isOwnFragment && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Delete my fragment"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            
            {session && !isOwnFragment && (
              <button
                onClick={handleReport}
                className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors"
                title="Report this fragment"
              >
                <Flag className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
