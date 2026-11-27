import {
  FolderTree,
  CheckCircle2,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import { useCategoryStats } from "@/hooks/queries"

interface StatItem {
  label: string
  value: number
  icon: LucideIcon
  color: string
}

const CategoryStats = () => {
  const { data: statsData, isLoading } = useCategoryStats()

  const stats: StatItem[] = [
    {
      label: "Total Categories",
      value: statsData?.totalCategories ?? 0,
      icon: FolderTree,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
    },
    {
      label: "Active Categories",
      value: statsData?.activeCategories ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    },
    {
      label: "Inactive Categories",
      value: statsData?.inactiveCategories ?? 0,
      icon: XCircle,
      color: "text-rose-600 dark:text-rose-400 bg-rose-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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
            {isLoading ? (
              <div className="mt-2 h-8 w-16 bg-muted animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-bold mt-2 text-foreground">
                {stat.value}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default CategoryStats
