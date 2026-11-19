import { CityStatus } from "@/enums";
import { supabase, SUPABASE_CONSTANTS } from "@/lib/supabase";
import type {
  CityData,
  CityPayload,
  CityQueryParams,
  CityResponse,
  LocationStatsData,
  StateData,
} from "@/types";

export const locationService = {
  // Format Postgres duplicate error codes (23505) - Aligned with Blog Service Pattern
  formatLocationError: (
    error: { code?: string; message: string; details?: string | null },
    payload?: { name?: string; slug?: string }
  ): Error => {
    if (error.code === "23505") {
      const raw = `${error.message} ${error.details || ""}`.toLowerCase()
      if (raw.includes("slug") || raw.includes("cities_slug_key")) {
        return new Error(
          payload?.slug
            ? `City slug "${payload.slug}" already exists. Please choose a different slug.`
            : "A city with this URL slug already exists. Please choose a different slug."
        )
      }
      return new Error(
        payload?.name
          ? `City "${payload.name}" already exists.`
          : "A city with this name or slug already exists."
      )
    }
    return new Error(error.message)
  },

  // 1. Get All States (ordered by name)
  getStates: async (): Promise<StateData[]> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.STATES)
      .select("*")
      .order("name", { ascending: true })

    if (error) throw new Error(error.message)
    return (data as StateData[]) || []
  },

  // 2. Fetch Cities with Server-side Pagination, Search, Status & State Filter
  getCities: async (params?: CityQueryParams): Promise<CityResponse> => {
    const page = params?.page || 1
    const pageLimit = params?.pageLimit || 10
    const from = (page - 1) * pageLimit
    const to = from + pageLimit - 1

    let query = supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.CITIES)
      .select("*, state:states!cities_state_id_fkey(*)", { count: "exact" })

    // Status Filter
    if (params?.status && params.status !== "All") {
      query = query.eq("status", params.status)
    }

    // State Code Filter
    if (params?.stateCode && params.stateCode !== "All") {
      query = query.eq("state_code", params.stateCode)
    }

    // Sanitized Search Filter (by city name or slug)
    if (params?.search && params.search.trim()) {
      const sanitized = params.search.replace(/[,()]/g, "").trim()
      if (sanitized) {
        query = query.or(`name.ilike.%${sanitized}%,slug.ilike.%${sanitized}%`)
      }
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) throw new Error(error.message)

    const total = count || 0
    const totalPages = Math.ceil(total / pageLimit)

    return {
      data: (data as CityData[]) || [],
      total,
      page,
      pageLimit,
      totalPages,
    }
  },

  // 3. Get Location Stats (Fast Exact Server-side Counts)
  getLocationStats: async (): Promise<LocationStatsData> => {
    const [statesRes, citiesRes, activeCitiesRes] = await Promise.all([
      supabase
        .from(SUPABASE_CONSTANTS.DB_TABLES.STATES)
        .select("*", { count: "exact", head: true }),
      supabase
        .from(SUPABASE_CONSTANTS.DB_TABLES.CITIES)
        .select("*", { count: "exact", head: true }),
      supabase
        .from(SUPABASE_CONSTANTS.DB_TABLES.CITIES)
        .select("*", { count: "exact", head: true })
        .eq("status", CityStatus.ACTIVE),
    ])

    if (statesRes.error) throw new Error(statesRes.error.message)
    if (citiesRes.error) throw new Error(citiesRes.error.message)
    if (activeCitiesRes.error) throw new Error(activeCitiesRes.error.message)

    return {
      totalStates: statesRes.count || 0,
      totalCities: citiesRes.count || 0,
      activeCities: activeCitiesRes.count || 0,
      totalListings: 0, // Until listings table is migrated
    }
  },

  // 4. Create New City
  createCity: async (payload: CityPayload): Promise<CityData> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.CITIES)
      .insert({
        ...payload,
      })
      .select("*, state:states!cities_state_id_fkey(*)")
      .single()

    if (error) throw locationService.formatLocationError(error, payload);

    return data;
  },

  // 5. Update Existing City (Clean spread + updated_at like blogService)
  updateCity: async (
    id: string,
    payload: Partial<CityPayload>
  ): Promise<CityData> => {
    const { data, error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.CITIES)
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*, state:states!cities_state_id_fkey(*)")
      .single()

    if (error) throw locationService.formatLocationError(error, payload)

    return data;
  },

  // 6. Toggle City Status (Active / Inactive)
  toggleCityStatus: async (
    id: string,
    newStatus: CityStatus
  ): Promise<CityData> => {
    return locationService.updateCity(id, { status: newStatus })
  },

  // 7. Delete City
  deleteCity: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.CITIES)
      .delete()
      .eq("id", id)

    if (error) throw new Error(error.message)
  },
}
