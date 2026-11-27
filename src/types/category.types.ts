import type { CategoryStatus } from "@/enums"
import type { CategoryFormValues } from "@/schemas/category.schema"
import type { PaginatedResponse, PaginationParams } from "./common.types"

export interface CategoryData {
  id: string
  name: string
  slug: string
  image: string
  status: CategoryStatus
  created_at: string
  updated_at: string
  listingCount?: number
}

// 1:1 Direct Match with Form Values - Zero Omit needed
export type CategoryPayload = CategoryFormValues

export interface CategoryQueryParams extends PaginationParams {
  search?: string
  status?: string // "All" | "Active" | "Inactive"
}

export type CategoryResponse = PaginatedResponse<CategoryData>

export interface CategoryStatsResponse {
  totalCategories: number
  activeCategories: number
  inactiveCategories: number
}
