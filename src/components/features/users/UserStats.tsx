import {
  Users as UsersIcon,
  CheckCircle2,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import { useUserStats } from "@/hooks/queries"

interface StatItem {
  label: string
  value: number
  icon: LucideIcon
  color: string
}

const UserStats = () => {
  const { data: statsData, isLoading } = useUserStats()

  const stats: StatItem[] = [
    {
      label: "Total Users",
      value: statsData?.totalUsers ?? 0,
      icon: UsersIcon,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
    },
    {
      label: "Active Users",
      value: statsData?.activeUsers ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    },
    {
      label: "Inactive Users",
      value: statsData?.inactiveUsers ?? 0,
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

export default UserStats
