import { z } from "zod"

export const rejectListingSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .min(1, "Please provide a rejection reason")
    .min(5, "Rejection reason must be at least 5 characters")
    .max(1000, "Rejection reason cannot exceed 1000 characters"),
})

export type RejectListingFormValues = z.infer<typeof rejectListingSchema>

