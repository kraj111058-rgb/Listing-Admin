import type { ContactInquiryStatus } from "@/enums"
import { contactInquiryService } from "@/services"
import type {
  ContactInquiryQueryParams,
} from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const CONTACT_INQUIRY_QUERY_KEYS = {
  all: ["contact-inquiries"] as const,
  list: (params?: ContactInquiryQueryParams) => [...CONTACT_INQUIRY_QUERY_KEYS.all, "list", params] as const,
  stats: () => [...CONTACT_INQUIRY_QUERY_KEYS.all, "stats"] as const,
} as const

// 1. Fetch Contact Inquiries List
export const useContactInquiries = (params?: ContactInquiryQueryParams) => {
  return useQuery({
    queryKey: CONTACT_INQUIRY_QUERY_KEYS.list(params),
    queryFn: () => contactInquiryService.getContactInquiries(params),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  })
}

// 2. Fetch Contact Inquiry Statistics
export const useContactInquiryStats = () => {
  return useQuery({
    queryKey: CONTACT_INQUIRY_QUERY_KEYS.stats(),
    queryFn: () => contactInquiryService.getContactInquiryStats(),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  })
}

// 3. Update Status Mutation (New <-> Replied / Archived)
export const useUpdateContactInquiryStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: ContactInquiryStatus
    }) => contactInquiryService.updateStatus(id, status),
    onSuccess: (data) => {
      toast.success(`Inquiry marked as ${data.status}`)
      queryClient.invalidateQueries({
        queryKey: CONTACT_INQUIRY_QUERY_KEYS.all,
      })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

// 4. Delete Inquiry Mutation
export const useDeleteContactInquiry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => contactInquiryService.deleteInquiry(id),
    onSuccess: () => {
      toast.success("Inquiry deleted successfully")
      queryClient.invalidateQueries({
        queryKey: CONTACT_INQUIRY_QUERY_KEYS.all,
      })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
