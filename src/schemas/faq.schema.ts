import { z } from "zod"

export const rejectFaqSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .min(5, "Rejection reason must be at least 5 characters.")
    .max(500, "Rejection reason cannot exceed 500 characters."),
})

export type RejectFaqFormValues = z.infer<typeof rejectFaqSchema>

