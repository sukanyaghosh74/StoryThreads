import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const threads = await prisma.thread.findMany({
      include: {
        _count: {
          select: { fragments: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    const formattedThreads = threads.map(thread => ({
      id: thread.id,
      title: thread.title,
      synopsis: thread.synopsis,
      count: thread._count.fragments,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt
    }))

    return NextResponse.json(formattedThreads)
  } catch (error) {
    console.error('Error fetching threads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch threads' },
      { status: 500 }
    )
  }
}
