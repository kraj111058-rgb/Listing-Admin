import type { LoginFormValues } from "@/schemas"
import { authService } from "@/services/auth.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner";

export const AUTH_QUERY_KEY = ["currentUser"] as const;

export const useLogin = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginFormValues) => authService.login(credentials),
    onSuccess: (data) => {
      // Store current user in React Query cache
      toast.success("Welcome back! Login successful.");
      queryClient.setQueryData(AUTH_QUERY_KEY, data);
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      toast.success("Logout successful.");   
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY })
      queryClient.clear();
      navigate("/login")
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => authService.getUser(),
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    retry: false,
  })
}
