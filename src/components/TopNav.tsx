'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Heart, PenTool } from 'lucide-react'
import Link from 'next/link'

export function TopNav() {
  const { data: session } = useSession()

  return (
    <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 text-gray-900 hover:text-gray-700 transition-colors">
            <Heart className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-semibold">StoryThreads</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/threads" 
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
            >
              <PenTool className="h-4 w-4" />
              <span>Threads</span>
            </Link>
            
            {session ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
