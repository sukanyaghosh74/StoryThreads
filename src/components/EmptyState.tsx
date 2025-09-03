'use client'

import { Heart, PenTool } from 'lucide-react'
import Link from 'next/link'

export function EmptyState() {
  return (
    <div className="text-center py-16">
      <Heart className="h-16 w-16 text-rose-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Stories arrive in whispers
      </h3>
      <p className="text-gray-600 mb-6">
        Be the first to start a thread of connection.
      </p>
      <Link
        href="/"
        className="inline-flex items-center space-x-2 bg-rose-500 text-white px-6 py-3 rounded-2xl hover:bg-rose-600 transition-colors"
      >
        <PenTool className="h-4 w-4" />
        <span>Start one</span>
      </Link>
    </div>
  )
}
