import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { reactionSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = reactionSchema.parse(body)

    // Check if reaction already exists
    const existingReaction = await prisma.reaction.findUnique({
      where: {
        userId_fragmentId: {
          userId: session.user.id,
          fragmentId: validatedData.fragmentId
        }
      }
    })

    if (existingReaction) {
      // Remove reaction
      await prisma.reaction.delete({
        where: { id: existingReaction.id }
      })
      return NextResponse.json({ reacted: false })
    } else {
      // Add reaction
      await prisma.reaction.create({
        data: {
          userId: session.user.id,
          fragmentId: validatedData.fragmentId
        }
      })
      return NextResponse.json({ reacted: true })
    }
  } catch (error) {
    console.error('Error toggling reaction:', error)
    return NextResponse.json(
      { error: 'Failed to toggle reaction' },
      { status: 500 }
    )
  }
}
