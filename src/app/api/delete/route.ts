import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteFragmentSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = deleteFragmentSchema.parse(body)

    // Check if fragment exists and belongs to user
    const fragment = await prisma.fragment.findUnique({
      where: { id: validatedData.fragmentId },
      include: { user: true }
    })

    if (!fragment) {
      return NextResponse.json({ error: 'Fragment not found' }, { status: 404 })
    }

    if (fragment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete fragment
    await prisma.fragment.delete({
      where: { id: validatedData.fragmentId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting fragment:', error)
    return NextResponse.json(
      { error: 'Failed to delete fragment' },
      { status: 500 }
    )
  }
}
