'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'

interface ThreadCardProps {
  id: string
  title: string
  synopsis?: string
  fragmentCount: number
}

export function ThreadCard({ id, title, synopsis, fragmentCount }: ThreadCardProps) {
  return (
    <Link 
      href={`/threads/${id}`}
      className="block bg-white rounded-2xl shadow-soft p-6 hover:shadow-gentle transition-all duration-200 hover:-translate-y-1"
    >
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
          {title}
        </h3>
        
        {synopsis && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {synopsis}
          </p>
        )}
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Heart className="h-4 w-4 text-rose-400" />
          <span>people felt this</span>
          <span className="text-xs">•</span>
          <span>{fragmentCount} stories</span>
        </div>
      </div>
    </Link>
  )
}
