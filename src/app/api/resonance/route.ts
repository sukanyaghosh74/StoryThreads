import { NextRequest, NextResponse } from 'next/server'
import { embed } from '@/lib/ai'
import { nearestFragments } from '@/lib/clustering'
import { resonanceSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = resonanceSchema.parse(body)

    // Generate embedding for the input text
    const embedding = await embed(validatedData.body)

    // Find nearest fragments
    const fragments = await nearestFragments(embedding, 5)

    return NextResponse.json({ resonance: fragments })
  } catch (error) {
    console.error('Error finding resonance:', error)
    return NextResponse.json(
      { error: 'Failed to find resonance' },
      { status: 500 }
    )
  }
}
