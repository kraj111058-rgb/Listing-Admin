import { z } from "zod"

export const subscriptionPlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Plan name is required")
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be under 60 characters"),
  tag: z
    .string()
    .trim()
    .min(1, "Package tag is required (e.g. PACKAGE 1, STARTER)"),
  icon: z
    .string()
    .trim()
    .min(1, "Please select an icon"),
  price: z
    .number()
    .min(0, "Price cannot be negative"),
  period: z
    .string()
    .trim()
    .min(1, "Period is required (e.g. / 3 months, / forever)"),
  duration_months: z
    .number()
    .min(1, "Duration must be at least 1 month"),
  popular: z.boolean(),
  headline: z
    .string()
    .trim()
    .min(1, "Headline is required")
    .max(120, "Headline must be under 120 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(300, "Description must be under 300 characters"),
  listings_limit: z
    .number()
    .min(1, "Listings limit must be at least 1"),
  services_limit: z
    .number()
    .min(0, "Limit cannot be negative"),
  included_features: z
    .array(z.string().trim())
    .min(1, "Please add at least one feature"),
  status: z.enum(["Active", "Inactive"]),
})

export type SubscriptionPlanFormValues = z.infer<typeof subscriptionPlanSchema>
