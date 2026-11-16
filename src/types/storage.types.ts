export interface UploadFilePayload {
  file: File
  folder: string
  bucket?: string
}

export interface UploadFileResponse {
  path: string
  publicUrl: string
}

export interface RemoveFilePayload {
  fileUrl: string
  bucket?: string
}

export interface RemoveFilesPayload {
  fileUrls: string[]
  bucket?: string
}
