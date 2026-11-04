import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Building2,
  Star,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  MoreVertical,
  Eye,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Crown,
  ExternalLink,
  Package,
} from "lucide-react"
import DataTable, { type ColumnDef } from "@/components/common/DataTable"
import { SelectWithLabel } from "@/components/common/SelectWithLabel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PopoverMenu from "@/components/common/PopoverMenu"
import { PopoverClose } from "@/components/ui/popover"
import AlertModal from "@/components/common/AlertModal"
import RejectListingModal from "./RejectListingModal"
import {
  mockListings,
  mockServicesProducts,
  type ListingItem,
  type ListingStatus,
} from "@/data/dummyData"

interface ListingsTableProps {
  items: ListingItem[]
}

const statusTabs = [
  { label: "All", value: "All" },
  { label: "Approved", value: "Approved" },
  { label: "Pending", value: "Pending" },
  { label: "Rejected", value: "Rejected" },
]

const ListingsTable = ({ items }: ListingsTableProps) => {
  const navigate = useNavigate()
  const [listings, setListings] = useState<ListingItem[]>(items)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedUser, setSelectedUser] = useState("ALL")

  // Modal states
  const [statusConfirmItem, setStatusConfirmItem] = useState<{
    item: ListingItem
    targetStatus: ListingStatus
  } | null>(null)
  const [rejectModalItem, setRejectModalItem] = useState<ListingItem | null>(null)
  const [deleteModalItem, setDeleteModalItem] = useState<ListingItem | null>(null)

  // Generate unique user/owner filter options dynamically
  const userOptions = useMemo(() => {
    const unique = Array.from(new Set(listings.map((i) => i.ownerName))).sort()
    return [
      { value: "ALL", label: "All Users" },
      ...unique.map((name) => ({ value: name, label: name })),
    ]
  }, [listings])

  // Filter listings by status, user, and search query
  const filteredItems = useMemo(() => {
    return listings.filter((item) => {
      // Status filter (only Approved, Pending, Rejected)
      if (selectedStatus !== "All" && item.status !== selectedStatus) {
        return false
      }

      // User filter
      if (selectedUser !== "ALL" && item.ownerName !== selectedUser) {
        return false
      }

      // Search query filter
      const query = searchQuery.toLowerCase().trim()
      if (!query) return true

      return (
        item.name.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.ownerName.toLowerCase().includes(query) ||
        item.city.toLowerCase().includes(query) ||
        item.state.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
      )
    })
  }, [listings, searchQuery, selectedUser, selectedStatus])

  // Status update handler
  const handleUpdateStatus = (
    targetId: string,
    newStatus: ListingStatus,
    reason?: string
  ) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === targetId
          ? {
            ...item,
            status: newStatus,
            ...(reason ? { rejectionReason: reason } : {}),
          }
          : item
      )
    )
    const inMock = mockListings.find((l) => l.id === targetId)
    if (inMock) {
      inMock.status = newStatus
      if (reason) inMock.rejectionReason = reason
    }
  }

  // Delete handler
  const handleDeleteListing = (targetId: string) => {
    setListings((prev) => prev.filter((item) => item.id !== targetId))
    setDeleteModalItem(null)
  }

  const columns = useMemo<ColumnDef<ListingItem>[]>(
    () => [
      // 1. Business Column (with Category replacing ID, and Rating/Reviews)
      {
        id: "business",
        header: "Business",
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="flex items-center gap-3 py-1 min-w-[240px]">
              {item.logo ? (
                <img
                  src={item.logo}
                  alt={item.name}
                  className="size-10 rounded-lg object-cover border border-border shrink-0 shadow-2xs"
                />
              ) : (
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-border shrink-0">
                  <Building2 className="size-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span
                  onClick={() => navigate(`/listings/${item.id}`)}
                  className="text-xs sm:text-sm font-semibold text-foreground truncate block hover:text-primary transition-colors cursor-pointer"
                >
                  {item.name}
                </span>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 flex-wrap">
                  {/* Category replacing ID */}
                  <Badge variant="info" className="text-[11px] font-semibold py-0 px-1.5">
                    {item.category}
                  </Badge>
                  <span>•</span>
                  <span className="inline-flex items-center gap-0.5 text-amber-500 font-semibold">
                    <Star className="size-3 fill-amber-500 text-amber-500" />
                    {item.rating}
                  </span>
                  <span className="text-muted-foreground/70">
                    ({item.reviews})
                  </span>
                </div>
              </div>
            </div>
          )
        },
      },

      // 2. Owner Column
      {
        id: "owner",
        header: "Owner",
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="min-w-[140px] space-y-0.5">
              <span className="text-xs sm:text-sm font-semibold text-foreground truncate block">
                {item.ownerName}
              </span>
              <span className="text-xs text-muted-foreground truncate block">
                {item.ownerEmail}
              </span>
            </div>
          )
        },
      },

      // 3. Map Location Column (Lat/Long Google Maps link - NO Mumbai, Maharashtra)
      {
        id: "location",
        header: "Location",
        cell: ({ row }) => {
          const item = row.original
          const lat = item.latitude || "18.9217"
          const lng = item.longitude || "72.8332"
          return (
            <div className="min-w-[130px]">
              <a
                href={`https://www.google.com/maps?q=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 border border-primary/20 transition-all cursor-pointer group"
                title={`Open Google Maps (${lat}, ${lng})`}
              >
                <MapPin className="size-3.5 text-primary group-hover:scale-110 transition-transform" />
                <span>View on Map</span>
                <ExternalLink className="size-3 text-primary/70" />
              </a>
            </div>
          )
        },
      },

      // 4. Plan Column (New Column)
      {
        id: "plan",
        header: "Plan",
        cell: ({ row }) => {
          const plan = row.original.plan || "Free"
          if (plan === "Featured Pro") {
            return (
              <Badge variant="info" className="gap-1 text-xs font-semibold px-2 py-0.5 shadow-2xs">
                <Crown className="size-3 text-primary" />
                Featured Pro
              </Badge>
            )
          }
          if (plan === "Featured") {
            return (
              <Badge variant="warning" className="gap-1 text-xs font-semibold px-2 py-0.5 shadow-2xs">
                <Crown className="size-3 text-amber-600" />
                Featured
              </Badge>
            )
          }
          return (
            <Badge variant="secondary" className="text-xs font-medium px-2 py-0.5">
              Free
            </Badge>
          )
        },
      },

      // 5. Services & Products Count Column (Only Count)
      {
        id: "servicesProducts",
        header: "Services & Products",
        cell: ({ row }) => {
          const item = row.original
          const count = mockServicesProducts.filter(
            (sp) => sp.listingId === item.id
          ).length

          return (
            <Badge variant="secondary" className="text-xs font-semibold px-2 py-0.5 border-border">
              <Package className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              {count}
            </Badge>
          )
        },
      },

      // 6. Views Column (New Column)
      {
        id: "views",
        header: "Views",
        cell: ({ row }) => {
          const views = row.original.views || 0
          return (
            <div className="flex items-center gap-1 text-xs font-semibold text-foreground font-mono">
              <Eye className="size-3.5 text-muted-foreground/70" />
              <span>{views.toLocaleString()}</span>
            </div>
          )
        },
      },

      // 6. Status Column (Approved / Pending / Rejected only)
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

      // 7. Owner Active / Inactive Status Column (For Approved listings)
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

      // 8. Created Date Column
      {
        id: "createdAt",
        header: "Created Date",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {row.original.createdAt}
          </span>
        ),
      },

      // 9. Actions Column
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
                      onClick={() => navigate(`/listings/${item.id}`)}
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
                        onClick={() =>
                          setStatusConfirmItem({
                            item,
                            targetStatus: "Approved",
                          })
                        }
                        className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 text-foreground cursor-pointer rounded-lg transition-colors group"
                      >
                        <ShieldCheck className="size-3.5 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                        <span>Approve Listing</span>
                      </Button>
                    </PopoverClose>
                  )}

                  {item.status !== "Rejected" && (
                    <PopoverClose asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setRejectModalItem(item)}
                        className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold hover:bg-destructive/10 hover:text-destructive text-foreground cursor-pointer rounded-lg transition-colors group"
                      >
                        <ShieldAlert className="size-3.5 text-muted-foreground group-hover:text-destructive transition-colors" />
                        <span>Reject Listing</span>
                      </Button>
                    </PopoverClose>
                  )}

                  <PopoverClose asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteModalItem(item)}
                      className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-lg transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Delete Listing</span>
                    </Button>
                  </PopoverClose>
                </div>
              </PopoverMenu>
            </div>
          )
        },
      },
    ],
    [navigate]
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredItems}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by business name, city, owner..."
        toolbarActions={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="w-full sm:w-50">
              <SelectWithLabel
                value={selectedUser}
                onValueChange={setSelectedUser}
                options={userOptions}
                placeholder="Filter by User"
                containerClassName="m-0 p-0"
                triggerClassName="h-9! text-xs font-semibold rounded-lg bg-muted/40 border-border hover:bg-muted/60 transition-colors"
              />
            </div>

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
        emptyMessage="No listings found matching your search or filters."
      />

      {/* Status Change Confirmation Modal (Approve) */}
      <AlertModal
        open={!!statusConfirmItem}
        onOpenChange={(open) => !open && setStatusConfirmItem(null)}
        title="Approve Listing"
        description={`Are you sure you want to approve "${statusConfirmItem?.item.name}"? This listing will become approved and publicly live.`}
        confirmLabel="Approve Listing"
        confirmVariant="success"
        onConfirm={() => {
          if (statusConfirmItem) {
            handleUpdateStatus(
              statusConfirmItem.item.id,
              statusConfirmItem.targetStatus
            )
            setStatusConfirmItem(null)
          }
        }}
      />

      {/* Reject Listing Modal with Required Reason Textarea */}
      <RejectListingModal
        open={Boolean(rejectModalItem)}
        onOpenChange={(open) => !open && setRejectModalItem(null)}
        listing={rejectModalItem}
        onConfirm={(reason) => {
          if (rejectModalItem) {
            handleUpdateStatus(rejectModalItem.id, "Rejected", reason)
            setRejectModalItem(null)
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <AlertModal
        open={!!deleteModalItem}
        onOpenChange={(open) => !open && setDeleteModalItem(null)}
        title="Delete Listing"
        description={`Are you sure you want to permanently delete "${deleteModalItem?.name}" (${deleteModalItem?.id})? This action cannot be undone.`}
        confirmLabel="Delete Listing"
        confirmVariant="destructive"
        onConfirm={() => {
          if (deleteModalItem) {
            handleDeleteListing(deleteModalItem.id)
          }
        }}
      />
    </>
  )
}

export default ListingsTable
