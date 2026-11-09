import { z } from "zod"

export const blogCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be under 60 characters"),
  slug: z
    .string()
    .trim()
    .min(1, "URL slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and single hyphens"
    ),
  status: z.enum(["Active", "Inactive"]),
})

export const blogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Blog title is required")
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be under 150 characters"),
  slug: z
    .string()
    .trim()
    .min(1, "URL slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and single hyphens"
    ),
  category: z
    .string()
    .min(1, "Please select a category"),
  author: z
    .string()
    .trim()
    .min(1, "Author name is required")
    .max(60, "Author name must be under 60 characters"),
  authorRole: z
    .string()
    .trim()
    .min(1, "Author role is required")
    .max(80, "Author role must be under 80 characters"),
  authorAbout: z.string().trim().optional(),
  authorAvatar: z
    .string()
    .min(1, "Please upload an author photo"),
  authorInstagram: z.string().trim().optional(),
  authorFacebook: z.string().trim().optional(),
  authorTwitter: z.string().trim().optional(),
  authorLinkedin: z.string().trim().optional(),
  tags: z
    .string()
    .trim()
    .min(1, "At least one tag is required (e.g., local-business, seo)"),
  image: z
    .string()
    .min(1, "Please upload a cover image"),
  excerpt: z
    .string()
    .trim()
    .min(1, "Short description is required")
    .min(10, "Description must be at least 10 characters")
    .max(300, "Description cannot exceed 300 characters"),
  content: z
    .string()
    .trim()
    .min(1, "Blog content is required")
    .min(20, "Content must be at least 20 characters"),
  metaTitle: z
    .string()
    .trim()
    .min(1, "Meta title is required"),
  metaDescription: z
    .string()
    .trim()
    .min(1, "Meta description is required"),
  metaKeywords: z
    .string()
    .trim()
    .min(1, "Meta keywords are required"),
  status: z.enum(["Published", "Draft"]),
})

export type BlogCategoryFormValues = z.infer<typeof blogCategorySchema>
export type BlogFormValues = z.infer<typeof blogSchema>


