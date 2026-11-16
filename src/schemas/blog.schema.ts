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
  category_id: z
    .string()
    .min(1, "Please select a category"),
  author: z
    .string()
    .trim()
    .min(1, "Author name is required")
    .max(60, "Author name must be under 60 characters"),
  author_role: z
    .string()
    .trim()
    .min(1, "Author role is required")
    .max(80, "Author role must be under 80 characters"),
  author_about: z.string().trim().optional(),
  author_avatar: z
    .string()
    .min(1, "Please upload an author photo"),
  author_instagram: z.string().trim().optional(),
  author_facebook: z.string().trim().optional(),
  author_twitter: z.string().trim().optional(),
  author_linkedin: z.string().trim().optional(),
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
  meta_title: z
    .string()
    .trim()
    .min(1, "Meta title is required"),
  meta_description: z
    .string()
    .trim()
    .min(1, "Meta description is required"),
  meta_keywords: z
    .string()
    .trim()
    .min(1, "Meta keywords are required"),
  status: z.enum(["Published", "Draft"]),
})

export type BlogCategoryFormValues = z.infer<typeof blogCategorySchema>
export type BlogFormValues = z.infer<typeof blogSchema>
