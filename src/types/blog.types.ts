import type { BlogCategoryStatus, BlogStatus } from "@/enums";
import type { BlogCategoryFormValues } from "@/schemas";
import type { PaginatedResponse } from "./common.types";

// Blogs-Category

export type CreateBlogCategoryPayload = BlogCategoryFormValues;
export type UpdateBlogCategoryPayload = Partial<CreateBlogCategoryPayload>;

export interface BlogCategoryQueryParams {
  page?: number
  pageLimit?: number
  search?: string
  status?: string
}

export interface BlogCategoryData {
  id: string
  name: string
  slug: string
  status: BlogCategoryStatus
  created_at: string
  updated_at: string
  blogs?: { count: number }[]
}

export type BlogCategoryResponse= PaginatedResponse<BlogCategoryData>;

// Blogs

export interface BlogPostQueryParams {
  page?: number
  pageLimit?: number
  search?: string
  status?: string
}

export interface BlogStatsData {
  total: number
  published: number
  draft: number
}

export interface BlogPostData {
  id: string
  title: string
  slug: string
  category_id: string
  author: string
  author_role: string | null
  author_about: string | null
  author_avatar: string | null
  author_instagram: string | null
  author_facebook: string | null
  author_twitter: string | null
  author_linkedin: string | null
  tags: string[]
  image: string
  excerpt: string
  content: string
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  views: number
  status: BlogStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

export type CreateBlogPostPayload = Omit<
  BlogPostData,
  "id" | "views" | "created_at" | "updated_at"
>;
export type UpdateBlogPostPayload = Partial<CreateBlogPostPayload>;

export interface BlogPostDataWithCategory extends BlogPostData {
  category?: BlogCategoryData | null
}

export type BlogPostResponse = PaginatedResponse<BlogPostDataWithCategory>;
