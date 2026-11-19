import { z } from "zod"
import { CityStatus } from "@/enums"

export const citySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "City name is required")
    .min(2, "City name must be at least 2 characters")
    .max(60, "City name must be under 60 characters"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .min(2, "Slug must be at least 2 characters")
    .max(60, "Slug must be under 60 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  state_id: z
    .string()
    .min(1, "Please select an Indian state or union territory"),
  state_code: z
    .string()
    .min(1, "State code is required"),
  status: z.nativeEnum(CityStatus),
})

export type CityFormValues = z.infer<typeof citySchema>
