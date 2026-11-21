import type { UserRole, UserStatus } from "@/enums"
import type { PaginatedResponse, PaginationParams } from "./common.types"

export interface UserProfileResponse {
  id: string
  name: string | null
  email: string
  phone: string | null
  avatar_url: string | null
  role: UserRole
  status: UserStatus
  city: string | null
  verified: boolean
  created_at: string
  updated_at: string
}

export type UserItem = UserProfileResponse & {
  totalListings?: number
}

export interface UserQueryParams extends PaginationParams {
  search?: string
  status?: UserStatus | "All"
  role?: UserRole
  sortBy?: "created_at" | "name" | "email"
  sortOrder?: "asc" | "desc"
}

export type UserListResponse = PaginatedResponse<UserProfileResponse>

export interface UserStatsResponse {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  verifiedUsers: number
}

export interface UpdateUserStatusPayload {
  id: string
  status: UserStatus
}
