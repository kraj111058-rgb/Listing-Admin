import AlertModal from "@/components/common/AlertModal"
import DataTable, { type ColumnDef } from "@/components/common/DataTable"
import PopoverMenu from "@/components/common/PopoverMenu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PopoverClose } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubscriptionPlanStatus } from "@/enums"
import {
  useDeleteSubscriptionPlan,
  useSubscriptionPlans,
  useToggleSubscriptionPlanStatus,
} from "@/hooks/queries"
import { useDebounce } from "@/hooks/useDebounce"
import { cn } from "@/lib/utils"
import type { SubscriptionPlanData } from "@/types"
import {
  Building2,
  Layers,
  MoreVertical,
  Package,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

interface SubscriptionPlansTableProps {
  onEditPlan: (plan: SubscriptionPlanData) => void
}

const statusTabs = [
  { label: "All", value: "All" },
  { label: "Active", value: SubscriptionPlanStatus.ACTIVE },
  { label: "Inactive", value: SubscriptionPlanStatus.INACTIVE },
]

export const SubscriptionPlansTable = ({
  onEditPlan,
}: SubscriptionPlansTableProps) => {
  const [page, setPage] = useState(1)
  const pageLimit = 10
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [deleteModalPlan, setDeleteModalPlan] = useState<SubscriptionPlanData | null>(null)

  const debouncedSearch = useDebounce(searchQuery, 400)

  // Reset to page 1 on search or filter change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, selectedStatus])

  // Fetch plans from Supabase
  const { data: plansResponse, isLoading } = useSubscriptionPlans({
    page,
    pageLimit,
    search: debouncedSearch,
    status: selectedStatus,
  })

  const plans = plansResponse?.data ?? []
  const total = plansResponse?.total ?? 0
  const hasActiveFilter = Boolean(searchQuery.trim()) || selectedStatus !== "All"

  const { mutate: toggleStatus } = useToggleSubscriptionPlanStatus()
  const { mutate: deletePlan, isPending: isDeleting } = useDeleteSubscriptionPlan()

  // Toggle plan active status
  const handleToggleStatus = (id: string, currentStatus: SubscriptionPlanStatus) => {
    const newStatus =
      currentStatus === SubscriptionPlanStatus.ACTIVE
        ? SubscriptionPlanStatus.INACTIVE
        : SubscriptionPlanStatus.ACTIVE
    toggleStatus({ id, status: newStatus })
  }

  // Confirm delete plan
  const handleConfirmDelete = () => {
    if (!deleteModalPlan) return
    deletePlan(deleteModalPlan.id, {
      onSuccess: () => {
        setDeleteModalPlan(null)
      },
    })
  }

  const columns = useMemo<ColumnDef<SubscriptionPlanData>[]>(
    () => [
      {
        id: "plan",
        header: "Package / Plan",
        cell: ({ row }) => {
          const plan = row.original
          return (
            <div className="flex items-center gap-3.5 py-1 min-w-[240px]">
              <div className="size-11 rounded-lg border border-border bg-muted/40 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                <span>{plan.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-muted-foreground">
                    {plan.tag}
                  </span>
                  {plan.popular && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-bold px-2 py-0.25 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 gap-1"
                    >
                      <Sparkles className="size-2.5" />
                      <span>Popular</span>
                    </Badge>
                  )}
                </div>
                <span className="text-sm font-bold text-foreground block mt-0.5 truncate">
                  {plan.name}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        id: "pricing",
        header: "Pricing & Validity",
        cell: ({ row }) => {
          const plan = row.original
          return (
            <div className="min-w-[120px]">
              <div className="flex items-baseline gap-1">
                <span className="text-base font-extrabold text-foreground tracking-tight">
                  ₹{plan.price}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  {plan.period}
                </span>
              </div>
              {plan.duration_months && (
                <span className="text-[11px] text-muted-foreground font-medium block">
                  {plan.duration_months} {plan.duration_months === 1 ? "month" : "months"} validity
                </span>
              )}
            </div>
          )
        },
      },
      {
        id: "listingsLimit",
        header: "Listings Limit",
        cell: ({ row }) => {
          const limit = row.original.listings_limit
          return (
            <div className="flex items-center gap-1.5 min-w-[130px]">
              <Building2 className="size-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs font-semibold text-foreground">
                {limit} {limit === 1 ? "Listing" : "Listings"}
              </span>
            </div>
          )
        },
      },
      {
        id: "servicesLimit",
        header: "Services / Listing",
        cell: ({ row }) => {
          const limit = row.original.services_limit
          return (
            <div className="flex items-center gap-1.5 min-w-[140px]">
              <Package className="size-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs font-semibold text-foreground">
                {limit > 0 ? `Up to ${limit} items` : "Not included"}
              </span>
            </div>
          )
        },
      },
      {
        id: "features",
        header: "Included Features",
        cell: ({ row }) => {
          const count = row.original.included_features?.length || 0
          return (
            <div className="flex items-center gap-1.5 min-w-[140px]">
              <Layers className="size-3.5 text-primary" />
              <Badge
                variant="outline"
                className="text-xs font-semibold rounded-lg px-2.5 py-0.5 bg-primary/5 text-primary border-primary/20"
              >
                {count} {count === 1 ? "Feature" : "Features"}
              </Badge>
            </div>
          )
        },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const plan = row.original
          const isActive = plan.status === SubscriptionPlanStatus.ACTIVE

          return (
            <div className="flex items-center gap-2.5 min-w-[120px]">
              <Switch
                checked={isActive}
                onCheckedChange={() => handleToggleStatus(plan.id, plan.status)}
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
                {isActive ? SubscriptionPlanStatus.ACTIVE : SubscriptionPlanStatus.INACTIVE}
              </span>
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const plan = row.original
          return (
            <div className="flex items-center justify-end">
              <PopoverMenu
                align="end"
                contentClass="w-36"
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
                      onClick={() => onEditPlan(plan)}
                      className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold hover:bg-muted text-foreground cursor-pointer rounded-lg transition-colors group"
                    >
                      <Pencil className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span>Edit Plan</span>
                    </Button>
                  </PopoverClose> 

                  <PopoverClose asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteModalPlan(plan)}
                      className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold hover:bg-destructive/10 text-destructive hover:text-destructive cursor-pointer rounded-lg transition-colors group"
                    >
                      <Trash2 className="size-3.5 text-destructive group-hover:text-destructive transition-colors" />
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
    []
  )

  return (
    <>
      <DataTable
        data={plans}
        columns={columns}
        isLoading={isLoading}
        total={total}
        currentPage={page}
        pageLimit={pageLimit}
        onPageChange={setPage}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search plans by name, tag, or headline..."
        toolbarActions={
          <Tabs
            value={selectedStatus}
            onValueChange={setSelectedStatus}
            className="w-auto"
          >
            <TabsList className="h-9 p-0.5 bg-muted/60 border border-border">
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
            ? "No subscription plans found matching your criteria."
            : "No subscription plans found."
        }
      />

      {/* Delete Confirmation Alert Modal */}
      <AlertModal
        open={Boolean(deleteModalPlan)}
        onOpenChange={(open) => {
          if (!isDeleting && !open) {
            setDeleteModalPlan(null)
          }
        }}
        title="Delete Subscription Plan?"
        description={
          deleteModalPlan
            ? `Are you sure you want to permanently delete "${deleteModalPlan.name}"? This package will no longer be visible or available for business listings.`
            : "Are you sure you want to delete this subscription plan?"
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete Plan"}
        confirmVariant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}

export default SubscriptionPlansTable
