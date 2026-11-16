import {
  FacebookIcon,
  ImageUpload,
  InputWithLabel,
  InstagramIcon,
  LinkedinIcon,
  Loader,
  SelectWithLabel,
  TextareaWithLabel,
  TextEditorwithLabel,
  TwitterIcon,
} from "@/components/common"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  useActiveBlogCategories,
  useBlogDetail,
  useCreateBlog,
  useRemoveFiles,
  useUpdateBlog,
  useUploadFile,
} from "@/hooks/queries"
import { SUPABASE_CONSTANTS } from "@/lib/supabase"
import { cn, generateSlug } from "@/lib/utils"
import {
  blogSchema,
  type BlogFormValues,
} from "@/schemas"
import type { CreateBlogPostPayload } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Check,
  Tag,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"

const BlogForm = () => {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  // 1. Fetch live active categories for the category selector
  const { data: activeCategories = [], isLoading: isCategoriesLoading } = useActiveBlogCategories()
  const categoryOptions = activeCategories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }))

  // 2. Fetch existing blog post in edit mode
  const { data: existingBlog, isLoading: isBlogLoading } = useBlogDetail(id as string)

  // 3. Local file state (uploaded to Supabase Storage ONLY on form submit)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isSlugManual, setIsSlugManual] = useState(isEdit)

  // 4. Mutations
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile()
  const { mutateAsync: createBlog, isPending: isCreating } = useCreateBlog()
  const { mutateAsync: updateBlog, isPending: isUpdating } = useUpdateBlog()
  const { mutateAsync: removeFiles, isPending: isRemoving } = useRemoveFiles()

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      category_id: "",
      author: "",
      author_role: "",
      author_about: "",
      author_avatar: "",
      author_instagram: "",
      author_facebook: "",
      author_twitter: "",
      author_linkedin: "",
      tags: "",
      image: "",
      excerpt: "",
      content: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      status: "Published",
    },
  })

  const currentStatus = watch("status")
  const isPending = isCreating || isUpdating || isUploading || isRemoving

  // Auto-fill form values in edit mode
  useEffect(() => {
    if (existingBlog && isEdit) {
      reset({
        title: existingBlog.title,
        slug: existingBlog.slug,
        category_id: existingBlog.category_id || "",
        author: existingBlog.author,
        author_role: existingBlog.author_role || "",
        author_about: existingBlog.author_about || "",
        author_avatar: existingBlog.author_avatar || "",
        author_instagram: existingBlog.author_instagram || "",
        author_facebook: existingBlog.author_facebook || "",
        author_twitter: existingBlog.author_twitter || "",
        author_linkedin: existingBlog.author_linkedin || "",
        tags: existingBlog.tags?.join(", ") || "",
        image: existingBlog.image || "",
        excerpt: existingBlog.excerpt || "",
        content: existingBlog.content || "",
        meta_title: existingBlog.meta_title || "",
        meta_description: existingBlog.meta_description || "",
        meta_keywords: existingBlog.meta_keywords || "",
        status: existingBlog.status,
      })
      setIsSlugManual(true)
    }
  }, [existingBlog, isEdit, reset])

  // Submit Handler: uploads images to Supabase Storage only on submit
  const onSubmit = async (data: BlogFormValues) => {
    let finalImageUrl = data.image
    let finalAvatarUrl = data.author_avatar
    const filesToRemove: string[] = []

    // 1. Upload Cover Image ONLY on submit if a new file was chosen
    if (coverFile) {
      const coverRes = await uploadFile({
        file: coverFile,
        folder: SUPABASE_CONSTANTS.STORAGE.FOLDERS.BLOG_COVERS,
      })
      finalImageUrl = coverRes.publicUrl

      // Cleanup old cover image if it was replaced in edit mode
      if (isEdit && existingBlog?.image && existingBlog.image !== finalImageUrl) {
        filesToRemove.push(existingBlog.image)
      }
    } else if (isEdit && existingBlog?.image && !data.image) {
      // Cleanup old cover image if it was removed in edit mode without selecting a new one
      finalImageUrl = ""
      filesToRemove.push(existingBlog.image)
    }

    // 2. Upload Author Avatar ONLY on submit if a new file was chosen
    if (avatarFile) {
      const avatarRes = await uploadFile({
        file: avatarFile,
        folder: SUPABASE_CONSTANTS.STORAGE.FOLDERS.BLOG_AUTHORS,
      })
      finalAvatarUrl = avatarRes.publicUrl

      // Cleanup old avatar if it was replaced in edit mode
      if (isEdit && existingBlog?.author_avatar && existingBlog.author_avatar !== finalAvatarUrl) {
        filesToRemove.push(existingBlog.author_avatar)
      }
    } else if (isEdit && existingBlog?.author_avatar && !data.author_avatar) {
      // Cleanup old avatar if it was removed in edit mode without selecting a new one
      finalAvatarUrl = ""
      filesToRemove.push(existingBlog.author_avatar)
    }

    // 3. Batch delete any replaced or removed old files from Supabase Storage
    if (filesToRemove.length > 0) {
      try {
        await removeFiles({ fileUrls: filesToRemove })
      } catch (cleanupErr) {
        console.warn("Storage cleanup warning:", cleanupErr)
      }
    }

    // 4. Parse tags
    const parsedTags = data.tags
      ? data.tags
          .split(",")
          .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
          .filter(Boolean)
      : []

    // 5. Construct payload spreading data and overriding transformed fields
    const payload: CreateBlogPostPayload = {
      ...data,
      tags: parsedTags,
      image: finalImageUrl,
      author_avatar: finalAvatarUrl,
      author_about: data.author_about?.trim() || null,
      author_instagram: data.author_instagram?.trim() || null,
      author_facebook: data.author_facebook?.trim() || null,
      author_twitter: data.author_twitter?.trim() || null,
      author_linkedin: data.author_linkedin?.trim() || null,
      published_at:
        data.status === "Published"
          ? existingBlog?.published_at || new Date().toISOString()
          : null,
    }

    if (isEdit && id) {
      await updateBlog(
        { id, payload },
        {
          onSuccess: () => navigate("/blog"),
        }
      )
    } else {
      await createBlog(payload, {
        onSuccess: () => navigate("/blog"),
      })
    }
  }

  // Show loading indicator when loading existing blog in edit mode
  if (isEdit && isBlogLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader fullScreen={false} text="Loading blog details..." className="py-25" />
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {isEdit ? "Edit Blog" : "Create New Blog"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isEdit
              ? `Revise and update "${existingBlog?.title ?? "Blog"}".`
              : "Draft and publish a new blog post for the platform."}
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate("/blog")}
            className="h-9 px-4 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="blog-form"
            size="sm"
            disabled={isPending}
            className="h-9 gap-1.5 px-4 text-xs font-semibold shadow-xs cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader inline size="xs" />
                <span>
                  {isUploading
                    ? "Uploading files..."
                    : isRemoving
                    ? "Cleaning old files..."
                    : isEdit
                    ? "Saving changes..."
                    : "Publishing blog..."}
                </span>
              </>
            ) : (
              <>
                <Check className="size-3.5" />
                <span>{isEdit ? "Save Changes" : "Publish Blog"}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <form id="blog-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Content Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl border border-border bg-card shadow-xs p-6 sm:p-8 space-y-6">
              {/* Blog Title */}
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <InputWithLabel
                    id="title"
                    type="text"
                    label="Blog Title"
                    placeholder="e.g. 10 Proven Strategies to Scale Your Business in 2026"
                    value={field.value}
                    onChange={(e) => {
                      const val = e.target.value
                      field.onChange(e)
                      if (!isSlugManual) {
                        setValue("slug", generateSlug(val), {
                          shouldValidate: true,
                        })
                      }
                      if (!dirtyFields.meta_title && (!isEdit || !existingBlog?.meta_title)) {
                        setValue("meta_title", val, {
                          shouldValidate: true,
                        })
                      }
                    }}
                    error={errors.title?.message}
                    disabled={isPending}
                  />
                )}
              />

              {/* URL Slug */}
              <Controller
                name="slug"
                control={control}
                render={({ field }) => (
                  <InputWithLabel
                    id="slug"
                    type="text"
                    label="URL Slug"
                    placeholder="e.g. 10-proven-strategies-scale-business-2026"
                    value={field.value}
                    onChange={(e) => {
                      setIsSlugManual(true)
                      field.onChange(e)
                    }}
                    error={errors.slug?.message}
                    disabled={isPending}
                    description="The web-safe URL address for this blog post (auto-generated from title)."
                  />
                )}
              />

              {/* Short Description */}
              <Controller
                name="excerpt"
                control={control}
                render={({ field }) => (
                  <TextareaWithLabel
                    id="excerpt"
                    label="Short Description"
                    placeholder="Write a brief 1-2 sentence overview displayed on blog feed cards..."
                    rows={3}
                    value={field.value}
                    onChange={(e) => {
                      const val = e.target.value
                      field.onChange(e)
                      if (!dirtyFields.meta_description && (!isEdit || !existingBlog?.meta_description)) {
                        setValue("meta_description", val, {
                          shouldValidate: true,
                        })
                      }
                    }}
                    error={errors.excerpt?.message}
                    disabled={isPending}
                  />
                )}
              />

              {/* Full Blog Content with TipTap Rich Text Editor */}
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TextEditorwithLabel
                    id="content"
                    label="Blog Content"
                    content={field.value}
                    onChange={field.onChange}
                    error={errors.content?.message}
                    description="Write rich blog posts with formatting, headings, bullet points, quotes, code blocks, and images."
                    descriptionClassName="text-muted-foreground"
                  />
                )}
              />

              {/* Cover Image */}
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    id="image"
                    label="Cover Image"
                    value={field.value}
                    onChange={field.onChange}
                    onFileSelect={setCoverFile}
                    error={errors.image?.message}
                    disabled={isPending}
                    description="Upload a cover image for the blog (max. 5MB)"
                  />
                )}
              />

              {/* Blog Tags */}
              <Controller
                name="tags"
                control={control}
                render={({ field }) => {
                  const tagList = field.value
                    ? field.value
                        .split(",")
                        .map((t) => t.trim().replace(/^#/, ""))
                        .filter(Boolean)
                    : []

                  return (
                    <div className="space-y-2">
                      <InputWithLabel
                        id="tags"
                        type="text"
                        label="Tags"
                        placeholder="e.g. business-growth, local-seo, footfall, tips"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.tags?.message}
                        disabled={isPending}
                        description="Enter comma-separated tags for topic indexing and discovery. (ex. seo, digital-marketing,business-growth)"
                        leftElement={<Tag className="size-4" />}
                      />
                      {tagList.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-semibold text-muted-foreground mr-1">
                            Preview:
                          </span>
                          {tagList.map((tag, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-[11px] font-semibold rounded-lg px-2 py-0.5 border-primary/20 bg-primary/5 text-primary"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }}
              />

              {/* Meta Title */}
              <Controller
                name="meta_title"
                control={control}
                render={({ field }) => (
                  <InputWithLabel
                    id="meta_title"
                    type="text"
                    label="Meta Title"
                    placeholder="e.g. 10 Proven Strategies to Scale Your Local Business Footfall in 2026"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.meta_title?.message}
                    disabled={isPending}
                  />
                )}
              />

              {/* Meta Description */}
              <Controller
                name="meta_description"
                control={control}
                render={({ field }) => (
                  <TextareaWithLabel
                    id="meta_description"
                    label="Meta Description"
                    placeholder="Write a concise overview of the article for search results..."
                    rows={3}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.meta_description?.message}
                    disabled={isPending}
                  />
                )}
              />

              {/* Meta Keywords */}
              <Controller
                name="meta_keywords"
                control={control}
                render={({ field }) => (
                  <InputWithLabel
                    id="meta_keywords"
                    type="text"
                    label="Meta Keywords"
                    placeholder="e.g. business tips, local seo, footfall growth, marketing"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.meta_keywords?.message}
                    disabled={isPending}
                  />
                )}
              />
            </div>
          </div>

          {/* Sidebar Settings Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. Status & Visibility Card */}
            <div className="rounded-2xl border border-border bg-card shadow-xs p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Publishing
                </span>
                <Badge
                  variant="secondary"
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    currentStatus === "Published"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  )}
                >
                  {currentStatus}
                </Badge>
              </div>

              {/* Status Switch Toggle */}
              <Controller
                name="status"
                control={control}
                render={({ field }) => {
                  const isPublished = field.value === "Published"
                  return (
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-foreground block">
                          Published Status
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          {isPublished
                            ? "Blog is live on public website"
                            : "Saved as draft, hidden from public"}
                        </p>
                      </div>
                      <Switch
                        checked={isPublished}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "Published" : "Draft")
                        }
                        className="data-[checked]:bg-emerald-600 cursor-pointer"
                      />
                    </div>
                  )
                }}
              />
            </div>

            {/* 2. Category Card */}
            <div className="rounded-2xl border border-border bg-card shadow-xs p-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block border-b border-border pb-3">
                Category
              </span>

              {/* Category Selector with SelectWithLabel */}
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <SelectWithLabel
                    id="category_id"
                    label="Blog Category"
                    placeholder={
                      isCategoriesLoading
                        ? "Loading categories..."
                        : "Select category..."
                    }
                    options={categoryOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.category_id?.message}
                    disabled={isPending || isCategoriesLoading}
                  />
                )}
              />
            </div>

            {/* 3. Author Profile Card */}
            <div className="rounded-2xl border border-border bg-card shadow-xs p-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block border-b border-border pb-3">
                Author Profile
              </span>

              {/* Author Photo */}
              <Controller
                name="author_avatar"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    id="author_avatar"
                    label="Author Photo"
                    value={field.value}
                    onChange={field.onChange}
                    onFileSelect={setAvatarFile}
                    error={errors.author_avatar?.message}
                    disabled={isPending}
                    description="Upload author profile picture (max. 5MB)"
                    className="[&>div.flex]:flex-col! [&>div.flex]:items-center! [&>div.flex]:text-center [&>div.flex>div:first-child]:size-20! [&>div.flex>div:first-child]:rounded-full! [&>div.flex>div:last-child]:w-full [&>div.flex>div:last-child]:text-center [&>div.flex>div:last-child>div:first-child>p]:justify-center [&>div.flex>div:last-child>div:last-child]:justify-center [&>div.flex>div:last-child>div:last-child]:flex-wrap"
                  />
                )}
              />

              {/* Author Name */}
              <Controller
                name="author"
                control={control}
                render={({ field }) => (
                  <InputWithLabel
                    id="author"
                    type="text"
                    label="Author Name"
                    placeholder="e.g. Raj Sharma"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.author?.message}
                    disabled={isPending}
                  />
                )}
              />

              {/* Author Role */}
              <Controller
                name="author_role"
                control={control}
                render={({ field }) => (
                  <InputWithLabel
                    id="author_role"
                    type="text"
                    label="Author Role / Designation"
                    placeholder="e.g. Senior Business Strategist"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.author_role?.message}
                    disabled={isPending}
                  />
                )}
              />

              {/* Author About (Optional) */}
              <Controller
                name="author_about"
                control={control}
                render={({ field }) => (
                  <TextareaWithLabel
                    id="author_about"
                    label="Author About (Optional)"
                    placeholder="Write a brief bio or background about the author..."
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.author_about?.message}
                    disabled={isPending}
                  />
                )}
              />

              {/* Author Social Links */}
              <div className="pt-3 border-t border-border space-y-3">
                <span className="text-xs font-semibold text-muted-foreground block">
                  Author Social Profiles (Optional)
                </span>

                <Controller
                  name="author_linkedin"
                  control={control}
                  render={({ field }) => (
                    <InputWithLabel
                      id="author_linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.author_linkedin?.message}
                      disabled={isPending}
                      leftElement={<LinkedinIcon className="size-4" />}
                    />
                  )}
                />

                <Controller
                  name="author_twitter"
                  control={control}
                  render={({ field }) => (
                    <InputWithLabel
                      id="author_twitter"
                      type="url"
                      placeholder="https://x.com/username"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.author_twitter?.message}
                      disabled={isPending}
                      leftElement={<TwitterIcon className="size-4" />}
                    />
                  )}
                />

                <Controller
                  name="author_instagram"
                  control={control}
                  render={({ field }) => (
                    <InputWithLabel
                      id="author_instagram"
                      type="url"
                      placeholder="https://instagram.com/username"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.author_instagram?.message}
                      disabled={isPending}
                      leftElement={<InstagramIcon className="size-4" />}
                    />
                  )}
                />

                <Controller
                  name="author_facebook"
                  control={control}
                  render={({ field }) => (
                    <InputWithLabel
                      id="author_facebook"
                      type="url"
                      placeholder="https://facebook.com/username"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.author_facebook?.message}
                      disabled={isPending}
                      leftElement={<FacebookIcon className="size-4" />}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default BlogForm
