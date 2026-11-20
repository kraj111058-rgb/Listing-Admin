export const CategoryStatus = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const

export type CategoryStatus = (typeof CategoryStatus)[keyof typeof CategoryStatus]
