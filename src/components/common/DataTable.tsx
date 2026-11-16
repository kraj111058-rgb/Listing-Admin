import AppPagination from "@/components/common/AppPagination"
import { Loader } from "./Loader"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
  useTable,
  type RowData,
  type ColumnDef as TanStackColumnDef,
} from "@tanstack/react-table"
import { Search } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

// Clean type alias: Only TData is needed!
export type ColumnDef<TData extends RowData> = TanStackColumnDef<
  typeof features,
  TData
>

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  title?: string
  description?: string
  emptyMessage?: string
  className?: string
  tableClassName?: string
  toolbarClassName?: string
  pageLimit?: number
  showPagination?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  toolbarActions?: ReactNode
  total?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  isLoading?: boolean
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  title,
  description,
  emptyMessage = "No results found.",
  className,
  tableClassName,
  toolbarClassName,
  pageLimit = 10,
  showPagination = true,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  toolbarActions,
  total,
  currentPage,
  onPageChange,
  isLoading = false,
}: DataTableProps<TData>) {
  const isServer = total !== undefined

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageLimit,
  })

  // Reset to first page when data length changes (only in client-side mode)
  useEffect(() => {
    if (!isServer) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    }
  }, [data.length, isServer])

  const table = useTable({
    features,
    columns,
    data,
    state: {
      pagination: isServer
        ? { pageIndex: 0, pageSize: data.length || pageLimit }
        : pagination,
    },
    onPaginationChange: setPagination,
  })

  const totalPages = isServer
    ? Math.max(1, Math.ceil((total ?? 0) / pageLimit))
    : table.getPageCount()
  const activePage = isServer
    ? (currentPage ?? 1)
    : pagination.pageIndex + 1
  const currentTotal = isServer ? (total ?? 0) : data.length
  const startEntry =
    currentTotal > 0 ? (activePage - 1) * pageLimit + (data.length > 0 ? 1 : 0) : 0
  const endEntry = Math.min(
    activePage * pageLimit,
    currentTotal
  )

  const showToolbar = Boolean(title || searchPlaceholder || toolbarActions)

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card shadow-xs overflow-hidden",
        className
      )}
    >
      {/* Search & Actions Toolbar */}
      {showToolbar && (
        <div
          className={cn(
            "p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3.5",
            toolbarClassName
          )}
        >
          {title ? (
            <div>
              <h2 className="text-base font-semibold text-foreground">{title}</h2>
              {description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {description}
                </p>
              )}
            </div>
          ) : searchPlaceholder ? (
            <div className="relative flex-1 max-w-md">
              <Search className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue ?? ""}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="h-10 pl-10 pr-4 text-xs rounded-lg bg-muted/40 border-border placeholder:text-muted-foreground"
              />
            </div>
          ) : (
            <div />
          )}

          {toolbarActions}
        </div>
      )}

      {/* Table Body */}
      <div className="overflow-x-auto">
        <Table className={tableClassName}>
          <TableHeader className="bg-muted/50 border-b border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "text-xs font-bold text-muted-foreground uppercase tracking-wider py-3 px-4",
                      header.id === "actions" && "text-right",
                      header.id === "user" && "px-5"
                    )}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="divide-y divide-border">
            {isLoading ? (
              <TableRow>
                <TableCell  
                  colSpan={columns.length}
                  className="h-48 text-center"
                >
                  <Loader fullScreen={false} text="Loading data..." className="py-8" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "py-3.5 px-4 align-middle",
                        cell.column.id === "user" && "px-5",
                        cell.column.id === "actions" && "text-right"
                      )}
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-48 text-center text-muted-foreground font-medium text-base"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {showPagination && currentTotal > 0 && (
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-card">
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">{startEntry}</span>{" "}
            to <span className="font-semibold text-foreground">{endEntry}</span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">{currentTotal}</span>{" "}
            entries
          </div>

          {totalPages > 1 && (
            <AppPagination
              currentPage={activePage}
              totalPages={totalPages}
              onPageChange={(page) => {
                if (isServer) {
                  onPageChange?.(page)
                } else {
                  table.setPageIndex(page - 1)
                }
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default DataTable
