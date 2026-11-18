import type { BannerAdInquiryStatus } from "@/enums"
import { bannerAdInquiryService } from "@/services"
import type { BannerAdInquiryQueryParams } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const BANNER_AD_INQUIRY_QUERY_KEYS = {
  all: ["banner-ad-inquiries"] as const,
  list: (params?: BannerAdInquiryQueryParams) => [...BANNER_AD_INQUIRY_QUERY_KEYS.all, "list", params] as const,
} as const

// 1. Fetch Banner Ad Inquiries List
export const useBannerAdInquiries = (params?: BannerAdInquiryQueryParams) => {
  return useQuery({
    queryKey: BANNER_AD_INQUIRY_QUERY_KEYS.list(params),
    queryFn: () => bannerAdInquiryService.getBannerAdInquiries(params),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  })
}

// 2. Update Status Mutation (New <-> Confirmed <-> Rejected)
export const useUpdateBannerAdInquiryStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: BannerAdInquiryStatus
    }) => bannerAdInquiryService.updateStatus(id, status),
    onSuccess: (data) => {
      toast.success(`Inquiry marked as ${data.status}`)
      queryClient.invalidateQueries({
        queryKey: BANNER_AD_INQUIRY_QUERY_KEYS.all,
      })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

// 3. Delete Inquiry Mutation
export const useDeleteBannerAdInquiry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => bannerAdInquiryService.deleteInquiry(id),
    onSuccess: () => {
      toast.success("Banner ad inquiry deleted successfully")
      queryClient.invalidateQueries({
        queryKey: BANNER_AD_INQUIRY_QUERY_KEYS.all,
      })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
