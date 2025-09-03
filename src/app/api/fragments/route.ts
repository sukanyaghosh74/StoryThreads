import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { embed } from '@/lib/ai'
import { assignToThread, nearestFragments } from '@/lib/clustering'
import { createFragmentSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createFragmentSchema.parse(body)

    // Generate embedding
    const embedding = await embed(validatedData.body)

    // Assign to thread or create new one
    const thread = await assignToThread(embedding, validatedData.body)

    // Create fragment
    const fragment = await prisma.fragment.create({
      data: {
        body: validatedData.body,
        anonymous: validatedData.anonymous,
        embedding: JSON.stringify(embedding),
        userId: session.user.id,
        threadId: thread.id
      }
    })

    // Find resonant fragments
    const resonance = await nearestFragments(embedding, 5)

    return NextResponse.json({
      id: fragment.id,
      threadId: thread.id,
      title: thread.title,
      synopsis: thread.synopsis,
      resonance
    })
  } catch (error) {
    console.error('Error creating fragment:', error)
    return NextResponse.json(
      { error: 'Failed to create fragment' },
      { status: 500 }
    )
  }
}
