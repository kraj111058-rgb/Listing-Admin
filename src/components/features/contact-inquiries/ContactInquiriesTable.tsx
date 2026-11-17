import { UserAvatar } from "@/components/common"
import AlertModal from "@/components/common/AlertModal"
import DataTable, { type ColumnDef } from "@/components/common/DataTable"
import PopoverMenu from "@/components/common/PopoverMenu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PopoverClose } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContactInquiryStatus } from "@/enums"
import {
  useContactInquiries,
  useDeleteContactInquiry,
  useUpdateContactInquiryStatus,
} from "@/hooks/queries"
import { useDebounce } from "@/hooks/useDebounce"
import { cn, formatDate } from "@/lib/utils"
import type { ContactInquiryData } from "@/types"
import {
  CheckCircle2,
  Eye,
  MoreVertical,
  Phone,
  Trash2
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

const statusTabs = [
  { label: "All", value: "All" },
  { label: "New", value: ContactInquiryStatus.NEW },
  { label: "Replied", value: ContactInquiryStatus.REPLIED },
  { label: "Archived", value: ContactInquiryStatus.ARCHIVED },
]

interface ContactInquiriesTableProps {
  onViewInquiry: (inquiry: ContactInquiryData) => void
}

const ContactInquiriesTable = ({ onViewInquiry }: ContactInquiriesTableProps) => {
  const [page, setPage] = useState(1)
  const pageLimit = 10

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [deleteModalInquiry, setDeleteModalInquiry] = useState<ContactInquiryData | null>(null)

  const debouncedSearch = useDebounce(searchQuery, 400)

  // Reset to page 1 when search or status filter changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, selectedStatus])

  // Fetch inquiries from Supabase
  const { data: inquiryResponse, isLoading } = useContactInquiries({
    page,
    pageLimit,
    search: debouncedSearch,
    status: selectedStatus,
  })

  const inquiries = inquiryResponse?.data ?? []
  const total = inquiryResponse?.total ?? 0
  const hasActiveFilter = Boolean(searchQuery.trim()) || selectedStatus !== "All"

  const { mutate: updateStatus } = useUpdateContactInquiryStatus()
  const { mutate: deleteInquiry, isPending: isDeleting } = useDeleteContactInquiry()

  // Toggle status (New <-> Replied)
  const handleToggleStatus = (id: string, status: ContactInquiryStatus) => {
    updateStatus({ id, status })
  }

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deleteModalInquiry) return
    deleteInquiry(deleteModalInquiry.id, {
      onSuccess: () => {
        setDeleteModalInquiry(null)
      },
    })
  }

  const getSubjectBadgeVariant = (subject: string) => {
    switch (subject) {
      case "Business Partnership":
        return "border-violet-200 bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:border-violet-900/60 dark:text-violet-300"
      case "Advertising & Sponsorship":
        return "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-300"
      case "Technical Issue":
        return "border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-300"
      case "Listing Support":
        return "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:border-blue-900/60 dark:text-blue-300"
      default:
        return "border-slate-200 bg-slate-50 text-slate-700 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-300"
    }
  }

  const columns = useMemo<ColumnDef<ContactInquiryData>[]>(
    () => [
      {
        id: "sender",
        header: "Sender",
        cell: ({ row }) => {
          const inq = row.original
          return (
            <div className="flex items-center gap-3 py-1">
              <UserAvatar name={inq.name} />
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-semibold text-foreground truncate">
                  {inq.name}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                  {inq.email}
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
          const inq = row.original
          return (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground whitespace-nowrap min-w-[125px]">
              <Phone className="size-3 text-muted-foreground shrink-0" />
              <a
                href={`tel:${inq.phone}`}
                className="hover:text-primary hover:underline transition-colors cursor-pointer"
                title={`Call ${inq.name} (${inq.phone})`}
              >
                {inq.phone}
              </a>
            </div>
          )
        },
      },
      {
        id: "subject",
        header: "Subject",
        cell: ({ row }) => {
          const inq = row.original
          return (
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-semibold rounded-lg px-2.5 py-0.5",
                getSubjectBadgeVariant(inq.subject)
              )}
            >
              {inq.subject}
            </Badge>
          )
        },
      },
      {
        id: "message",
        header: "Message Preview",
        cell: ({ row }) => {
          const inq = row.original
          return (
            <div className="max-w-[280px] sm:max-w-sm truncate text-xs text-muted-foreground">
              {inq.message}
            </div>
          )
        },
      },
      {
        id: "createdAt",
        header: "Received",
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
          const inq = row.original
          return (
            <Badge
              variant="secondary"
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
                inq.status === ContactInquiryStatus.NEW &&
                  "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
                inq.status === ContactInquiryStatus.REPLIED &&
                  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                inq.status === ContactInquiryStatus.ARCHIVED &&
                  "bg-muted text-muted-foreground border border-border"
              )}
            >
              {inq.status}
            </Badge>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const inq = row.original
          return (
            <div className="flex items-center justify-end">
              <PopoverMenu
                align="end"
                contentClass="w-44"
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
                      onClick={() => onViewInquiry(inq)}
                      className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold hover:bg-primary/10 hover:text-primary text-foreground cursor-pointer rounded-lg transition-colors group"
                    >
                      <Eye className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span>View Details</span>
                    </Button>
                  </PopoverClose>

                  {inq.status === ContactInquiryStatus.NEW && (
                    <PopoverClose asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(inq.id, ContactInquiryStatus.REPLIED)}
                        className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold hover:bg-emerald-500/10 hover:text-emerald-600 text-foreground cursor-pointer rounded-lg transition-colors group"
                      >
                        <CheckCircle2 className="size-3.5 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                        <span>Mark as Replied</span>
                      </Button>
                    </PopoverClose>
                  )}

                  <PopoverClose asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteModalInquiry(inq)}
                      className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-lg transition-colors group"
                    >
                      <Trash2 className="size-3.5 text-destructive transition-colors" />
                      <span>Delete Inquiry</span>
                    </Button>
                  </PopoverClose>
                </div>
              </PopoverMenu>
            </div>
          )
        },
      },
    ],
    [onViewInquiry]
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
        searchPlaceholder="Search by sender, email, contact no., subject, or message..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
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
            ? "No contact inquiries found matching your criteria."
            : "No contact inquiries found."
        }
      />

      {/* Delete Confirmation Alert Modal */}
      <AlertModal
        open={!!deleteModalInquiry}
        onOpenChange={(open) => !open && setDeleteModalInquiry(null)}
        title="Delete Contact Inquiry?"
        description={
          deleteModalInquiry
            ? `Are you sure you want to permanently delete the inquiry from "${deleteModalInquiry.name}" (${deleteModalInquiry.email})? This action cannot be undone.`
            : "Are you sure you want to delete this inquiry?"
        }
        confirmLabel="Delete Inquiry"
        confirmVariant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}

export default ContactInquiriesTable
