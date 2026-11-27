import { CategoryStatus } from "@/enums"
import { categoryService } from "@/services"
import type { CategoryPayload, CategoryQueryParams } from "@/types"
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (params?: CategoryQueryParams) => [...categoryKeys.lists(), params] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  stats: () => [...categoryKeys.all, "stats"] as const,
}

// 1. Query: Categories with Server Pagination, Search & Filter
export const useCategories = (params?: CategoryQueryParams) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryService.getCategories(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// 2. Query: Single Category by ID
export const useCategoryById = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategoryById(id!),
    enabled: Boolean(id),
  })
}

// 3. Query: Category Stats
export const useCategoryStats = () => {
  return useQuery({
    queryKey: categoryKeys.stats(),
    queryFn: () => categoryService.getCategoryStats(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// 3. Mutation: Create Category (matching useCreateBlog)
export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CategoryPayload) => categoryService.createCategory(payload),
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success(`Category "${newCategory.name}" created successfully.`)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// 4. Mutation: Update Category (matching useUpdateBlog)
export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<CategoryPayload>
    }) => categoryService.updateCategory(id, payload),
    onSuccess: (updatedCategory) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success(`Category "${updatedCategory.name}" updated successfully.`)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// 5. Mutation: Toggle Category Status
export const useToggleCategoryStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: CategoryStatus
    }) => categoryService.toggleCategoryStatus(id, status),
    onSuccess: (updatedCategory) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      const statusText =
        updatedCategory.status === CategoryStatus.ACTIVE
          ? "activated"
          : "deactivated"
      toast.success(`Category "${updatedCategory.name}" ${statusText} successfully.`)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// 6. Mutation: Delete Category (matching useDeleteBlog)
export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success("Category deleted successfully.")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
