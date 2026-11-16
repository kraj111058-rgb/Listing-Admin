import { supabase, SUPABASE_CONSTANTS } from "@/lib/supabase"
import type { UploadFilePayload, UploadFileResponse } from "@/types"

export const storageService = {
  // Upload a file to Supabase storage bucket and return its public URL & path
  uploadFile: async ({
    file,
    folder,
    bucket = SUPABASE_CONSTANTS.STORAGE.BUCKETS.ONELISTY,
  }: UploadFilePayload): Promise<UploadFileResponse> => {
    // Generate clean unique filename with timestamp
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName= `${Date.now()}_${cleanFileName}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) throw new Error(uploadError.message)

    // Get the public URL of the uploaded image 
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return {
      path: filePath,
      publicUrl: urlData.publicUrl,
    }
  },

  // Remove a single file by public URL
  removeFile: async (
    fileUrl: string,
    bucket: string = SUPABASE_CONSTANTS.STORAGE.BUCKETS.ONELISTY
  ): Promise<void> => {
    if (!fileUrl) return;

    const filePath = storageService.getStoragePathFromUrl(fileUrl, bucket);
    if (!filePath) return;

    const { error } = await supabase.storage.from(bucket).remove([filePath])
    if (error) throw new Error(error.message)
  },

  // Remove multiple files by public URLs
  removeFiles: async (
    fileUrls: string[],
    bucket: string = SUPABASE_CONSTANTS.STORAGE.BUCKETS.ONELISTY
  ): Promise<void> => {
    const filePaths = fileUrls
      .map((item) => storageService.getStoragePathFromUrl(item, bucket))
      .filter((p): p is string => Boolean(p));

    if (filePaths.length === 0) return

    const { error } = await supabase.storage.from(bucket).remove(filePaths)
    if (error) throw new Error(error.message)
  },

  // Helper to extract relative storage path from full Supabase public URL
  getStoragePathFromUrl: (
    url: string,
    bucket: string = SUPABASE_CONSTANTS.STORAGE.BUCKETS.ONELISTY
  ): string | null => {
    if (!url) return null;
    const marker = `/public/${bucket}/`;
    const index = url.indexOf(marker);
    if (index === -1) return null;
    return decodeURIComponent(url.substring(index + marker.length));
  },
}
