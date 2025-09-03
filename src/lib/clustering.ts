import { prisma } from './prisma'
import { embed, titleThread, synopsize } from './ai'

const SIMILARITY_THRESHOLD = 0.18

export async function assignToThread(embedding: number[], body: string): Promise<{ id: string; title: string; synopsis?: string }> {
  // Find the nearest existing thread
  const threads = await prisma.thread.findMany({
    where: { centroid: { not: null } },
    include: { fragments: { take: 5 } }
  })

  let bestThread = null
  let bestDistance = Infinity

  for (const thread of threads) {
    if (!thread.centroid) continue
    
    try {
      const centroid = JSON.parse(thread.centroid) as number[]
      const distance = cosineDistance(embedding, centroid)
      
      if (distance < bestDistance) {
        bestDistance = distance
        bestThread = thread
      }
    } catch (error) {
      console.error('Error parsing centroid:', error)
      continue
    }
  }

  // If we found a close enough thread, assign to it and update centroid
  if (bestThread && bestDistance < SIMILARITY_THRESHOLD) {
    // Update centroid as running mean
    const oldCentroid = JSON.parse(bestThread.centroid!) as number[]
    const newCentroid = oldCentroid.map((val, i) => 
      (val + embedding[i]) / 2
    )
    
    await prisma.thread.update({
      where: { id: bestThread.id },
      data: { centroid: JSON.stringify(newCentroid) }
    })

    return {
      id: bestThread.id,
      title: bestThread.title,
      synopsis: bestThread.synopsis || undefined
    }
  }

  // Create new thread
  const title = await titleThread([body], 'new story')
  const synopsis = await synopsize([body])
  
  const newThread = await prisma.thread.create({
    data: {
      title,
      synopsis,
      centroid: JSON.stringify(embedding)
    }
  })

  return {
    id: newThread.id,
    title: newThread.title,
    synopsis: newThread.synopsis || undefined
  }
}

export async function nearestFragments(embedding: number[], k: number = 5): Promise<Array<{ id: string; body: string; anonymous: boolean }>> {
  const fragments = await prisma.fragment.findMany({
    where: { embedding: { not: null } },
    select: { id: true, body: true, anonymous: true, embedding: true }
  })

  const fragmentsWithDistance = fragments
    .map(fragment => {
      try {
        const fragmentEmbedding = JSON.parse(fragment.embedding!) as number[]
        const distance = cosineDistance(embedding, fragmentEmbedding)
        return { ...fragment, distance }
      } catch (error) {
        return { ...fragment, distance: Infinity }
      }
    })
    .filter(f => f.distance !== Infinity)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k)

  return fragmentsWithDistance.map(({ id, body, anonymous }) => ({
    id,
    body,
    anonymous
  }))
}

function cosineDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  normA = Math.sqrt(normA)
  normB = Math.sqrt(normB)

  if (normA === 0 || normB === 0) {
    return 1 // Maximum distance
  }

  const similarity = dotProduct / (normA * normB)
  return 1 - similarity // Convert to distance
}
