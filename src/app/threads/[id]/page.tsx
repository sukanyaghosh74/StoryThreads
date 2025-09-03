import { notFound } from 'next/navigation'
import { TopNav } from '@/components/TopNav'
import { FragmentItem } from '@/components/FragmentItem'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { PenTool } from 'lucide-react'

interface ThreadPageProps {
  params: { id: string }
}

async function getThread(id: string) {
  try {
    const thread = await prisma.thread.findUnique({
      where: { id },
      include: {
        fragments: {
          include: {
            user: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    return thread
  } catch (error) {
    console.error('Error fetching thread:', error)
    return null
  }
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const thread = await getThread(params.id)

  if (!thread) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{thread.title}</h1>
          {thread.synopsis && (
            <p className="text-gray-600 text-lg mb-6">{thread.synopsis}</p>
          )}
          
          <div className="flex items-center justify-between">
            <p className="text-gray-500">
              {thread.fragments.length} story{thread.fragments.length !== 1 ? 'ies' : 'y'}
            </p>
            
            <Link
              href="/"
              className="inline-flex items-center space-x-2 bg-rose-500 text-white px-4 py-2 rounded-2xl hover:bg-rose-600 transition-colors"
            >
              <PenTool className="h-4 w-4" />
              <span>Add your thread</span>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {thread.fragments.map((fragment) => (
            <FragmentItem
              key={fragment.id}
              id={fragment.id}
              body={fragment.body}
              anonymous={fragment.anonymous}
              authorName={fragment.user?.name}
              createdAt={fragment.createdAt.toISOString()}
              isOwnFragment={false} // This would need to be determined by session
              hasReacted={false} // This would need to be determined by session
            />
          ))}
        </div>

        {thread.fragments.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No stories in this thread yet.</p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 bg-rose-500 text-white px-4 py-2 rounded-2xl hover:bg-rose-600 transition-colors"
            >
              <PenTool className="h-4 w-4" />
              <span>Be the first</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
