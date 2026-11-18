import { BannerAdInquiryStatus } from "@/enums"
import { supabase, SUPABASE_CONSTANTS } from "@/lib/supabase"
import type {
  BannerAdInquiryData,
  BannerAdInquiryQueryParams,
  BannerAdInquiryResponse,
} from "@/types"

export const bannerAdInquiryService = {
  // Fetch inquiries with server-side pagination, search & status filter
  getBannerAdInquiries: async (params?: BannerAdInquiryQueryParams): Promise<BannerAdInquiryResponse> => {
    const page = params?.page ?? 1
    const pageLimit = params?.pageLimit ?? 10
    const search = params?.search?.trim()
    const status = params?.status

    const from = (page - 1) * pageLimit
    const to = from + pageLimit - 1

    let query = supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.BANNER_AD_INQUIRIES)
      .select("*", { count: "exact" })

    // Server-side search across name, email, mobile, banner_type, notes
    if (search) {
      const cleanSearch = search.replace(/[,()]/g, "").trim()
      if (cleanSearch) {
        query = query.or(
          `name.ilike.%${cleanSearch}%,email.ilike.%${cleanSearch}%,mobile.ilike.%${cleanSearch}%,banner_type.ilike.%${cleanSearch}%,notes.ilike.%${cleanSearch}%`
        )
      }
    }

    // Filter by status (All, New, Confirmed, Rejected)
    if (status && status !== "All") {
      query = query.eq("status", status)
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) throw new Error(error.message)

    const total = count ?? 0
    const totalPages = Math.ceil(total / pageLimit)

    return {
      data: (data ?? []) as BannerAdInquiryData[],
      total,
      page,
      pageLimit,
      totalPages,
    }
  },

  // Update inquiry status (New <-> Confirmed <-> Rejected)
  updateStatus: async (
    id: string,
    status: BannerAdInquiryStatus
  ): Promise<BannerAdInquiryData> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.BANNER_AD_INQUIRIES)
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw new Error(error.message)

    return data
  },

  // Delete inquiry
  deleteInquiry: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.BANNER_AD_INQUIRIES)
      .delete()
      .eq("id", id)

    if (error) throw new Error(error.message)
  },
}
