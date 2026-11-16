import AlertModal from "@/components/common/AlertModal"
import DataTable, { type ColumnDef } from "@/components/common/DataTable"
import PopoverMenu from "@/components/common/PopoverMenu"
import { UserAvatar } from "@/components/common/UserAvatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PopoverClose } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlogStatus } from "@/enums"
import {
  useBlogs,
  useDeleteBlog,
  useRemoveFiles,
  useToggleBlogStatus,
} from "@/hooks/queries"
import { useDebounce } from "@/hooks/useDebounce"
import { cn, formatDate } from "@/lib/utils"
import type { BlogPostDataWithCategory } from "@/types"
import {
  ExternalLink,
  Eye,
  FileText,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

const statusTabs = [
  { label: "All", value: "All" },
  { label: "Published", value: "Published" },
  { label: "Draft", value: "Draft" },
]

const BlogTable = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageLimit = 10
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [deleteModalBlog, setDeleteModalBlog] = useState<BlogPostDataWithCategory | null>(null)

  const debouncedSearch = useDebounce(searchQuery, 400)

  // Reset to page 1 on filter or search changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, selectedStatus])

  const { data: blogData, isLoading } = useBlogs({
    page,
    pageLimit,
    search: debouncedSearch,
    status: selectedStatus,
  })

  const blogs = blogData?.data ?? []
  const total = blogData?.total ?? 0
  const hasActiveFilter = Boolean(searchQuery.trim()) || selectedStatus !== "All"

  const { mutate: toggleStatus } = useToggleBlogStatus()
  const { mutate: deleteBlog, isPending: isDeleting } = useDeleteBlog()
  const { mutate: removeFiles } = useRemoveFiles()

  // Toggle Published/Draft status via Switch
  const handleToggleStatus = (id: string, checked?: boolean) => {
    const newStatus =
      checked !== undefined
        ? checked
          ? BlogStatus.PUBLISHED
          : BlogStatus.DRAFT
        : BlogStatus.PUBLISHED

    toggleStatus({ id, status: newStatus })
  }

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deleteModalBlog) return

    const filesToRemove = [deleteModalBlog.image, deleteModalBlog.author_avatar].filter(Boolean) as string[]

    deleteBlog(deleteModalBlog.id, {
      onSuccess: () => {
        if (filesToRemove.length > 0) {
          removeFiles({ fileUrls: filesToRemove })
        }
        setDeleteModalBlog(null)
      },
    })
  }

  const columns = useMemo<ColumnDef<BlogPostDataWithCategory>[]>(
    () => [
      {
        id: "blog",
        header: "Blog",
        cell: ({ row }) => {
          const blog = row.original
          return (
            <div className="flex items-center gap-3 py-1 min-w-[260px] max-w-[360px]">
              <div className="size-12 rounded-xl overflow-hidden shrink-0 border border-border bg-muted/40 relative">
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <FileText className="size-5" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-semibold text-foreground line-clamp-1">
                  {blog.title}
                </span>
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5 truncate">
                  /{blog.slug}
                </p>
              </div>
            </div>
          )
        },
      },
      {
        id: "category",
        header: "Category",
        cell: ({ row }) => {
          const catName = row.original.category?.name || "Uncategorized"
          return (
            <Badge
              variant="outline"
              className="text-xs font-semibold rounded-md px-2.5 py-0.75 whitespace-nowrap bg-primary/5 text-primary border-primary/20"
            >
              {catName}
            </Badge>
          )
        },
      },
      {
        id: "author",
        header: "Author",
        cell: ({ row }) => {
          const blog = row.original
          return (
            <div className="flex items-center gap-2.5 min-w-[130px]">
              <UserAvatar
                name={blog.author}
                src={blog.author_avatar || undefined}
                className="size-10"
              />
              <span className="text-xs font-semibold text-foreground truncate">
                {blog.author}
              </span>
            </div>
          )
        },
      },
      {
        id: "views",
        header: "Views",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
            <Eye className="size-3.5 text-muted-foreground" />
            <span className="font-semibold text-foreground">
              {(row.original.views ?? 0).toLocaleString()}
            </span>
          </div>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const blog = row.original
          const isPublished = blog.status === BlogStatus.PUBLISHED

          return (
            <div className="flex items-center gap-2.5">
              <Switch
                checked={isPublished}
                onCheckedChange={(checked) => handleToggleStatus(blog.id, checked)}
                className="data-[checked]:bg-emerald-600 data-[checked]:hover:bg-emerald-700 cursor-pointer"
              />
              <span
                className={cn(
                  "text-xs font-semibold select-none",
                  isPublished
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground"
                )}
              >
                {isPublished ? "Published" : "Draft"}
              </span>
            </div>
          )
        },
      },
      {
        id: "publishedAt",
        header: "Published Date",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDate(row.original.published_at || row.original.created_at)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const blog = row.original
          return (
            <div className="flex items-center justify-end">
              <PopoverMenu
                align="end"
                contentClass="w-40"
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
                      onClick={() => navigate(`/blog/${blog.id}/edit`)}
                      className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold hover:bg-primary/10 hover:text-primary text-foreground cursor-pointer rounded-lg transition-colors group"
                    >
                      <Pencil className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span>Edit Blog</span>
                    </Button>
                  </PopoverClose>

                  <PopoverClose asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`https://listing-website-kohl.vercel.app/blog/${blog.slug}`, "_blank")}
                      className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold hover:bg-muted text-foreground cursor-pointer rounded-lg transition-colors group"
                    >
                      <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span>View Live</span>
                    </Button>
                  </PopoverClose>

                  <PopoverClose asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteModalBlog(blog)}
                      className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-lg transition-colors group"
                    >
                      <Trash2 className="size-3.5 text-destructive transition-colors" />
                      <span>Delete Blog</span>
                    </Button>
                  </PopoverClose>
                </div>
              </PopoverMenu>
            </div>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate]
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={blogs}
        isLoading={isLoading}
        searchPlaceholder="Search blogs by title, slug, or author..."
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
            ? "No blogs found matching your criteria."
            : "No blogs found."
        }
      />

      {/* Delete Confirmation Alert Modal */}
      <AlertModal
        open={!!deleteModalBlog}
        onOpenChange={(open) => {
          if (!isDeleting && !open) {
            setDeleteModalBlog(null)
          }
        }}
        title="Delete Blog?"
        description={
          deleteModalBlog
            ? `Are you sure you want to permanently delete "${deleteModalBlog.title}"? This action cannot be undone and will remove the post and its media.`
            : "Are you sure you want to delete this blog?"
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete Blog"}
        confirmVariant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}

export default BlogTable
