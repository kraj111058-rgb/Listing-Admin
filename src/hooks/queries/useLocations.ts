import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"
import { locationService } from "@/services"
import { CityStatus } from "@/enums"
import type { CityPayload, CityQueryParams } from "@/types"

export const locationKeys = {
  all: ["locations"] as const,
  states: () => [...locationKeys.all, "states"] as const,
  cities: (params?: CityQueryParams) => [...locationKeys.all, "cities", params] as const,
  stats: () => [...locationKeys.all, "stats"] as const,
}

// 1. Query: All States (Master Data - Cached for 1 Hour)
export const useStates = () => {
  return useQuery({
    queryKey: locationKeys.states(),
    queryFn: () => locationService.getStates(),
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

// 2. Query: Cities with Pagination, Search, Status & State Filter
export const useCities = (params?: CityQueryParams) => {
  return useQuery({
    queryKey: locationKeys.cities(params),
    queryFn: () => locationService.getCities(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// 3. Query: Location Stats
export const useLocationStats = () => {
  return useQuery({
    queryKey: locationKeys.stats(),
    queryFn: () => locationService.getLocationStats(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// 4. Mutation: Create City
export const useCreateCity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CityPayload) => locationService.createCity(payload),
    onSuccess: (newCity) => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all })
      toast.success(`City "${newCity.name}" created successfully.`)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create city.")
    },
  })
}

// 5. Mutation: Update City
export const useUpdateCity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<CityPayload>
    }) => locationService.updateCity(id, payload),
    onSuccess: (updatedCity) => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all })
      toast.success(`City "${updatedCity.name}" updated successfully.`)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update city.")
    },
  })
}

// 6. Mutation: Toggle City Status (Active / Inactive)
export const useToggleCityStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: CityStatus
    }) => locationService.toggleCityStatus(id, status),
    onSuccess: (updatedCity) => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all })
      const statusText =
        updatedCity.status === CityStatus.ACTIVE ? "activated" : "deactivated"
      toast.success(`City "${updatedCity.name}" ${statusText} successfully.`)
    },
    onError: (error: Error) => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all })
      toast.error(error.message || "Failed to update city status.")
    },
  })
}

// 7. Mutation: Delete City
export const useDeleteCity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => locationService.deleteCity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all })
      toast.success("City deleted successfully.")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete city.")
    },
  })
}
