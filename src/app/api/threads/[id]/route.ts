import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface ThreadRouteProps {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: ThreadRouteProps) {
  try {
    const thread = await prisma.thread.findUnique({
      where: { id: params.id },
      include: {
        fragments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
    }

    const formattedThread = {
      id: thread.id,
      title: thread.title,
      synopsis: thread.synopsis,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
      fragments: thread.fragments.map(fragment => ({
        id: fragment.id,
        body: fragment.body,
        anonymous: fragment.anonymous,
        createdAt: fragment.createdAt,
        user: fragment.user ? {
          id: fragment.user.id,
          name: fragment.user.name,
          email: fragment.user.email
        } : null
      }))
    }

    return NextResponse.json(formattedThread)
  } catch (error) {
    console.error('Error fetching thread:', error)
    return NextResponse.json(
      { error: 'Failed to fetch thread' },
      { status: 500 }
    )
  }
}
