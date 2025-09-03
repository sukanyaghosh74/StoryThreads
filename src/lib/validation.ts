import { z } from 'zod'

export const createFragmentSchema = z.object({
  body: z.string().min(1).max(600),
  anonymous: z.boolean().default(true)
})

export const resonanceSchema = z.object({
  body: z.string().min(1)
})

export const reactionSchema = z.object({
  fragmentId: z.string().cuid()
})

export const reportSchema = z.object({
  fragmentId: z.string().cuid(),
  reason: z.string().min(1).max(500)
})

export const deleteFragmentSchema = z.object({
  fragmentId: z.string().cuid()
})

export type CreateFragmentInput = z.infer<typeof createFragmentSchema>
export type ResonanceInput = z.infer<typeof resonanceSchema>
export type ReactionInput = z.infer<typeof reactionSchema>
export type ReportInput = z.infer<typeof reportSchema>
export type DeleteFragmentInput = z.infer<typeof deleteFragmentSchema>
