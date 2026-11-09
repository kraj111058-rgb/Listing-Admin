import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import { type ListingFaqAdminItem } from "@/data/dummyData"

interface FaqStatsCardsProps {
  faqs: ListingFaqAdminItem[]
}

interface StatItem {
  label: string
  value: string | number
  subText: string
  icon: LucideIcon
  color: string
}

export const FaqStatsCards = ({ faqs }: FaqStatsCardsProps) => {
  const total = faqs.length
  const pendingCount = faqs.filter((i) => i.status === "Pending").length
  const approvedCount = faqs.filter((i) => i.status === "Approved").length
  const rejectedCount = faqs.filter((i) => i.status === "Rejected").length

  const stats: StatItem[] = [
    {
      label: "Total Custom FAQs",
      value: total,
      subText: "Submitted across all listings",
      icon: HelpCircle,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
    },
    {
      label: "Pending",
      value: pendingCount,
      subText: `${pendingCount} awaiting approval`,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    },
    {
      label: "Approved",
      value: approvedCount,
      subText: "Active on live listing pages",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    },
    {
      label: "Rejected",
      value: rejectedCount,
      subText: "Declined with feedback",
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
              <div
                className={`size-8 rounded-xl flex items-center justify-center ${stat.color}`}
              >
                <Icon className="size-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {stat.value}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {stat.subText}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default FaqStatsCards

