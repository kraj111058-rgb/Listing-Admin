import type { BlogCategoryStatus, BlogStatus } from "@/enums"
import { blogService } from "@/services"
import type {
  BlogCategoryQueryParams,
  BlogPostQueryParams,
  CreateBlogCategoryPayload,
  CreateBlogPostPayload,
  UpdateBlogCategoryPayload,
  UpdateBlogPostPayload
} from "@/types"
import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query"
import { toast } from "sonner"

export const BLOG_QUERY_KEYS = {
  allBlogs: ["blogs"] as const,
  blogsList: (params?: BlogPostQueryParams) => ["blogs", "list", params] as const,
  blogStats: ["blogs", "stats"] as const,
  blogDetail: (id: string) => ["blogs", id] as const,
  allCategories: ["blog-categories"] as const,
  categoriesList: (params?: BlogCategoryQueryParams) => ["blog-categories", "list", params] as const,
  activeCategories: ["blog-categories", "active"] as const,
  categoryDetail: (id: string) => ["blog-categories", id] as const,
} as const

// ==========================================================
// 1. BLOG CATEGORIES HOOKS
// ==========================================================

export const useBlogCategories = (params?: BlogCategoryQueryParams) => {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.categoriesList(params),
    queryFn: () => blogService.getCategories(params),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  })
}

export const useActiveBlogCategories = () => {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.activeCategories,
    queryFn: () => blogService.getActiveCategories(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  })
}

export const useCreateBlogCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBlogCategoryPayload) => blogService.createCategory(payload),
    onSuccess: () => {
      toast.success("Category created successfully.")
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.allCategories })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateBlogCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBlogCategoryPayload }) => blogService.updateCategory(id, payload),
    onSuccess: () => {
      toast.success("Category updated successfully.")
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.allCategories })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useToggleBlogCategoryStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BlogCategoryStatus }) => blogService.toggleCategoryStatus(id, status),
    onSuccess: () => {
      toast.success("Category status updated.")
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.allCategories })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteBlogCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => blogService.deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted successfully.")
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.allCategories })
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.allBlogs })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

// ==========================================================
// 2. BLOG POSTS HOOKS
// ==========================================================

export const useBlogs = (params?: BlogPostQueryParams) => {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.blogsList(params),
    queryFn: () => blogService.getBlogs(params),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  })
}

export const useBlogStats = () => {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.blogStats,
    queryFn: () => blogService.getBlogStats(),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  })
}

export const useBlogDetail = (id: string) => {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.blogDetail(id),
    queryFn: () => blogService.getBlogById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBlogPostPayload) => blogService.createBlog(payload),
    onSuccess: () => {
      toast.success("Blog created successfully.")
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.allBlogs })
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.allCategories })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({id, payload }: { id: string; payload: UpdateBlogPostPayload }) => blogService.updateBlog(id, payload),
    onSuccess: (_, { id }) => {
      toast.success("Blog updated successfully.")
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.allBlogs })
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.blogDetail(id) })
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.allCategories })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useToggleBlogStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BlogStatus }) => blogService.toggleBlogStatus(id, status),
    onSuccess: (_, { id }) => {
      toast.success("Blog status updated.")
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.allBlogs })
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.blogDetail(id) })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => blogService.deleteBlog(id),
    onSuccess: () => {
      toast.success("Blog deleted successfully.")
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.allBlogs })
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.allCategories })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
