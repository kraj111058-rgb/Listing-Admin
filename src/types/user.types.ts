import type { UserRole, UserStatus } from "@/enums"

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
