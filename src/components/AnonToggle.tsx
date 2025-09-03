'use client'

import { Eye, EyeOff } from 'lucide-react'

interface AnonToggleProps {
  anonymous: boolean
  onChange: (anonymous: boolean) => void
}

export function AnonToggle({ anonymous, onChange }: AnonToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!anonymous)}
      className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      title={anonymous ? 'Currently anonymous' : 'Currently visible'}
    >
      {anonymous ? (
        <>
          <EyeOff className="h-4 w-4" />
          <span>Anonymous</span>
        </>
      ) : (
        <>
          <Eye className="h-4 w-4" />
          <span>Visible</span>
        </>
      )}
    </button>
  )
}
