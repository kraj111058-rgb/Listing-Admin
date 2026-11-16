import { BlogCategoryStatus, BlogStatus } from "@/enums"
import { supabase, SUPABASE_CONSTANTS } from "@/lib/supabase"
import type {
  BlogCategoryData,
  BlogCategoryQueryParams,
  BlogCategoryResponse,
  BlogPostQueryParams,
  BlogPostData,
  BlogPostDataWithCategory,
  BlogStatsData,
  CreateBlogCategoryPayload,
  CreateBlogPostPayload,
  BlogPostResponse,
  UpdateBlogCategoryPayload,
  UpdateBlogPostPayload
} from "@/types"

export const blogService = {
  // ==========================================================
  // 1. BLOG CATEGORIES API
  // ==========================================================

  // Fetch categories with server-side pagination, search & status filter
  getCategories: async (params?: BlogCategoryQueryParams): Promise<BlogCategoryResponse> => {
    const page = params?.page ?? 1
    const pageLimit = params?.pageLimit ?? 10
    const search = params?.search?.trim()
    const status = params?.status

    // Pagination range: e.g. page 1 -> 0..9, page 2 -> 10..19
    const from = (page - 1) * pageLimit
    const to = from + pageLimit - 1

    let query = supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.BLOGS_CATEGORY)
      .select("*, blogs(count)", { count: "exact" })

    // Server-side search by name or slug
    if (search) {
      const cleanSearch = search.replace(/[,()]/g, "").trim()
      if (cleanSearch) {
        query = query.or(`name.ilike.%${cleanSearch}%,slug.ilike.%${cleanSearch}%`)
      }
    }

    // Server-side filter by status (All, Active, Inactive)
    if (status && status !== "All") {
      query = query.eq("status", status)
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) throw new Error(error.message);

    const total = count ?? 0
    const totalPages = Math.ceil(total / pageLimit)

    return {
      data: data,
      total,
      page,
      pageLimit,
      totalPages,
    }
  },

  // Fetch all active categories (for dropdown selects without pagination)
  getActiveCategories: async (): Promise<BlogCategoryData[]> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.BLOGS_CATEGORY)
      .select("*")
      .eq("status", BlogCategoryStatus.ACTIVE)
      .order("name", { ascending: true })

    if (error) throw new Error(error.message)
    return data;
  },

  // Fetch single category by ID
  getCategoryById: async (id: string): Promise<BlogCategoryData> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.BLOGS_CATEGORY)
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw new Error(error.message);

    return data;
  },

  // Helper to handle duplicate category unique constraint errors cleanly
  formatCategoryError: (
    error: { code?: string; message: string; details?: string | null },
    payload?: { name?: string; slug?: string }
  ): Error => {
    if (error.code === "23505") {
      const raw = `${error.message} ${error.details || ""}`.toLowerCase();
      if (raw.includes("unique_blog_category_slug") || raw.includes("(slug)=") || raw.includes("slug")) {
        return new Error(
          payload?.slug
            ? `URL slug "${payload.slug}" already exists. Please choose a different slug.`
            : "URL slug already exists. Please choose a different slug."
        );
      }
      if (raw.includes("unique_blog_category_name") || raw.includes("(name)=") || raw.includes("name")) {
        return new Error(
          payload?.name
            ? `Category "${payload.name}" already exists. Please choose a different name.`
            : "Category with this name already exists. Please choose a different name."
        );
      }
      return new Error("Category with this name or slug already exists.");
    }
    return new Error(error.message);
  },

  // Create new category
  createCategory: async (payload: CreateBlogCategoryPayload): Promise<BlogCategoryData> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.BLOGS_CATEGORY)
      .insert(payload)
      .select()
      .single();

    if (error) throw blogService.formatCategoryError(error, payload);

    return data;
  },

  // Update category
  updateCategory: async (id: string, payload: UpdateBlogCategoryPayload): Promise<BlogCategoryData> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.BLOGS_CATEGORY)
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw blogService.formatCategoryError(error, payload);

    return data;
  },

  // Toggle category status
  toggleCategoryStatus: async (id: string, newStatus: BlogCategoryStatus): Promise<BlogCategoryData> => {
    return blogService.updateCategory(id, { status: newStatus })
  },

  // Delete category
  deleteCategory: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.BLOGS_CATEGORY)
      .delete()
      .eq("id", id)

    if (error) throw new Error(error.message);
  },

  // ==========================================================
  // 2. BLOG POSTS API
  // ==========================================================

  // Fetch blogs with server-side pagination, search & status filter
  getBlogs: async (params?: BlogPostQueryParams): Promise<BlogPostResponse> => {
    const page = params?.page ?? 1
    const pageLimit = params?.pageLimit ?? 10
    const search = params?.search?.trim()
    const status = params?.status

    const from = (page - 1) * pageLimit
    const to = from + pageLimit - 1

    let query = supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.BLOGS)
      .select("*, category:category_id (*)", { count: "exact" })

    // Apply status filter ('Published' | 'Draft')
    if (status && status !== "All") {
      query = query.eq("status", status)
    }

    // Apply search filter (title, slug, or author)
    if (search) {
      const cleanSearch = search.replace(/[,()]/g, "").trim()
      if (cleanSearch) {
        query = query.or(
          `title.ilike.%${cleanSearch}%,slug.ilike.%${cleanSearch}%,author.ilike.%${cleanSearch}%`
        )
      }
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) throw new Error(error.message)

    const total = count ?? 0
    const totalPages = Math.ceil(total / pageLimit)

    return {
      data: data,
      total,
      page,
      pageLimit,
      totalPages
    }
  },

  // Fetch blog stats (Total, Published, Draft) using HEAD count queries
  getBlogStats: async (): Promise<BlogStatsData> => {
    const [totalRes, publishedRes, draftRes] = await Promise.all([
      supabase
        .from(SUPABASE_CONSTANTS.DB_TABLES.BLOGS)
        .select("*", { count: "exact", head: true }),
      supabase
        .from(SUPABASE_CONSTANTS.DB_TABLES.BLOGS)
        .select("*", { count: "exact", head: true })
        .eq("status", BlogStatus.PUBLISHED),
      supabase
        .from(SUPABASE_CONSTANTS.DB_TABLES.BLOGS)
        .select("*", { count: "exact", head: true })
        .eq("status", BlogStatus.DRAFT),
    ])

    if (totalRes.error) throw new Error(totalRes.error.message)
    if (publishedRes.error) throw new Error(publishedRes.error.message)
    if (draftRes.error) throw new Error(draftRes.error.message)

    return {
      total: totalRes.count ?? 0,
      published: publishedRes.count ?? 0,
      draft: draftRes.count ?? 0,
    }
  },

  // Fetch single blog by ID with joined category
  getBlogById: async (id: string): Promise<BlogPostDataWithCategory> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.BLOGS)
      .select(`*, category:category_id (*)`)
      .eq("id", id)
      .single()

    if (error) throw new Error(error.message);

    return data;
  },

  // Fetch single blog by Slug
  getBlogBySlug: async (slug: string): Promise<BlogPostDataWithCategory> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.BLOGS)
      .select(`*, category:category_id (*) `)
      .eq("slug", slug)
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  // Helper to handle duplicate blog unique constraint errors cleanly
  formatBlogError: (
    error: { code?: string; message: string; details?: string | null },
    payload?: { title?: string; slug?: string }
  ): Error => {
    if (error.code === "23505") {
      const raw = `${error.message} ${error.details || ""}`.toLowerCase();
      if (raw.includes("slug") || raw.includes("unique_blogs_slug")) {
        return new Error(
          payload?.slug
            ? `Blog slug "${payload.slug}" already exists. Please choose a different slug.`
            : "A blog with this URL slug already exists. Please choose a different slug."
        );
      }
      if (raw.includes("title") || raw.includes("unique_blogs_title")) {
        return new Error(
          payload?.title
            ? `Blog title "${payload.title}" already exists. Please choose a different title.`
            : "A blog with this title already exists. Please choose a different title."
        );
      }
      return new Error("A blog with this title or slug already exists.");
    }
    return new Error(error.message);
  },

  // Create new blog post
  createBlog: async (payload: CreateBlogPostPayload): Promise<BlogPostData> => {
    const isPublished = payload.status === BlogStatus.PUBLISHED
    const published_at = isPublished ? new Date().toISOString() : null;

    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.BLOGS)
      .insert({
        ...payload,
        published_at,
      })
      .select()
      .single()

    if (error) throw blogService.formatBlogError(error, payload);

    return data;
  },

  // Update blog post
  updateBlog: async (id: string, payload: UpdateBlogPostPayload): Promise<BlogPostData> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.BLOGS)
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw blogService.formatBlogError(error, payload);

    return data;
  },

  // Toggle blog status ('Published' | 'Draft')
  toggleBlogStatus: async (id: string, newStatus: BlogStatus): Promise<BlogPostData> => {
    return blogService.updateBlog(id, { status: newStatus });
  },

  // Delete blog post
  deleteBlog: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.BLOGS)
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  },
}
