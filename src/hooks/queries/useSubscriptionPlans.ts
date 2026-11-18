import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { subscriptionPlanService } from "@/services"
import type {
  SubscriptionPlanPayload,
  SubscriptionPlanQueryParams,
} from "@/types"
import type { SubscriptionPlanStatus } from "@/enums"

export const SUBSCRIPTION_PLANS_QUERY_KEYS = {
  all: ["subscription-plans"] as const,
  list: (params?: SubscriptionPlanQueryParams) => [...SUBSCRIPTION_PLANS_QUERY_KEYS.all, "list", params] as const,
} as const

// 1. Fetch Subscription Plans Query Hook
export const useSubscriptionPlans = (params?: SubscriptionPlanQueryParams) => {
  return useQuery({
    queryKey: SUBSCRIPTION_PLANS_QUERY_KEYS.list(params),
    queryFn: () => subscriptionPlanService.getSubscriptionPlans(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// 2. Create Subscription Plan Mutation
export const useCreateSubscriptionPlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SubscriptionPlanPayload) =>
      subscriptionPlanService.createSubscriptionPlan(payload),
    onSuccess: (data) => {
      toast.success(`Plan "${data.name}" created successfully`)
      queryClient.invalidateQueries({
        queryKey: SUBSCRIPTION_PLANS_QUERY_KEYS.all,
      })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// 3. Update Subscription Plan Mutation
export const useUpdateSubscriptionPlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: SubscriptionPlanPayload
    }) => subscriptionPlanService.updateSubscriptionPlan(id, payload),
    onSuccess: (data) => {
      toast.success(`Plan "${data.name}" updated successfully`)
      queryClient.invalidateQueries({
        queryKey: SUBSCRIPTION_PLANS_QUERY_KEYS.all,
      })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// 4. Toggle Plan Status Mutation (Active <-> Inactive)
export const useToggleSubscriptionPlanStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: SubscriptionPlanStatus
    }) => subscriptionPlanService.togglePlanStatus(id, status),
    onSuccess: (data) => {
      toast.success(
        `Plan "${data.name}" is now ${data.status}`
      )
      queryClient.invalidateQueries({
        queryKey: SUBSCRIPTION_PLANS_QUERY_KEYS.all,
      })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// 5. Delete Subscription Plan Mutation
export const useDeleteSubscriptionPlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      subscriptionPlanService.deleteSubscriptionPlan(id),
    onSuccess: () => {
      toast.success("Subscription plan deleted successfully")
      queryClient.invalidateQueries({
        queryKey: SUBSCRIPTION_PLANS_QUERY_KEYS.all,
      })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
