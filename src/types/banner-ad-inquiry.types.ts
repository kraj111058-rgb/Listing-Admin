import type { BannerAdInquiryStatus } from "@/enums"
import type { PaginatedResponse, PaginationParams } from "./common.types"

export interface BannerAdInquiryData {
  id: string
  name: string
  email: string
  mobile: string
  banner_type: string
  width: string
  height: string
  notes?: string | null
  status: BannerAdInquiryStatus
  created_at: string
  updated_at: string
}

export interface BannerAdInquiryQueryParams extends PaginationParams {
  search?: string
  status?: string // "All" | "New" | "Confirmed" | "Rejected"
}

export type BannerAdInquiryResponse = PaginatedResponse<BannerAdInquiryData>
