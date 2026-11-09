import AlertModal from "@/components/common/AlertModal"
import DataTable, { type ColumnDef } from "@/components/common/DataTable"
import PopoverMenu from "@/components/common/PopoverMenu"
import { SelectWithLabel } from "@/components/common/SelectWithLabel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PopoverClose } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ListingFaqAdminItem } from "@/data/dummyData"
import {
  CheckCircle2,
  Clock,
  Eye,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  XCircle
} from "lucide-react"
import { useMemo, useState } from "react"
import FaqDetailsModal from "./FaqDetailsModal"
import RejectFaqModal from "./RejectFaqModal"

interface ListingFaqsTableProps {
  items: ListingFaqAdminItem[]
  onItemsChange: (items: ListingFaqAdminItem[]) => void
}

const statusTabs = [
  { label: "All", value: "All" },
  { label: "Approved", value: "Approved" },
  { label: "Pending", value: "Pending" },
  { label: "Rejected", value: "Rejected" },
]

export const ListingFaqsTable = ({
  items,
  onItemsChange,
}: ListingFaqsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedListing, setSelectedListing] = useState("ALL")

  // Modal states
  const [viewDetailsFaq, setViewDetailsFaq] = useState<ListingFaqAdminItem | null>(null)
  const [approveConfirmFaq, setApproveConfirmFaq] = useState<ListingFaqAdminItem | null>(null)
  const [rejectModalFaq, setRejectModalFaq] = useState<ListingFaqAdminItem | null>(null)
  const [deleteModalFaq, setDeleteModalFaq] = useState<ListingFaqAdminItem | null>(null)

  // Listing filter options dynamically generated
  const listingOptions = useMemo(() => {
    const unique = Array.from(new Set(items.map((i) => i.listingName))).sort()
    return [
      { value: "ALL", label: "All Listings" },
      ...unique.map((name) => ({ value: name, label: name })),
    ]
  }, [items])

  // Filter items based on search query, listing, and status
  const filteredItems = useMemo(() => {
    return items.filter((faq) => {
      // Status filter
      if (selectedStatus !== "All" && faq.status !== selectedStatus) {
        return false
      }

      // Listing filter
      if (selectedListing !== "ALL" && faq.listingName !== selectedListing) {
        return false
      }

      // Search query filter
      const query = searchQuery.toLowerCase().trim()
      if (!query) return true

      return (
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.listingName.toLowerCase().includes(query) ||
        faq.ownerName.toLowerCase().includes(query) ||
        faq.ownerEmail.toLowerCase().includes(query) ||
        (faq.listingCategory && faq.listingCategory.toLowerCase().includes(query)) ||
        (faq.rejectionReason && faq.rejectionReason.toLowerCase().includes(query))
      )
    })
  }, [items, searchQuery, selectedListing, selectedStatus])

  // Handlers
  const handleApprove = (faqId: string) => {
    const updated = items.map((f) =>
      f.id === faqId
        ? {
            ...f,
            status: "Approved" as const,
            approvedAt: "Today",
            rejectionReason: undefined,
            rejectedAt: undefined,
          }
        : f
    )
    onItemsChange(updated)
    setApproveConfirmFaq(null)
    if (viewDetailsFaq?.id === faqId) {
      setViewDetailsFaq((prev) =>
        prev
          ? {
              ...prev,
              status: "Approved",
              approvedAt: "Today",
              rejectionReason: undefined,
              rejectedAt: undefined,
            }
          : null
      )
    }
  }

  const handleReject = (faqId: string, reason: string) => {
    const updated = items.map((f) =>
      f.id === faqId
        ? {
            ...f,
            status: "Rejected" as const,
            rejectionReason: reason,
            rejectedAt: "Today",
            approvedAt: undefined,
          }
        : f
    )
    onItemsChange(updated)
    setRejectModalFaq(null)
    if (viewDetailsFaq?.id === faqId) {
      setViewDetailsFaq((prev) =>
        prev
          ? {
              ...prev,
              status: "Rejected",
              rejectionReason: reason,
              rejectedAt: "Today",
              approvedAt: undefined,
            }
          : null
      )
    }
  }

  const handleDelete = (faqId: string) => {
    const updated = items.filter((f) => f.id !== faqId)
    onItemsChange(updated)
    setDeleteModalFaq(null)
    if (viewDetailsFaq?.id === faqId) {
      setViewDetailsFaq(null)
    }
  }

  const columns = useMemo<ColumnDef<ListingFaqAdminItem>[]>(
    () => [
      // 1. Question & Answer Column
      {
        id: "questionAnswer",
        header: "FAQ (Question & Answer)",
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="py-1 min-w-[280px] max-w-[420px] space-y-1">
              <div className="flex items-start gap-1.5 font-bold text-xs sm:text-sm text-foreground leading-snug line-clamp-1 truncate">
                {item.question}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed truncate">
                {item.answer}
              </p>
            </div>
          )
        },
      },

      // 2. Target Listing Column (matches Services & Products Target Listing format)
      {
        id: "targetListing",
        header: "Target Listing",
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="min-w-[170px] space-y-0.5">
              <span className="text-xs sm:text-sm font-semibold text-foreground truncate block">
                {item.listingName}
              </span>
              <span className="text-xs text-muted-foreground truncate block">
                {item.listingCategory} • {item.city}
              </span>
            </div>
          )
        },
      },

      // 3. Status Column (matches Listings Management Status format)
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const item = row.original
          switch (item.status) {
            case "Approved":
              return (
                <Badge variant="success" className="rounded-full gap-1">
                  <CheckCircle2 className="size-3" />
                  Approved
                </Badge>
              )
            case "Pending":
              return (
                <Badge variant="warning" className="rounded-full gap-1">
                  <Clock className="size-3" />
                  Pending
                </Badge>
              )
            case "Rejected":
              return (
                <Badge variant="danger" className="rounded-full gap-1">
                  <XCircle className="size-3" />
                  Rejected
                </Badge>
              )
          }
        },
      },

      // 4. Owner Status Column (matches Listings Management Owner Status format)
      {
        id: "ownerStatus",
        header: "Owner Status",
        cell: ({ row }) => {
          const item = row.original
          if (item.status === "Approved") {
            const isActive = item.isActive !== false
            return (
              <Badge
                variant={isActive ? "success" : "danger"}
                className="rounded-full gap-1 text-xs font-semibold"
              >
                {isActive ? (
                  <>
                    <CheckCircle2 className="size-3" />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <XCircle className="size-3" />
                    <span>Inactive</span>
                  </>
                )}
              </Badge>
            )
          }
          return <span className="text-foreground text-xs">N/A</span>
        },
      },

      // 5. Created Date Column (shown before Actions, matching Listings Management)
      {
        id: "createdAt",
        header: "Created Date",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {row.original.createdAt}
          </span>
        ),
      },

      // 6. Actions Column
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="flex items-center justify-end">
              <PopoverMenu
                align="end"
                contentClass="w-48 p-1.5"
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
                      onClick={() => setViewDetailsFaq(item)}
                      className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold hover:bg-primary/10 hover:text-primary text-foreground cursor-pointer rounded-lg transition-colors group"
                    >
                      <Eye className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span>View Details</span>
                    </Button>
                  </PopoverClose>

                  {item.status !== "Approved" && (
                    <PopoverClose asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setApproveConfirmFaq(item)}
                        className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 text-foreground cursor-pointer rounded-lg transition-colors group"
                      >
                        <ShieldCheck className="size-3.5 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                        <span>Approve FAQ</span>
                      </Button>
                    </PopoverClose>
                  )}

                  {item.status !== "Rejected" && (
                    <PopoverClose asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setRejectModalFaq(item)}
                        className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold hover:bg-destructive/10 hover:text-destructive text-foreground cursor-pointer rounded-lg transition-colors group"
                      >
                        <ShieldAlert className="size-3.5 text-muted-foreground group-hover:text-destructive transition-colors" />
                        <span>Reject FAQ</span>
                      </Button>
                    </PopoverClose>
                  )}

                  <PopoverClose asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteModalFaq(item)}
                      className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-lg transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Delete FAQ</span>
                    </Button>
                  </PopoverClose>
                </div>
              </PopoverMenu>
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredItems}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by question, answer, listing name, owner..."
        toolbarActions={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Filter by Business Listing */}
            <div className="w-full sm:w-56">
              <SelectWithLabel
                value={selectedListing}
                onValueChange={setSelectedListing}
                options={listingOptions}
                placeholder="Filter by Listing"
                containerClassName="m-0 p-0"
                triggerClassName="h-9! text-xs font-semibold rounded-lg bg-muted/40 border-border hover:bg-muted/60 transition-colors"
              />
            </div>

            {/* Status Tabs */}
            <Tabs
              value={selectedStatus}
              onValueChange={setSelectedStatus}
              className="self-start sm:self-auto"
            >
              <TabsList className="h-9 p-1 bg-muted/40 border border-border rounded-lg gap-1">
                {statusTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="h-7 px-3 text-xs font-semibold rounded-md"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        }
        emptyMessage="No custom FAQs found matching your search or filters."
      />

      {/* View Details Modal (Uses Common Modal) */}
      <FaqDetailsModal
        open={Boolean(viewDetailsFaq)}
        onOpenChange={(open) => !open && setViewDetailsFaq(null)}
        faq={viewDetailsFaq}
      />

      {/* Reject FAQ Modal with Required Reason Textarea */}
      <RejectFaqModal
        open={Boolean(rejectModalFaq)}
        onOpenChange={(open) => !open && setRejectModalFaq(null)}
        faq={rejectModalFaq}
        onConfirm={(reason) => {
          if (rejectModalFaq) {
            handleReject(rejectModalFaq.id, reason)
          }
        }}
      />

      {/* Approve FAQ Confirmation AlertModal */}
      <AlertModal
        open={Boolean(approveConfirmFaq)}
        onOpenChange={(open) => !open && setApproveConfirmFaq(null)}
        title="Approve Custom FAQ"
        description={`Are you sure you want to approve this FAQ for "${approveConfirmFaq?.listingName}"? It will become publicly visible on the business listing page.`}
        confirmLabel="Approve FAQ"
        confirmVariant="success"
        onConfirm={() => {
          if (approveConfirmFaq) {
            handleApprove(approveConfirmFaq.id)
          }
        }}
      />

      {/* Delete FAQ Confirmation AlertModal */}
      <AlertModal
        open={Boolean(deleteModalFaq)}
        onOpenChange={(open) => !open && setDeleteModalFaq(null)}
        title="Delete Custom FAQ"
        description={`Are you sure you want to permanently delete this FAQ ("${deleteModalFaq?.question}")? This action cannot be undone.`}
        confirmLabel="Delete FAQ"
        confirmVariant="destructive"
        onConfirm={() => {
          if (deleteModalFaq) {
            handleDelete(deleteModalFaq.id)
          }
        }}
      />
    </>
  )
}

export default ListingFaqsTable

