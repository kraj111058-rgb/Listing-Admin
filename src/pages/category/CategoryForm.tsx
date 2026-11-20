import { ImageUpload, InputWithLabel } from "@/components/common"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CategoryStatus } from "@/enums"
import {
  useCategoryById,
  useCreateCategory,
  useRemoveFile,
  useUpdateCategory,
  useUploadFile,
} from "@/hooks/queries"
import { SUPABASE_CONSTANTS } from "@/lib/supabase"
import { generateSlug } from "@/lib/utils"
import { categorySchema, type CategoryFormValues } from "@/schemas"
import type { CategoryPayload } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Check,
  Loader2,
  Plus,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"

const CategoryForm = () => {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [categoryFile, setCategoryFile] = useState<File | null>(null)
  const [isSlugManual, setIsSlugManual] = useState(isEdit)

  // Fetch category data if in edit mode
  const { data: existingCategory, isLoading: isCategoryLoading } = useCategoryById(id as string)

  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile()
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory()
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory()
  const { mutate: removeFile, isPending: isRemoving } = useRemoveFile()

  const isPending = isCreating || isUpdating || isUploading || isRemoving

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      image: "",
      status: CategoryStatus.ACTIVE,
    },
  })

  // Auto-fill form values in edit mode or reset on create
  useEffect(() => {
    if (existingCategory && isEdit) {
      reset({
        name: existingCategory.name,
        slug: existingCategory.slug,
        image: existingCategory.image || "",
        status: existingCategory.status,
      })
      setIsSlugManual(true)
    } else if (!isEdit) {
      reset({
        name: "",
        slug: "",
        image: "",
        status: CategoryStatus.ACTIVE,
      })
      setIsSlugManual(false)
    }
  }, [existingCategory, isEdit, reset])

  // Aligned with BlogForm pattern: upload file on submit, then mutate
  const onSubmit = async (data: CategoryFormValues) => {
    let finalImageUrl = data.image
    let oldImageToRemove: string | null = null

    // 1. Upload Category Image ONLY on submit if a new file was chosen
    if (categoryFile) {
      const uploadRes = await uploadFile({
        file: categoryFile,
        folder: SUPABASE_CONSTANTS.STORAGE.FOLDERS.CATEGORIES,
      })
      finalImageUrl = uploadRes.publicUrl

      // Cleanup old image if it was replaced in edit mode
      if (
        isEdit &&
        existingCategory?.image &&
        existingCategory.image !== finalImageUrl
      ) {
        oldImageToRemove = existingCategory.image
      }
    }

    const payload: CategoryPayload = {
      ...data,
      image: finalImageUrl,
    }

    if (isEdit && id) {
      updateCategory(
        { id, payload },
        {
          onSuccess: () => {
            if (oldImageToRemove) {
              removeFile(
                { fileUrl: oldImageToRemove },
                {
                  onSuccess: () => navigate("/categories"),
                }
              )
            } else {
              navigate("/categories")
            }
          },
        }
      )
    } else {
      createCategory(payload, {
        onSuccess: () => navigate("/categories"),
      })
    }
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {isEdit ? "Edit Category" : "Create New Category"}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {isEdit
            ? `Update details and configurations for "${existingCategory?.name ?? "Category"}".`
            : "Add a new business category to organize platform directory listings."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-2xl border border-border bg-card shadow-xs p-6 sm:p-8 space-y-6">
          {/* Category Name & Slug in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Category Name */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <InputWithLabel
                  id="name"
                  type="text"
                  label="Category Name"
                  placeholder="e.g. Food & Restaurants"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e)
                    if (!isSlugManual) {
                      setValue("slug", generateSlug(e.target.value), {
                        shouldValidate: true,
                      })
                    }
                  }}
                  error={errors.name?.message}
                  disabled={isPending || isCategoryLoading}
                />
              )}
            />

            {/* Category Slug */}
            <Controller
              name="slug"
              control={control}
              render={({ field }) => (
                <InputWithLabel
                  id="slug"
                  type="text"
                  label="URL Slug"
                  description="URL-friendly identifier used in route filters."
                  placeholder="food-restaurants"
                  leftElement={
                    <span className="text-xs font-mono text-muted-foreground">
                      /
                    </span>
                  }
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e)
                    setIsSlugManual(true)
                  }}
                  error={errors.slug?.message}
                  disabled={isPending || isCategoryLoading}
                />
              )}
            />
          </div>

          {/* Category Image Upload */}
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImageUpload
                id="image"
                label="Image"
                value={field.value}
                onChange={field.onChange}
                onFileSelect={setCategoryFile}
                error={errors.image?.message}
                disabled={isPending || isCategoryLoading}
                description="SVG, PNG, JPG or WEBP (max. 5MB)"
              />
            )}
          />

          {/* Category Status Card */}
          <Controller
            name="status"
            control={control}
            render={({ field }) => {
              const isActive = field.value === CategoryStatus.ACTIVE
              return (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-muted/20">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="status"
                        className="text-xs font-semibold text-foreground cursor-pointer"
                      >
                        Status
                      </Label>
                      <Badge
                        variant={isActive ? "success" : "secondary"}
                        className="rounded-full px-2 py-0.5 text-[11px] font-semibold select-none"
                      >
                        {isActive
                          ? CategoryStatus.ACTIVE
                          : CategoryStatus.INACTIVE}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Toggle to make this category active and visible in directory searches and listings.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Switch
                      id="status"
                      checked={isActive}
                      onCheckedChange={(checked) =>
                        field.onChange(
                          checked
                            ? CategoryStatus.ACTIVE
                            : CategoryStatus.INACTIVE
                        )
                      }
                      disabled={isPending || isCategoryLoading}
                      className="data-[checked]:bg-emerald-600 data-[checked]:hover:bg-emerald-700 cursor-pointer"
                    />
                  </div>
                </div>
              )
            }}
          />
        </div>

        {/* Action Buttons Footer */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/categories")}
            disabled={isPending}
            className="px-4 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isPending || isCategoryLoading}
            className="px-5 text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Saving...
              </>
            ) : isEdit ? (
              <>
                <Check className="size-3.5" /> Save Changes
              </>
            ) : (
              <>
                <Plus className="size-3.5" /> Submit
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CategoryForm
