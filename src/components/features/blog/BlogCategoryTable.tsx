import AlertModal from "@/components/common/AlertModal"
import DataTable, { type ColumnDef } from "@/components/common/DataTable"
import PopoverMenu from "@/components/common/PopoverMenu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PopoverClose } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlogCategoryStatus } from "@/enums"
import {
  useBlogCategories,
  useDeleteBlogCategory,
  useToggleBlogCategoryStatus,
} from "@/hooks/queries"
import { useDebounce } from "@/hooks/useDebounce"
import { cn, formatDate } from "@/lib/utils"
import type { BlogCategoryData } from "@/types"
import {
  FolderTree,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

interface BlogCategoryTableProps {
  onEditCategory: (category: BlogCategoryData) => void
}

const statusTabs = [
  { label: "All", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
]

const BlogCategoryTable = ({ onEditCategory }: BlogCategoryTableProps) => {
  const [page, setPage] = useState(1);
  const pageLimit = 10;

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [deleteModalCategory, setDeleteModalCategory] = useState<BlogCategoryData | null>(null)

  const debouncedSearch = useDebounce(searchQuery, 400);

  // Reset to page 1 when search or status filter changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, selectedStatus])

  const { data: categoryData, isLoading } = useBlogCategories({
    page,
    pageLimit,
    search: debouncedSearch,
    status: selectedStatus,
  })

  const categories = categoryData?.data ?? []
  const total = categoryData?.total ?? 0
  const hasActiveFilter = Boolean(searchQuery.trim()) || selectedStatus !== "All"

  const { mutate: toggleStatus } = useToggleBlogCategoryStatus()
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteBlogCategory()

  // Toggle category status
  const handleToggleStatus = (id: string, checked?: boolean) => {
    const newStatus =
      checked !== undefined
        ? checked
          ? BlogCategoryStatus.ACTIVE
          : BlogCategoryStatus.INACTIVE
        : BlogCategoryStatus.ACTIVE

    toggleStatus({ id, status: newStatus })
  }

  // Delete Category confirmation
  const handleConfirmDelete = () => {
    if (!deleteModalCategory) return;

    deleteCategory(deleteModalCategory.id, {
      onSuccess: () => {
        setDeleteModalCategory(null)
      }
    })
  }

  const columns = useMemo<ColumnDef<BlogCategoryData>[]>(
    () => [
      {
        id: "name",
        header: "Category",
        cell: ({ row }) => {
          const cat = row.original
          return (
            <div className="flex items-center gap-3 py-1 min-w-[200px]">
              <div className="size-9 rounded-xl border border-border bg-primary/5 text-primary flex items-center justify-center shrink-0">
                <FolderTree className="size-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-semibold text-foreground block">
                  {cat.name}
                </span>
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5 truncate">
                  /{cat.slug}
                </p>
              </div>
            </div>
          )
        },
      },
      {
        id: "blogCount",
        header: "Assigned Blogs",
        cell: ({ row }) => {
          const cat = row.original
          const count = cat.blogs?.[0]?.count ?? 0
          return (
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-xs font-semibold rounded-lg px-2.5 py-0.5 bg-muted/40 border-border"
              >
                {count} {count > 1 ? "Blogs" : "Blog"}
              </Badge>
            </div>
          )
        },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const cat = row.original
          const isActive = cat.status === "Active"

          return (
            <div className="flex items-center gap-2.5">
              <Switch
                checked={isActive}
                onCheckedChange={(checked) => handleToggleStatus(cat.id, checked)}
                className="data-[checked]:bg-emerald-600 data-[checked]:hover:bg-emerald-700 cursor-pointer"
              />
              <span
                className={cn(
                  "text-xs font-semibold select-none",
                  isActive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground"
                )}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          )
        },
      },
      {
        id: "createdAt",
        header: "Created Date",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDate(row.original.created_at)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const cat = row.original
          return (
            <div className="flex items-center justify-end">
              <PopoverMenu
                align="end"
                contentClass="w-38"
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                }
              >
                <div className="flex flex-col gap-0.5">
                  <PopoverClose asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditCategory(cat)}
                      className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold hover:bg-primary/10 hover:text-primary text-foreground cursor-pointer rounded-lg transition-colors group"
                    >
                      <Pencil className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span>Edit Category</span>
                    </Button>
                  </PopoverClose>

                  <PopoverClose asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteModalCategory(cat)}
                      className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-lg transition-colors group"
                    >
                      <Trash2 className="size-3.5 text-destructive transition-colors" />
                      <span>Delete Category</span>
                    </Button>
                  </PopoverClose>
                </div>
              </PopoverMenu>
            </div>
          )
        },
      },
    ],
    [categories]
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        searchPlaceholder="Search categories by name or slug..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        total={total}
        currentPage={page}
        onPageChange={setPage}
        pageLimit={pageLimit}
        toolbarActions={
          <div className="flex flex-wrap items-center gap-2">
            <Tabs
              value={selectedStatus}
              onValueChange={(val) => setSelectedStatus(val)}
              className="self-start sm:self-auto"
            >
              <TabsList className="h-9 p-1 bg-muted/40 border border-border rounded-lg gap-1">
                {statusTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="h-7 px-3 text-xs font-semibold rounded-lg"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        }
        emptyMessage={
          hasActiveFilter
            ? "No categories found matching your criteria."
            : "No categories found."
        }
      />

      {/* Delete Confirmation Alert Modal */}
      <AlertModal
        open={!!deleteModalCategory}
        onOpenChange={(open) => {
          if (!isDeleting && !open) {
            setDeleteModalCategory(null)
          }
        }}
        title="Delete Category?"
        description={
          deleteModalCategory
            ? `Are you sure you want to permanently delete "${deleteModalCategory.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this category?"
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete Category"}
        confirmVariant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}

export default BlogCategoryTable
