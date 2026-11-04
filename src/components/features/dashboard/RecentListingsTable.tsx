import { useMemo } from "react"
import { Link } from "react-router-dom"
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  MapPin,
  Eye,
  Crown,
  Building2,
} from "lucide-react"
import { mockListings, type ListingItem } from "@/data/dummyData"
import DataTable, { type ColumnDef } from "@/components/common/DataTable"
import { Badge } from "@/components/ui/badge"

const RecentListingsTable = () => {
  // Use mockListings directly - show 6 latest items
  const listings = useMemo(() => mockListings.slice(0, 6), [])

  const columns = useMemo<ColumnDef<ListingItem>[]>(
    () => [
      // 1. Business Column (Cover Image + Name + Category badge replacing ID + Rating/Reviews)
      {
        id: "business",
        header: "Business",
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="flex items-center gap-3 py-1 min-w-[220px]">
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
                <Link
                  to={`/listings/${item.id}`}
                  className="text-xs sm:text-sm font-semibold text-foreground truncate block hover:text-primary transition-colors cursor-pointer"
                  title={item.name}
                >
                  {item.name}
                </Link>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 flex-wrap">
                  {/* Category badge replacing ID */}
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

      // 2. Owner Column (Owner Name + Owner Email)
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

      // 3. Plan Column
      {
        id: "plan",
        header: "Plan",
        cell: ({ row }) => {
          const plan = row.original.plan || "Free"

          if (plan === "Featured Pro") {
            return (
              <Badge
                variant="info"
                className="gap-1 text-[11px] font-semibold px-2 py-0.5 bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20 shadow-2xs"
              >
                <Crown className="size-2.5 text-purple-600 dark:text-purple-400" />
                Featured Pro
              </Badge>
            )
          }
          if (plan === "Featured") {
            return (
              <Badge
                variant="warning"
                className="gap-1 text-[11px] font-semibold px-2 py-0.5 shadow-2xs"
              >
                <Crown className="size-2.5 text-amber-600" />
                Featured
              </Badge>
            )
          }
          return (
            <Badge variant="secondary" className="text-[11px] font-medium px-2 py-0.5">
              Free
            </Badge>
          )
        },
      },

      // 4. Status Column (Approved / Pending / Rejected)
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status
          return (
            <Badge
              variant={
                status === "Approved"
                  ? "success"
                  : status === "Pending"
                    ? "warning"
                    : "danger"
              }
              className="rounded-full gap-1 text-xs font-semibold px-2.5 py-0.5"
            >
              {status === "Approved" ? (
                <CheckCircle2 className="size-3" />
              ) : status === "Pending" ? (
                <Clock className="size-3" />
              ) : (
                <XCircle className="size-3" />
              )}
              {status}
            </Badge>
          )
        },
      },

      // 5. Actions Column (Map Icon & Eye Details Icon)
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original
          const lat = item.latitude || "18.9217"
          const lng = item.longitude || "72.8332"
          const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`

          return (
            <div className="flex items-center justify-end gap-1.5">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Open in Google Maps (${item.city})`}
                className="size-8 rounded-lg border border-border bg-card hover:bg-primary/10 hover:border-primary/40 text-muted-foreground hover:text-primary flex items-center justify-center transition-all shadow-2xs cursor-pointer group/map"
              >
                <MapPin className="size-3.5 group-hover/map:scale-110 transition-transform" />
              </a>
              <Link
                to={`/listings/${item.id}`}
                title="View Listing Details"
                className="size-8 rounded-lg border border-border bg-card hover:bg-primary/10 hover:border-primary/40 text-muted-foreground hover:text-primary flex items-center justify-center transition-all shadow-2xs cursor-pointer group/eye"
              >
                <Eye className="size-3.5 group-hover/eye:scale-110 transition-transform" />
              </Link>
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <DataTable
      columns={columns}
      data={listings}
      title="Recent Listings"
      description="Latest businesses registered on your portal"
      toolbarActions={
        <Link
          to="/listings"
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          View All <ArrowUpRight className="size-3" />
        </Link>
      }
      showPagination={false}
      emptyMessage="No recent listings found."
    />
  )
}

export default RecentListingsTable
