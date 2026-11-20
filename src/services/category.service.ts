import { supabase, SUPABASE_CONSTANTS } from "@/lib/supabase"
import type {
  CategoryData,
  CategoryPayload,
  CategoryQueryParams,
  CategoryResponse,
} from "@/types"
import type { CategoryStatus } from "@/enums"

export const categoryService = {
  // Helper to handle duplicate category unique constraint errors cleanly (23505)
  formatCategoryError: (
    error: { code?: string; message: string; details?: string | null },
    payload?: { name?: string; slug?: string }
  ): Error => {
    if (error.code === "23505") {
      const raw = `${error.message} ${error.details || ""}`.toLowerCase()
      if (
        raw.includes("slug") ||
        raw.includes("categories_slug_key") ||
        raw.includes("idx_categories_slug_lower")
      ) {
        return new Error(
          payload?.slug
            ? `Category slug "${payload.slug}" already exists. Please choose a different slug.`
            : "A category with this URL slug already exists. Please choose a different slug."
        )
      }
      if (
        raw.includes("name") ||
        raw.includes("categories_name_key") ||
        raw.includes("idx_categories_name_lower")
      ) {
        return new Error(
          payload?.name
            ? `Category name "${payload.name}" already exists. Please choose a different name.`
            : "A category with this name already exists. Please choose a different name."
        )
      }
      return new Error("A category with this name or slug already exists.")
    }
    return new Error(error.message)
  },

  // 1. Fetch Categories with Server-side Pagination, Search & Status Filter
  getCategories: async (
    params?: CategoryQueryParams
  ): Promise<CategoryResponse> => {
    const page = params?.page || 1
    const pageLimit = params?.pageLimit || 10
    const from = (page - 1) * pageLimit
    const to = from + pageLimit - 1

    let query = supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.CATEGORIES)
      .select("*", { count: "exact" })

    // Status Filter
    if (params?.status && params.status !== "All") {
      query = query.eq("status", params.status)
    }

    // Sanitized Search Filter (by category name or slug)
    if (params?.search && params.search.trim()) {
      const sanitized = params.search.replace(/[,()]/g, "").trim()
      if (sanitized) {
        query = query.or(`name.ilike.%${sanitized}%,slug.ilike.%${sanitized}%`)
      }
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) throw new Error(error.message)

    const total = count || 0
    const totalPages = Math.ceil(total / pageLimit)

    return {
      data: (data as CategoryData[]) || [],
      total,
      page,
      pageLimit,
      totalPages,
    }
  },

  // 2. Fetch Single Category by ID
  getCategoryById: async (id: string): Promise<CategoryData> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.CATEGORIES)
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw new Error(error.message)
    return data;
  },

  // 3. Create Category (pure database insert matching blogService pattern)
  createCategory: async (payload: CategoryPayload): Promise<CategoryData> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.CATEGORIES)
      .insert(payload)
      .select()
      .single()

    if (error) throw categoryService.formatCategoryError(error, payload)

    return data;
  },

  // 4. Update Category (pure database update matching blogService pattern)
  updateCategory: async (
    id: string,
    payload: Partial<CategoryPayload>
  ): Promise<CategoryData> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.CATEGORIES)
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw categoryService.formatCategoryError(error, payload)

    return data;
  },

  // 5. Toggle Category Status
  toggleCategoryStatus: async (
    id: string,
    newStatus: CategoryStatus
  ): Promise<CategoryData> => {
    return categoryService.updateCategory(id, { status: newStatus })
  },

  // 6. Delete Category
  deleteCategory: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.CATEGORIES)
      .delete()
      .eq("id", id)

    if (error) throw new Error(error.message)
  },
}
