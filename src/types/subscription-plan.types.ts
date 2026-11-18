import type { SubscriptionPlanStatus } from "@/enums"
import type { SubscriptionPlanFormValues } from "@/schemas/subscription.schema"
import type { PaginatedResponse, PaginationParams } from "./common.types"

export interface SubscriptionPlanData {
  id: string
  name: string
  tag: string
  icon: string
  price: number
  period: string
  duration_months: number
  popular: boolean
  headline: string
  description: string
  listings_limit: number
  services_limit: number
  included_features: string[]
  status: SubscriptionPlanStatus
  created_at: string
  updated_at: string
}

export type SubscriptionPlanPayload = SubscriptionPlanFormValues

export interface SubscriptionPlanQueryParams extends PaginationParams {
  search?: string
  status?: string // "All" | "Active" | "Inactive"
}

export type SubscriptionPlanResponse = PaginatedResponse<SubscriptionPlanData>
