import { useEffect, useMemo, useState } from "react"
import {
  MoreVertical,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Ruler,
} from "lucide-react"
import DataTable, { type ColumnDef } from "@/components/common/DataTable"
import PopoverMenu from "@/components/common/PopoverMenu"
import { PopoverClose } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import AlertModal from "@/components/common/AlertModal"
import { UserAvatar } from "@/components/common"
import { BannerAdInquiryStatus } from "@/enums"
import {
  useBannerAdInquiries,
  useDeleteBannerAdInquiry,
  useUpdateBannerAdInquiryStatus,
} from "@/hooks/queries"
import { useDebounce } from "@/hooks/useDebounce"
import { cn, formatDate } from "@/lib/utils"
import type { BannerAdInquiryData } from "@/types"
import BannerAdInquiryDetailsModal from "./BannerAdInquiryDetailsModal"

const statusTabs = [
  { label: "All", value: "All" },
  { label: "New", value: BannerAdInquiryStatus.NEW },
  { label: "Confirmed", value: BannerAdInquiryStatus.CONFIRMED },
  { label: "Rejected", value: BannerAdInquiryStatus.REJECTED },
]

const getPlacementBadgeClass = (type: string) => {
  switch (type) {
    case "Header Banner":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
    case "Side Banner":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
    case "Blog Page Banner":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
    case "Footer Banner":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
    case "All in One":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

const BannerAdsInquiriesTable = () => {
  const [page, setPage] = useState(1)
  const pageLimit = 10
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedInquiry, setSelectedInquiry] = useState<BannerAdInquiryData | null>(null)
  const [deleteModalInquiry, setDeleteModalInquiry] = useState<BannerAdInquiryData | null>(null)

  const debouncedSearch = useDebounce(searchQuery, 400)

  // Reset to page 1 on search or filter change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, selectedStatus])

  // Fetch inquiries from Supabase
  const { data: inquiryResponse, isLoading } = useBannerAdInquiries({
    page,
    pageLimit,
    search: debouncedSearch,
    status: selectedStatus,
  })

  const inquiries = inquiryResponse?.data ?? []
  const total = inquiryResponse?.total ?? 0
  const hasActiveFilter = Boolean(searchQuery.trim()) || selectedStatus !== "All"

  const { mutate: updateStatus, isPending: isUpdating } = useUpdateBannerAdInquiryStatus()
  const { mutate: deleteInquiry, isPending: isDeleting } = useDeleteBannerAdInquiry()

  // Status Change Handler
  const handleStatusChange = (id: string, newStatus: BannerAdInquiryStatus) => {
    updateStatus({ id, status: newStatus })
  }

  // Delete Handler
  const handleConfirmDelete = () => {
    if (!deleteModalInquiry) return
    deleteInquiry(deleteModalInquiry.id, {
      onSuccess: () => {
        setDeleteModalInquiry(null)
      },
    })
  }

  const columns = useMemo<ColumnDef<BannerAdInquiryData>[]>(
    () => [
      {
        id: "advertiser",
        header: "Advertiser Contact",
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="flex items-center gap-3 py-1 min-w-[220px]">
              <UserAvatar name={item.name} />
              <div className="min-w-0 flex-1">
                <span className="text-sm font-bold text-foreground block truncate">
                  {item.name}
                </span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="truncate">{item.email}</span>
                </div>
              </div>
            </div>
          )
        },
      },
      {
        id: "phone",
        header: "Contact No.",
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground min-w-[125px]">
              <Phone className="size-3 text-muted-foreground shrink-0" />
              <a
                href={`tel:${item.mobile}`}
                className="hover:text-primary hover:underline transition-colors cursor-pointer"
                title={`Call ${item.name} (${item.mobile})`}
              >
                {item.mobile}
              </a>
            </div>
          )
        },
      },
      {
        id: "placement",
        header: "Placement & Size",
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="min-w-[170px] space-y-1">
              <Badge
                className={cn(
                  "font-bold text-[11px] px-2 py-0.5 border shadow-2xs",
                  getPlacementBadgeClass(item.banner_type)
                )}
              >
                {item.banner_type}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Ruler className="size-3" />
                <span>
                  {item.width} × {item.height}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        id: "createdAt",
        header: "Submitted",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDate(row.original.created_at)}
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const item = row.original
          const isConfirmed = item.status === BannerAdInquiryStatus.CONFIRMED
          const isRejected = item.status === BannerAdInquiryStatus.REJECTED
          const isNew = item.status === BannerAdInquiryStatus.NEW

          return (
            <div className="min-w-[110px]">
              <Badge
                variant="secondary"
                className={cn(
                  "gap-1 font-semibold text-xs px-2.5 py-0.5 rounded-full whitespace-nowrap",
                  isNew &&
                    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
                  isConfirmed &&
                    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                  isRejected &&
                    "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                )}
              >
                {isConfirmed && <CheckCircle2 className="size-3" />}
                {isRejected && <XCircle className="size-3" />}
                {isNew && <Clock className="size-3" />}
                <span>{item.status}</span>
              </Badge>
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original

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
                      onClick={() => setSelectedInquiry(item)}
                      className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold hover:bg-primary/10 hover:text-primary text-foreground cursor-pointer rounded-lg transition-colors group"
                    >
                      <Eye className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span>View Details</span>
                    </Button>
                  </PopoverClose>

                  {item.status !== BannerAdInquiryStatus.CONFIRMED && (
                    <PopoverClose asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(item.id, BannerAdInquiryStatus.CONFIRMED)}
                        className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold hover:bg-emerald-500/10 hover:text-emerald-600 text-foreground cursor-pointer rounded-lg transition-colors group"
                      >
                        <CheckCircle2 className="size-3.5 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                        <span>Confirm</span>
                      </Button>
                    </PopoverClose>
                  )}

                  {item.status !== BannerAdInquiryStatus.REJECTED && (
                    <PopoverClose asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(item.id, BannerAdInquiryStatus.REJECTED)}
                        className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold hover:bg-rose-500/10 hover:text-rose-600 text-foreground cursor-pointer rounded-lg transition-colors group"
                      >
                        <XCircle className="size-3.5 text-muted-foreground group-hover:text-rose-600 transition-colors" />
                        <span>Reject</span>
                      </Button>
                    </PopoverClose>
                  )}

                  {item.status !== BannerAdInquiryStatus.NEW && (
                    <PopoverClose asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(item.id, BannerAdInquiryStatus.NEW)}
                        className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold hover:bg-amber-500/10 hover:text-amber-600 text-foreground cursor-pointer rounded-lg transition-colors group"
                      >
                        <Clock className="size-3.5 text-muted-foreground group-hover:text-amber-600 transition-colors" />
                        <span>Reset to New</span>
                      </Button>
                    </PopoverClose>
                  )}

                  <PopoverClose asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteModalInquiry(item)}
                      className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-lg transition-colors group"
                    >
                      <Trash2 className="size-3.5 text-destructive transition-colors" />
                      <span>Delete</span>
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
    []
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={inquiries}
        isLoading={isLoading}
        currentPage={page}
        pageLimit={pageLimit}
        total={total}
        onPageChange={setPage}
        searchPlaceholder="Search inquiries by name, email, phone, placement, or notes..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        toolbarActions={
          <Tabs
            value={selectedStatus}
            onValueChange={setSelectedStatus}
            className="w-auto"
          >
            <TabsList className="h-9 p-1 bg-muted/60 border border-border">
              {statusTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-xs px-3 py-1 font-semibold gap-1.5 cursor-pointer data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
        emptyMessage={
          hasActiveFilter
            ? "No banner ad inquiries found matching your criteria."
            : "No banner ad inquiries found."
        }
      />

      {/* View Details Modal */}
      <BannerAdInquiryDetailsModal
        open={Boolean(selectedInquiry)}
        onOpenChange={(open) => !open && setSelectedInquiry(null)}
        inquiry={selectedInquiry}
        onStatusChange={handleStatusChange}
        isUpdating={isUpdating}
      />

      {/* Delete Confirmation Alert Modal */}
      <AlertModal
        open={Boolean(deleteModalInquiry)}
        onOpenChange={(open) => {
          if (!isDeleting && !open) {
            setDeleteModalInquiry(null)
          }
        }}
        title="Delete Banner Ad Inquiry?"
        description={
          deleteModalInquiry
            ? `Are you sure you want to permanently delete the inquiry from "${deleteModalInquiry.name}" (${deleteModalInquiry.email})? This action cannot be undone.`
            : "Are you sure you want to delete this inquiry?"
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete Inquiry"}
        confirmVariant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}

export default BannerAdsInquiriesTable
