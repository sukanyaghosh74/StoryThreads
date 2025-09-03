import { TopNav } from '@/components/TopNav'
import { ThreadCard } from '@/components/ThreadCard'
import { EmptyState } from '@/components/EmptyState'
import { prisma } from '@/lib/prisma'

async function getThreads() {
  try {
    const threads = await prisma.thread.findMany({
      include: {
        _count: {
          select: { fragments: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return threads.map(thread => ({
      id: thread.id,
      title: thread.title,
      synopsis: thread.synopsis,
      fragmentCount: thread._count.fragments
    }))
  } catch (error) {
    console.error('Error fetching threads:', error)
    return []
  }
}

export default async function ThreadsPage() {
  const threads = await getThreads()

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Threads</h1>
          <p className="text-gray-600">
            Discover stories that resonate with your own experiences.
          </p>
        </div>

        {threads.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {threads.map((thread) => (
              <ThreadCard
                key={thread.id}
                id={thread.id}
                title={thread.title}
                synopsis={thread.synopsis}
                fragmentCount={thread.fragmentCount}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
