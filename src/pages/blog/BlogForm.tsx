import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Check,
  Loader2,
  Tag,
} from "lucide-react"
import {
  blogSchema,
  type BlogFormValues,
} from "@/schemas"
import {
  mockBlogs,
  mockBlogCategories,
  type BlogItem,
} from "@/data/dummyData"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  ImageUpload,
  InputWithLabel,
  TextareaWithLabel,
  SelectWithLabel,
  TextEditorwithLabel,
  LinkedinIcon,
  TwitterIcon,
  InstagramIcon,
  FacebookIcon,
} from "@/components/common"
import { generateSlug, cn } from "@/lib/utils"

const BlogForm = () => {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const categoryOptions = mockBlogCategories
    .filter((c) => c.status === "Active")
    .map((cat) => ({
      value: cat.name,
      label: cat.name,
    }))

  const existingBlog = isEdit ? mockBlogs.find((b) => b.id === id) : null
  const [isSlugManual, setIsSlugManual] = useState(isEdit)

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      category: "",
      author: "",
      authorRole: "",
      authorAbout: "",
      authorAvatar: "",
      authorInstagram: "",
      authorFacebook: "",
      authorTwitter: "",
      authorLinkedin: "",
      tags: "",
      image: "",
      excerpt: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      status: "Published",
    },
  })

  const currentStatus = watch("status")

  console.log("currentState++", watch("content"));
  

  // Auto-fill form values in edit mode
  useEffect(() => {
    if (existingBlog) {
      reset({
        title: existingBlog.title,
        slug: existingBlog.slug,
        category: existingBlog.category,
        author: existingBlog.author,
        authorRole: existingBlog.authorRole,
        authorAbout: existingBlog.authorAbout || "",
        authorAvatar: existingBlog.authorAvatar,
        authorInstagram: existingBlog.authorSocialLinks?.instagram || "",
        authorFacebook: existingBlog.authorSocialLinks?.facebook || "",
        authorTwitter: existingBlog.authorSocialLinks?.twitter || "",
        authorLinkedin: existingBlog.authorSocialLinks?.linkedin || "",
        tags: existingBlog.tags?.join(", ") || "",
        image: existingBlog.image,
        excerpt: existingBlog.excerpt,
        content: existingBlog.content,
        metaTitle: existingBlog.metaTitle || "",
        metaDescription: existingBlog.metaDescription || "",
        metaKeywords: existingBlog.metaKeywords || "",
        status: existingBlog.status,
      })
    }
  }, [existingBlog, reset])

  const onSubmit = async (data: BlogFormValues) => {
    // Simulate short network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const parsedTags = data.tags
      ? data.tags
          .split(",")
          .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
          .filter(Boolean)
      : []

    const authorSocialLinks = {
      instagram: data.authorInstagram?.trim() || undefined,
      facebook: data.authorFacebook?.trim() || undefined,
      twitter: data.authorTwitter?.trim() || undefined,
      linkedin: data.authorLinkedin?.trim() || undefined,
    }

    if (isEdit && id) {
      const idx = mockBlogs.findIndex((b) => b.id === id)
      if (idx !== -1) {
        mockBlogs[idx] = {
          ...mockBlogs[idx],
          title: data.title.trim(),
          slug: data.slug.trim(),
          category: data.category,
          author: data.author.trim(),
          authorRole: data.authorRole.trim(),
          authorAbout: data.authorAbout?.trim() || undefined,
          authorAvatar: data.authorAvatar?.trim(),
          authorSocialLinks,
          tags: parsedTags,
          image: data.image.trim(),
          excerpt: data.excerpt.trim(),
          content: data.content.trim(),
          metaTitle: data.metaTitle.trim(),
          metaDescription: data.metaDescription.trim(),
          metaKeywords: data.metaKeywords.trim(),
          status: data.status,
          publishedAt:
            data.status === "Published"
              ? mockBlogs[idx].publishedAt === "Draft"
                ? "Just now"
                : mockBlogs[idx].publishedAt
              : "Draft",
        }
      }
    } else {
      const newBlog: BlogItem = {
        id: `blog-${Date.now()}`,
        title: data.title.trim(),
        slug: data.slug.trim(),
        category: data.category,
        author: data.author.trim(),
        authorRole: data.authorRole.trim(),
        authorAbout: data.authorAbout?.trim() || undefined,
        authorAvatar: data.authorAvatar?.trim(),
        authorSocialLinks,
        tags: parsedTags,
        image: data.image.trim(),
        excerpt: data.excerpt.trim(),
        content: data.content.trim(),
        metaTitle: data.metaTitle.trim(),
        metaDescription: data.metaDescription.trim(),
        metaKeywords: data.metaKeywords.trim(),
        views: 0,
        status: data.status,
        publishedAt:
          data.status === "Published"
            ? new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })
            : "Draft",
        createdAt: "Just now",
      }
      mockBlogs.unshift(newBlog)
    }

    navigate("/blog")
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
            type="button"
            size="sm"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            className="h-9 gap-1.5 px-4 text-xs font-semibold shadow-xs cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Saving...</span>
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                      if (!dirtyFields.metaTitle && (!isEdit || !existingBlog?.metaTitle)) {
                        setValue("metaTitle", val, {
                          shouldValidate: true,
                        })
                      }
                    }}
                    error={errors.title?.message}
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                      if (!dirtyFields.metaDescription && (!isEdit || !existingBlog?.metaDescription)) {
                        setValue("metaDescription", val, {
                          shouldValidate: true,
                        })
                      }
                    }}
                    error={errors.excerpt?.message}
                    disabled={isSubmitting}
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
                    error={errors.image?.message}
                    disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                name="metaTitle"
                control={control}
                render={({ field }) => (
                  <InputWithLabel
                    id="metaTitle"
                    type="text"
                    label="Meta Title"
                    placeholder="e.g. 10 Proven Strategies to Scale Your Local Business Footfall in 2026"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.metaTitle?.message}
                    disabled={isSubmitting}
                  />
                )}
              />

              {/* Meta Description */}
              <Controller
                name="metaDescription"
                control={control}
                render={({ field }) => (
                  <TextareaWithLabel
                    id="metaDescription"
                    label="Meta Description"
                    placeholder="Write a concise overview of the article for search results..."
                    rows={3}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.metaDescription?.message}
                    disabled={isSubmitting}
                  />
                )}
              />

              {/* Meta Keywords */}
              <Controller
                name="metaKeywords"
                control={control}
                render={({ field }) => (
                  <InputWithLabel
                    id="metaKeywords"
                    type="text"
                    label="Meta Keywords"
                    placeholder="e.g. business tips, local seo, footfall growth, marketing"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.metaKeywords?.message}
                    disabled={isSubmitting}
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
                name="category"
                control={control}
                render={({ field }) => (
                  <SelectWithLabel
                    id="category"
                    label="Blog Category"
                    placeholder="Select category..."
                    options={categoryOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.category?.message}
                    disabled={isSubmitting}
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
                name="authorAvatar"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    id="authorAvatar"
                    label="Author Photo"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.authorAvatar?.message}
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                )}
              />

              {/* Author Role */}
              <Controller
                name="authorRole"
                control={control}
                render={({ field }) => (
                  <InputWithLabel
                    id="authorRole"
                    type="text"
                    label="Author Role / Designation"
                    placeholder="e.g. Senior Business Strategist"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.authorRole?.message}
                    disabled={isSubmitting}
                  />
                )}
              />

              {/* Author About (Optional) */}
              <Controller
                name="authorAbout"
                control={control}
                render={({ field }) => (
                  <TextareaWithLabel
                    id="authorAbout"
                    label="Author About (Optional)"
                    placeholder="Write a brief bio or background about the author..."
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.authorAbout?.message}
                    disabled={isSubmitting}
                  />
                )}
              />

              {/* Author Social Links */}
              <div className="pt-3 border-t border-border space-y-3">
                <span className="text-xs font-semibold text-muted-foreground block">
                  Author Social Profiles (Optional)
                </span>

                <Controller
                  name="authorLinkedin"
                  control={control}
                  render={({ field }) => (
                    <InputWithLabel
                      id="authorLinkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.authorLinkedin?.message}
                      disabled={isSubmitting}
                      leftElement={<LinkedinIcon className="size-4" />}
                    />
                  )}
                />

                <Controller
                  name="authorTwitter"
                  control={control}
                  render={({ field }) => (
                    <InputWithLabel
                      id="authorTwitter"
                      type="url"
                      placeholder="https://x.com/username"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.authorTwitter?.message}
                      disabled={isSubmitting}
                      leftElement={<TwitterIcon className="size-4" />}
                    />
                  )}
                />

                <Controller
                  name="authorInstagram"
                  control={control}
                  render={({ field }) => (
                    <InputWithLabel
                      id="authorInstagram"
                      type="url"
                      placeholder="https://instagram.com/username"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.authorInstagram?.message}
                      disabled={isSubmitting}
                      leftElement={<InstagramIcon className="size-4" />}
                    />
                  )}
                />

                <Controller
                  name="authorFacebook"
                  control={control}
                  render={({ field }) => (
                    <InputWithLabel
                      id="authorFacebook"
                      type="url"
                      placeholder="https://facebook.com/username"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.authorFacebook?.message}
                      disabled={isSubmitting}
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
