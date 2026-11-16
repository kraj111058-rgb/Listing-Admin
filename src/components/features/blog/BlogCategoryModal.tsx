import { InputWithLabel, Loader } from "@/components/common"
import { Modal } from "@/components/common/modal"
import { Button } from "@/components/ui/button"
import { useCreateBlogCategory, useUpdateBlogCategory } from "@/hooks/queries"
import { cn, generateSlug } from "@/lib/utils"
import { blogCategorySchema, type BlogCategoryFormValues } from "@/schemas/blog.schema"
import type { BlogCategoryData } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { FolderTree } from "lucide-react"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"

interface BlogCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: BlogCategoryData | null
}

const BlogCategoryModal = ({
  open,
  onOpenChange,
  category,
}: BlogCategoryModalProps) => {
  const isEditing = Boolean(category)

  const { mutate: createCategory, isPending: isCreating } = useCreateBlogCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateBlogCategory();
  const isPending = isCreating || isUpdating

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BlogCategoryFormValues>({
    resolver: zodResolver(blogCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      status: "Active",
    },
  })

  // Populate form when editing or resetting
  useEffect(() => {
    if (open) {
      if (category) {
        reset({
          name: category.name,
          slug: category.slug,
          status: category.status,
        })
      } else {
        reset({
          name: "",
          slug: "",
          status: "Active",
        })
      }
    }
  }, [category, open, reset])

  const onSubmit = (data: BlogCategoryFormValues) => {
    if (isEditing && category) {
      updateCategory(
        {
          id: category.id,
          payload: data,
        },
        {
          onSuccess: () => {
            reset();
            onOpenChange(false)
          },
        }
      )
    } else {
      createCategory(data, {
        onSuccess: () => {
          reset();
          onOpenChange(false)
        },
      })
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FolderTree className="size-4" />
          </div>
          <span>{isEditing ? "Edit Category" : "Add Blog Category"}</span>
        </div>
      }
      description={
        isEditing
          ? `Update details and configurations for "${category?.name}".`
          : "Create a new category to group blogs and platform guides."
      }
      className="max-w-md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={handleSubmit(onSubmit)}
            className="cursor-pointer font-semibold gap-1.5"
          >
            {isPending ? (
              <>
                <Loader inline size="xs" />
                <span>{isEditing ? "Saving..." : "Creating..."}</span>
              </>
            ) : (
              <span>{isEditing ? "Save Changes" : "Create Category"}</span>
            )}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-1">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <InputWithLabel
              id="cat-name"
              label="Category Name"
              placeholder="e.g. Business Tips"
              value={field.value}
              onChange={(e) => {
                field.onChange(e)
                if (!isEditing) {
                  setValue("slug", generateSlug(e.target.value), {
                    shouldValidate: true,
                  })
                }
              }}
              error={errors.name?.message}
              disabled={isPending}
            />
          )}
        />

        <Controller
          name="slug"
          control={control}
          render={({ field }) => (
            <InputWithLabel
              id="cat-slug"
              label="URL Slug"
              placeholder="e.g. business-tips"
              value={field.value}
              onChange={field.onChange}
              error={errors.slug?.message}
              description="Web-safe identifier used in URL addresses."
              disabled={isPending}
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground block">
                  Category Status
                </span>
                <p className="text-[11px] text-muted-foreground">
                  {field.value === "Active"
                    ? "Active and available for blog posts"
                    : "Hidden from selection and website"}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-background p-1 border border-border rounded-lg">
                <button
                  type="button"
                  onClick={() => field.onChange("Active")}
                  className={cn(
                    "px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                    field.value === "Active"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange("Inactive")}
                  className={cn(
                    "px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                    field.value === "Inactive"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Inactive
                </button>
              </div>
            </div>
          )}
        />
      </form>
    </Modal>
  )
}
export default BlogCategoryModal

