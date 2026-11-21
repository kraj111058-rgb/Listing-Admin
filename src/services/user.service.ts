import { supabase, SUPABASE_CONSTANTS } from "@/lib/supabase"
import { storageService } from "./storage.service"
import { UserRole, UserStatus } from "@/enums"
import type {
  UserProfileResponse,
  UserQueryParams,
  UserListResponse,
  UserStatsResponse,
  UpdateUserStatusPayload,
} from "@/types"

export const userService = {
  // 1. Fetch Users with Server Pagination, Search & Filter (matching blog.service pattern)
  getUsers: async (params?: UserQueryParams): Promise<UserListResponse> => {
    const page = params?.page ?? 1
    const pageLimit = params?.pageLimit ?? 10
    const search = params?.search?.trim()
    const status = params?.status

    const from = (page - 1) * pageLimit
    const to = from + pageLimit - 1

    let query = supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.USERS)
      .select("*", { count: "exact" })
      .eq("role", UserRole.USER)

    // Status Filter
    if (status && status !== "All") {
      query = query.eq("status", status)
    }

    // Sanitized Search query: name, email, phone (matching blog.service pattern)
    if (search) {
      const cleanSearch = search.replace(/[,()]/g, "").trim()
      if (cleanSearch) {
        query = query.or(
          `name.ilike.%${cleanSearch}%,email.ilike.%${cleanSearch}%,phone.ilike.%${cleanSearch}%`
        )
      }
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) throw new Error(error.message)

    const total = count ?? 0
    const totalPages = Math.ceil(total / pageLimit)

    return {
      data: (data ?? []) as UserProfileResponse[],
      total,
      page,
      pageLimit,
      totalPages,
    }
  },

  // 2. Fetch Single User by ID
  getUserById: async (id: string): Promise<UserProfileResponse> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.USERS)
      .select("*")
      .eq("id", id)
      .single()

    if (error || !data) throw new Error(error?.message || "User not found")

    return data as UserProfileResponse
  },

  // 3. Update User Status (Database Status + Auth Ban/Unban via RPC)
  updateUserStatus: async ({
    id,
    status,
  }: UpdateUserStatusPayload): Promise<UserProfileResponse> => {
    const { error } = await supabase.rpc("update_user_status_by_admin", {
      p_user_id: id,
      p_status: status,
    })

    if (error) throw new Error(error.message)

    return userService.getUserById(id)
  },

  // 4. Delete User Completely (Avatar Storage Cleanup via Storage API + Auth + Database via RPC)
  deleteUser: async (
    payload: { id: string; avatarUrl?: string | null } | string
  ): Promise<boolean> => {
    const id = typeof payload === "string" ? payload : payload.id
    let avatarUrl = typeof payload === "string" ? null : payload.avatarUrl

    // If avatarUrl was not passed directly, lookup from database before deleting user
    if (!avatarUrl) {
      const { data: userProfile } = await supabase
        .from(SUPABASE_CONSTANTS.DB_TABLES.USERS)
        .select("avatar_url")
        .eq("id", id)
        .maybeSingle()

      avatarUrl = userProfile?.avatar_url || null
    }

    // 1. Clean avatar from storage via official Storage API if exists
    if (avatarUrl) {
      try {
        await storageService.removeFile(avatarUrl)
      } catch (storageErr) {
        console.warn("Avatar cleanup warning:", storageErr)
      }
    }

    // 2. Call RPC to delete from auth.users and public.users
    const { error } = await supabase.rpc("delete_user_by_admin", {
      p_user_id: id,
    })

    if (error) throw new Error(error.message)
    return true
  },

  // 5. Fetch User Stats using HEAD count queries (matching blogService.getBlogStats)
  getUserStats: async (): Promise<UserStatsResponse> => {
    const [totalRes, activeRes, inactiveRes, verifiedRes] = await Promise.all([
      supabase
        .from(SUPABASE_CONSTANTS.DB_TABLES.USERS)
        .select("*", { count: "exact", head: true })
        .eq("role", UserRole.USER),
      supabase
        .from(SUPABASE_CONSTANTS.DB_TABLES.USERS)
        .select("*", { count: "exact", head: true })
        .eq("role", UserRole.USER)
        .eq("status", UserStatus.ACTIVE),
      supabase
        .from(SUPABASE_CONSTANTS.DB_TABLES.USERS)
        .select("*", { count: "exact", head: true })
        .eq("role", UserRole.USER)
        .eq("status", UserStatus.INACTIVE),
      supabase
        .from(SUPABASE_CONSTANTS.DB_TABLES.USERS)
        .select("*", { count: "exact", head: true })
        .eq("role", UserRole.USER)
        .eq("verified", true),
    ])

    if (totalRes.error) throw new Error(totalRes.error.message)
    if (activeRes.error) throw new Error(activeRes.error.message)
    if (inactiveRes.error) throw new Error(inactiveRes.error.message)
    if (verifiedRes.error) throw new Error(verifiedRes.error.message)

    return {
      totalUsers: totalRes.count ?? 0,
      activeUsers: activeRes.count ?? 0,
      inactiveUsers: inactiveRes.count ?? 0,
      verifiedUsers: verifiedRes.count ?? 0,
    }
  },
}
