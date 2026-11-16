export const BlogStatus = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
} as const

export type BlogStatus = (typeof BlogStatus)[keyof typeof BlogStatus]

export const BlogCategoryStatus = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const

export type BlogCategoryStatus = (typeof BlogCategoryStatus)[keyof typeof BlogCategoryStatus]
