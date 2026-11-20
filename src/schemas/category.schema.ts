import { z } from "zod"
import { CategoryStatus } from "@/enums"

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(100, "Category name cannot exceed 100 characters"),
  slug: z
    .string()
    .trim()
    .min(1, "URL slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and single hyphens"
    ),
  image: z
    .string()
    .min(1, "Please upload a category image"),
  status: z.nativeEnum(CategoryStatus),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
