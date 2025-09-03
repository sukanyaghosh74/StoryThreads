import { PrismaClient } from '@prisma/client'
import { embed, titleThread, synopsize } from '../src/lib/ai'

const prisma = new PrismaClient()

const seedFragments = [
  "I'm starting over in a new city. Everything feels unfamiliar, but there's something exciting about being unknown.",
  "The grief comes in waves. Sometimes I'm fine, other times I can't breathe. Today is a breathing day.",
  "First day at my new job. I'm terrified of messing up, but also proud I got here.",
  "Friendship drift is real. We used to talk every day, now it's been months. I miss them but don't know how to bridge the gap.",
  "Learning to be alone has been harder than I expected. But I'm getting better at it.",
  "Identity crisis at 25. Who am I really? Am I the person I think I am, or just what others expect?",
  "Homesickness hits different when you're an adult. You can't just call mom and ask her to come get you.",
  "Starting over after a breakup. The apartment feels too big, too quiet. But I'm filling it with new memories.",
  "Grief in small rooms. My grandmother's kitchen will never smell the same.",
  "New city, new me? Or just the same me in a different place?",
  "First job anxiety is real. What if they find out I'm not as smart as they think?",
  "Friendship drift part 2: Sometimes people grow apart and that's okay. It doesn't mean the friendship wasn't real.",
  "Learning to be alone part 2: I went to a restaurant by myself today. It was actually nice.",
  "Identity crisis update: Maybe I don't need to have it all figured out. Maybe being a work in progress is okay.",
  "Homesickness with hope: Missing home but excited about the possibilities here.",
  "Starting over again: This time feels different. I'm older, wiser, and more intentional."
]

async function main() {
  console.log('🌱 Starting seed...')

  // Create initial threads with embeddings
  const threads = [
    {
      title: "Starting Over",
      synopsis: "Stories of new beginnings, fresh starts, and the courage to begin again.",
      fragments: [0, 7, 9, 15]
    },
    {
      title: "Grief in Small Rooms",
      synopsis: "The quiet moments of loss and remembrance that shape our healing journey.",
      fragments: [1, 8]
    },
    {
      title: "Learning to Be Alone",
      synopsis: "Finding comfort and growth in solitude, one day at a time.",
      fragments: [4, 12]
    },
    {
      title: "Homesickness With Hope",
      synopsis: "Missing what's familiar while embracing the promise of new places and experiences.",
      fragments: [6, 14]
    },
    {
      title: "Identity in Progress",
      synopsis: "The ongoing journey of self-discovery and accepting that we're always becoming.",
      fragments: [5, 13]
    },
    {
      title: "Friendship Drift",
      synopsis: "The natural evolution of relationships and learning to let go with grace.",
      fragments: [3, 11]
    },
    {
      title: "First Job Jitters",
      synopsis: "The anxiety and excitement of professional beginnings and imposter syndrome.",
      fragments: [2, 10]
    }
  ]

  for (const threadData of threads) {
    const thread = await prisma.thread.create({
      data: {
        title: threadData.title,
        synopsis: threadData.synopsis,
        centroid: JSON.stringify([0.1, 0.2, 0.3, 0.4, 0.5]) // Placeholder embedding
      }
    })

    // Create fragments for this thread
    for (const fragmentIndex of threadData.fragments) {
      const fragmentText = seedFragments[fragmentIndex]
      const embedding = await embed(fragmentText)
      
      await prisma.fragment.create({
        data: {
          body: fragmentText,
          anonymous: true,
          embedding: JSON.stringify(embedding),
          threadId: thread.id
        }
      })
    }
  }

  console.log('✅ Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
