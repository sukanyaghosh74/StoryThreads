import { describe, it, expect } from 'vitest'

// Mock the cosine distance function for testing
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

describe('Clustering Algorithm', () => {
  describe('cosineDistance', () => {
    it('should calculate correct cosine distance between identical vectors', () => {
      const a = [1, 0, 0]
      const b = [1, 0, 0]
      const distance = cosineDistance(a, b)
      expect(distance).toBe(0)
    })

    it('should calculate correct cosine distance between orthogonal vectors', () => {
      const a = [1, 0, 0]
      const b = [0, 1, 0]
      const distance = cosineDistance(a, b)
      expect(distance).toBe(1)
    })

    it('should calculate correct cosine distance between similar vectors', () => {
      const a = [1, 0, 0]
      const b = [0.8, 0.6, 0]
      const distance = cosineDistance(a, b)
      expect(distance).toBeCloseTo(0.2, 2)
    })

    it('should throw error for vectors of different lengths', () => {
      const a = [1, 2, 3]
      const b = [1, 2]
      expect(() => cosineDistance(a, b)).toThrow('Vectors must have same length')
    })

    it('should handle zero vectors', () => {
      const a = [0, 0, 0]
      const b = [1, 1, 1]
      const distance = cosineDistance(a, b)
      expect(distance).toBe(1)
    })
  })

  describe('threshold behavior', () => {
    it('should identify vectors within similarity threshold', () => {
      const threshold = 0.18
      const a = [1, 0, 0]
      const b = [0.9, 0.1, 0]
      const distance = cosineDistance(a, b)
      
      expect(distance).toBeLessThan(threshold)
      expect(distance).toBeGreaterThan(0)
    })

    it('should identify vectors outside similarity threshold', () => {
      const threshold = 0.18
      const a = [1, 0, 0]
      const b = [0.5, 0.5, 0.7]
      const distance = cosineDistance(a, b)
      
      expect(distance).toBeGreaterThan(threshold)
    })
  })

  describe('centroid update', () => {
    it('should calculate running mean correctly', () => {
      const oldCentroid = [1, 2, 3]
      const newVector = [3, 4, 5]
      const expectedCentroid = [2, 3, 4] // (1+3)/2, (2+4)/2, (3+5)/2
      
      const updatedCentroid = oldCentroid.map((val, i) => 
        (val + newVector[i]) / 2
      )
      
      expect(updatedCentroid).toEqual(expectedCentroid)
    })
  })
})
