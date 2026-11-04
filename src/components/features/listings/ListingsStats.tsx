import {
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import { mockListings, type ListingItem } from "@/data/dummyData"

interface StatItem {
  label: string
  value: number
  icon: LucideIcon
  color: string
}

interface ListingsStatsProps {
  items?: ListingItem[]
}

const ListingsStats = ({ items = mockListings }: ListingsStatsProps) => {
  const approvedCount = items.filter((i) => i.status === "Approved").length
  const pendingCount = items.filter((i) => i.status === "Pending").length
  const rejectedCount = items.filter((i) => i.status === "Rejected").length

  const stats: StatItem[] = [
    {
      label: "Total Listings",
      value: items.length,
      icon: Building2,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
    },
    {
      label: "Approved",
      value: approvedCount,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    },
    {
      label: "Rejected",
      value: rejectedCount,
      icon: XCircle,
      color: "text-rose-600 dark:text-rose-400 bg-rose-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="p-4 rounded-2xl border border-border bg-card shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl ${stat.color}`}>
                <Icon className="size-4" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2 text-foreground">
              {stat.value}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default ListingsStats
