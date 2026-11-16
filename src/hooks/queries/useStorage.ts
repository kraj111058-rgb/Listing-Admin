import { storageService } from "@/services"
import type {
  RemoveFilePayload,
  RemoveFilesPayload,
  UploadFilePayload
} from "@/types"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useUploadFile = () => {
  return useMutation({
    mutationFn: (payload: UploadFilePayload) => storageService.uploadFile(payload),
    onError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`)
    },
  })
}

export const useRemoveFile = () => {
  return useMutation({
    mutationFn: ({ fileUrl, bucket }: RemoveFilePayload) => storageService.removeFile(fileUrl, bucket),
    onError: (error: Error) => {
      toast.error(`Remove failed: ${error.message}`)
    },
  })
}

export const useRemoveFiles = () => {
  return useMutation({
    mutationFn: ({ fileUrls, bucket }: RemoveFilesPayload) => storageService.removeFiles(fileUrls, bucket),
    onError: (error: Error) => {
      toast.error(`Remove failed: ${error.message}`)
    },
  })
}
