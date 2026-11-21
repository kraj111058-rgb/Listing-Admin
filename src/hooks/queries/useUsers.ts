import { userService } from "@/services"
import type { UserQueryParams, UpdateUserStatusPayload } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params?: UserQueryParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  stats: () => [...userKeys.all, "stats"] as const,
}

// 1. Query: Users with Server Pagination, Search & Filter
export const useUsers = (params?: UserQueryParams) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getUsers(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// 2. Query: Single User by ID
export const useUserById = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserById(id!),
    enabled: Boolean(id),
  })
}

// 3. Query: User Stats
export const useUserStats = () => {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => userService.getUserStats(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// 4. Mutation: Update User Status (Active <-> Inactive)
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: UpdateUserStatusPayload) =>
      userService.updateUserStatus({ id, status }),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success(
        `User "${updatedUser.name || updatedUser.email}" status changed to ${updatedUser.status}.`
      )
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// 5. Mutation: Delete User
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { id: string; avatarUrl?: string | null } | string) =>
      userService.deleteUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success("User deleted successfully.")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
