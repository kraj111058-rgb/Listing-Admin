import type { ContactInquiryStatus } from "@/enums"
import type { PaginatedResponse, PaginationParams } from "./common.types"

export interface ContactInquiryData {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: ContactInquiryStatus
  created_at: string
  updated_at: string
}

export interface ContactInquiryQueryParams extends PaginationParams {
  search?: string
  status?: string // "All" | "New" | "Replied" | "Archived"
}

export type ContactInquiryResponse = PaginatedResponse<ContactInquiryData>

export interface ContactInquiryStatsData {
  total: number
  new: number
  replied: number
  archived: number
}
