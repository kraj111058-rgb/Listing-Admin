import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  FolderTree,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react"
import DataTable, { type ColumnDef } from "@/components/common/DataTable"
import PopoverMenu from "@/components/common/PopoverMenu"
import { PopoverClose } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import AlertModal from "@/components/common/AlertModal"
import { useDebounce } from "@/hooks/useDebounce"
import {
  useCategories,
  useToggleCategoryStatus,
  useDeleteCategory,
  useRemoveFile,
} from "@/hooks/queries"
import { CategoryStatus } from "@/enums"
import type { CategoryData } from "@/types"
import { cn, formatDate } from "@/lib/utils"

const statusFilters = [
  { label: "All", value: "All" },
  { label: CategoryStatus.ACTIVE, value: CategoryStatus.ACTIVE },
  { label: CategoryStatus.INACTIVE, value: CategoryStatus.INACTIVE },
]

const CategoriesTable = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageLimit = 10
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [deleteModalCategory, setDeleteModalCategory] = useState<CategoryData | null>(null)

  const debouncedSearch = useDebounce(searchQuery, 400)

  // Reset page to 1 when search query or status filter changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, selectedStatus])

  // Queries & Mutations
  const { data, isLoading } = useCategories({
    page,
    pageLimit,
    search: debouncedSearch,
    status: selectedStatus,
  })

  const categories = data?.data ?? []
  const total = data?.total ?? 0

  const hasActiveFilter = Boolean(
    searchQuery.trim() || selectedStatus !== "All"
  );

  const { mutate: toggleStatus, isPending: isToggling } = useToggleCategoryStatus()
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory()
  const { mutate: removeFile } = useRemoveFile()

  const handleToggleStatus = (id: string, checked: boolean) => {
    toggleStatus({
      id,
      status: checked ? CategoryStatus.ACTIVE : CategoryStatus.INACTIVE,
    })
  }

  const handleConfirmDelete = () => {
    if (!deleteModalCategory) return
    deleteCategory(deleteModalCategory.id, {
      onSuccess: () => {
        if (deleteModalCategory.image) {
          removeFile({ fileUrl: deleteModalCategory.image })
        }
        setDeleteModalCategory(null)
      },
    })
  }

  // Column Definitions
  const columns = useMemo<ColumnDef<CategoryData>[]>(
    () => [
      {
        id: "category",
        header: "Category",
        cell: ({ row }) => {
          const cat = row.original
          return (
            <div className="flex items-center gap-3.5">
              <div className="size-11 rounded-xl overflow-hidden border border-border bg-muted/50 shrink-0 relative flex items-center justify-center shadow-2xs">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="size-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <FolderTree className="size-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-foreground text-sm truncate">
                  {cat.name}
                </div>
                <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                  /{cat.slug}
                </div>
              </div>
            </div>
          )
        },
      },
      {
        id: "listingCount",
        header: "Listing Count",
        cell: ({ row }) => {
          const count = row.original.listingCount ?? 0
          return (
            <Badge
              variant="secondary"
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            >
              {count.toLocaleString()} Listings
            </Badge>
          )
        },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const cat = row.original
          const isActive = cat.status === CategoryStatus.ACTIVE

          return (
            <div className="flex items-center gap-2.5">
              <Switch
                checked={isActive}
                onCheckedChange={(checked) =>
                  handleToggleStatus(cat.id, checked)
                }
                disabled={isToggling}
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
                {isActive ? CategoryStatus.ACTIVE : CategoryStatus.INACTIVE}
              </span>
            </div>
          )
        },
      },
      {
        id: "createdAt",
        header: "Created At",
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
                      onClick={() => navigate(`/categories/${cat.id}/edit`)}
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
    [navigate, isToggling]
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        currentPage={page}
        total={total}
        pageLimit={pageLimit}
        onPageChange={(newPage) => setPage(newPage)}
        searchPlaceholder="Search categories by name or slug..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        toolbarActions={
          <Tabs
            value={selectedStatus}
            onValueChange={(val) => setSelectedStatus(val)}
            className="self-start sm:self-auto"
          >
            <TabsList className="h-9 p-1 bg-muted/40 border border-border rounded-lg gap-1">
              {statusFilters.map((st) => (
                <TabsTrigger
                  key={st.value}
                  value={st.value}
                  className="h-7 px-3 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  {st.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
        emptyMessage={
          hasActiveFilter
            ? "No categories found matching your criteria."
            : "No categories found."
        }
      />

      {/* Delete Confirmation Alert Modal */}
      <AlertModal
        open={Boolean(deleteModalCategory)}
        onOpenChange={(open) => {
          if (!isDeleting && !open) setDeleteModalCategory(null)
        }}
        title="Delete Category"
        description={
          deleteModalCategory
            ? `Are you sure you want to delete "${deleteModalCategory.name}"? This action cannot be undone and attached category images will be removed from storage.`
            : ""
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete Category"}
        isLoading={isDeleting}
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}

export default CategoriesTable
