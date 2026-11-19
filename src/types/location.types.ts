import type { CityStatus, StateType } from "@/enums"
import type { CityFormValues } from "@/schemas/city.schema"
import type { PaginatedResponse, PaginationParams } from "./common.types"

export interface StateData {
  id: string
  code: string
  name: string
  type: StateType
  capital: string
  status: CityStatus
  created_at: string
  updated_at: string
}

export interface CityData {
  id: string
  name: string
  slug: string
  state_id: string
  state_code: string
  status: CityStatus
  created_at: string
  updated_at: string
  state?: StateData
  listings_count?: number
}

// 1:1 Direct Match with Form Values - Zero Omit needed
export type CityPayload = CityFormValues

export interface CityQueryParams extends PaginationParams {
  search?: string
  status?: string // "All" | "Active" | "Inactive"
  stateCode?: string
}

export type CityResponse = PaginatedResponse<CityData>

export interface LocationStatsData {
  totalStates: number
  totalCities: number
  activeCities: number
  totalListings: number
}
