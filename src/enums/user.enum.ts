export const UserStatus = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]

export const UserRole = {
  ADMIN: "admin",
  USER: "user",
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]
