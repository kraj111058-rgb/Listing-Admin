import type { SubscriptionPlanStatus } from "@/enums";
import { supabase, SUPABASE_CONSTANTS } from "@/lib/supabase";
import type {
  SubscriptionPlanData,
  SubscriptionPlanPayload,
  SubscriptionPlanQueryParams,
  SubscriptionPlanResponse,
} from "@/types";

export const subscriptionPlanService = {
  // Format Postgres duplicate error codes (23505)
  formatPlanError: (
    error: { code?: string; message: string; details?: string | null },
    planName?: string
  ): Error => {
    if (error.code === "23505") {
      return new Error(
        planName
          ? `A subscription plan with the name "${planName}" already exists. Please choose a different name.`
          : "A subscription plan with this name already exists."
      )
    }
    return new Error(error.message)
  },

  // 1. Fetch Subscription Plans with Pagination, Search & Status Filter
  getSubscriptionPlans: async (
    params?: SubscriptionPlanQueryParams
  ): Promise<SubscriptionPlanResponse> => {
    const page = params?.page || 1
    const pageLimit = params?.pageLimit || 10
    const from = (page - 1) * pageLimit
    const to = from + pageLimit - 1

    let query = supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.SUBSCRIPTION_PLANS)
      .select("*", { count: "exact" })

    // Status Filter
    if (params?.status && params.status !== "All") {
      query = query.eq("status", params.status)
    }

    // Sanitized Search Filter (by name, tag, or headline)
    if (params?.search && params.search.trim()) {
      const sanitized = params.search.replace(/[,()]/g, "").trim()
      if (sanitized) {
        query = query.or(
          `name.ilike.%${sanitized}%,tag.ilike.%${sanitized}%,headline.ilike.%${sanitized}%`
        )
      }
    }

    // Default Order: Created At Descending
    query = query.order("created_at", { ascending: false })

    // Pagination Range
    query = query.range(from, to)

    const { data, count, error } = await query

    if (error) throw new Error(error.message)

    const total = count || 0
    const totalPages = Math.ceil(total / pageLimit)

    return {
      data: (data as SubscriptionPlanData[]) || [],
      total,
      page,
      pageLimit,
      totalPages,
    }
  },

  // 2. Create Subscription Plan
  createSubscriptionPlan: async (
    payload: SubscriptionPlanPayload
  ): Promise<SubscriptionPlanData> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.SUBSCRIPTION_PLANS)
      .insert({
        ...payload,
        name: payload.name.trim(),
        tag: payload.tag.trim().toUpperCase(),
      })
      .select()
      .single()

    if (error) {
      throw subscriptionPlanService.formatPlanError(error, payload.name)
    }

    return data as SubscriptionPlanData
  },

  // 3. Update Subscription Plan
  updateSubscriptionPlan: async (
    id: string,
    payload: SubscriptionPlanPayload
  ): Promise<SubscriptionPlanData> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.SUBSCRIPTION_PLANS)
      .update({
        ...payload,
        name: payload.name.trim(),
        tag: payload.tag.trim().toUpperCase(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw subscriptionPlanService.formatPlanError(error, payload.name)
    }

    return data as SubscriptionPlanData
  },

  // 4. Toggle Status (Active <-> Inactive)
  togglePlanStatus: async (
    id: string,
    status: SubscriptionPlanStatus
  ): Promise<SubscriptionPlanData> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.SUBSCRIPTION_PLANS)
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw new Error(error.message)

    return data as SubscriptionPlanData
  },

  // 5. Delete Subscription Plan
  deleteSubscriptionPlan: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.SUBSCRIPTION_PLANS)
      .delete()
      .eq("id", id)

    if (error) throw new Error(error.message)
  },
}
