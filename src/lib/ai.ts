import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function embed(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
      input: text,
    })
    
    return response.data[0].embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    // Fallback to a simple hash-based embedding for development
    return generateFallbackEmbedding(text)
  }
}

export async function titleThread(examples: string[], concept: string): Promise<string> {
  try {
    const prompt = `Given these story fragments about "${concept}", generate a short, poetic but clear title (2-4 words max). 
    
Examples:
- "Starting Over"
- "Grief in Small Rooms" 
- "Learning to Be Alone"
- "Homesickness With Hope"

Fragments:
${examples.slice(0, 3).map(f => `- ${f}`).join('\n')}

Title:`

    const response = await openai.chat.completions.create({
      model: process.env.TITLE_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 20,
      temperature: 0.7,
    })

    return response.choices[0].message.content?.trim() || concept
  } catch (error) {
    console.error('Error generating title:', error)
    return concept
  }
}

export async function synopsize(fragments: string[]): Promise<string> {
  try {
    const prompt = `Write a 1-2 sentence synopsis for these story fragments. Keep it gentle, human, and poetic.

Fragments:
${fragments.slice(0, 5).map(f => `- ${f}`).join('\n')}

Synopsis:`

    const response = await openai.chat.completions.create({
      model: process.env.TITLE_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.8,
    })

    return response.choices[0].message.content?.trim() || 'Stories that resonate with the human experience.'
  } catch (error) {
    console.error('Error generating synopsis:', error)
    return 'Stories that resonate with the human experience.'
  }
}

// Fallback embedding for development when OpenAI is not available
function generateFallbackEmbedding(text: string): number[] {
  const hash = text.split('').reduce((a, b) => {
    a = ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff
    return a
  }, 0)
  
  const embedding = new Array(1536).fill(0)
  for (let i = 0; i < 10; i++) {
    embedding[i] = Math.sin(hash + i) * 0.1
  }
  
  return embedding
}
