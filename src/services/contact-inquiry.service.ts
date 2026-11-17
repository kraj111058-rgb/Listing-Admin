import { ContactInquiryStatus } from "@/enums"
import { supabase, SUPABASE_CONSTANTS } from "@/lib/supabase"
import type {
  ContactInquiryData,
  ContactInquiryQueryParams,
  ContactInquiryResponse,
  ContactInquiryStatsData,
} from "@/types"

export const contactInquiryService = {
  // Fetch inquiries with server-side pagination, search & status filter
  getContactInquiries: async (
    params?: ContactInquiryQueryParams
  ): Promise<ContactInquiryResponse> => {
    const page = params?.page ?? 1
    const pageLimit = params?.pageLimit ?? 10
    const search = params?.search?.trim()
    const status = params?.status

    const from = (page - 1) * pageLimit
    const to = from + pageLimit - 1

    let query = supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.CONTACT_INQUIRIES)
      .select("*", { count: "exact" })

    // Server-side search across name, email, phone, subject, message
    if (search) {
      const cleanSearch = search.replace(/[,()]/g, "").trim()
      if (cleanSearch) {
        query = query.or(
          `name.ilike.%${cleanSearch}%,email.ilike.%${cleanSearch}%,phone.ilike.%${cleanSearch}%,subject.ilike.%${cleanSearch}%,message.ilike.%${cleanSearch}%`
        )
      }
    }

    // Filter by status (All, New, Replied, Archived)
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
      data: (data ?? []) as ContactInquiryData[],
      total,
      page,
      pageLimit,
      totalPages,
    }
  },

  // Fetch exact inquiry statistics from Supabase
  getContactInquiryStats: async (): Promise<ContactInquiryStatsData> => {
    const table = SUPABASE_CONSTANTS.DB_TABLES.CONTACT_INQUIRIES

    const [totalRes, newRes, repliedRes, archivedRes] = await Promise.all([
      supabase.from(table).select("*", { count: "exact", head: true }),
      supabase.from(table).select("*", { count: "exact", head: true }).eq("status", ContactInquiryStatus.NEW),
      supabase.from(table).select("*", { count: "exact", head: true }).eq("status", ContactInquiryStatus.REPLIED),
      supabase.from(table).select("*", { count: "exact", head: true }).eq("status", ContactInquiryStatus.ARCHIVED),
    ])

    if (totalRes.error) throw new Error(totalRes.error.message)
    if (newRes.error) throw new Error(newRes.error.message)
    if (repliedRes.error) throw new Error(repliedRes.error.message)
    if (archivedRes.error) throw new Error(archivedRes.error.message)

    return {
      total: totalRes.count ?? 0,
      new: newRes.count ?? 0,
      replied: repliedRes.count ?? 0,
      archived: archivedRes.count ?? 0,
    }
  },

  // Update inquiry status (New <-> Replied / Archived)
  updateStatus: async (
    id: string,
    status: ContactInquiryStatus
  ): Promise<ContactInquiryData> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.CONTACT_INQUIRIES)
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw new Error(error.message)

    return data;
  },

  // Delete inquiry
  deleteInquiry: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.CONTACT_INQUIRIES)
      .delete()
      .eq("id", id)

    if (error) throw new Error(error.message)
  },
}
