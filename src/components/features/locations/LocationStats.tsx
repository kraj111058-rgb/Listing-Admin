import {
  MapPin,
  Building2,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react"
import { useLocationStats } from "@/hooks/queries"

interface StatItem {
  label: string
  value: string | number
  subText: string
  icon: LucideIcon
  color: string
}

const LocationStats = () => {
  const { data: statsData, isLoading } = useLocationStats()

  const totalStates = statsData?.totalStates ?? 36
  const activeCitiesCount = statsData?.activeCities ?? 0
  const totalCitiesCount = statsData?.totalCities ?? 0
  const totalListingsCount = statsData?.totalListings ?? 0

  const stats: StatItem[] = [
    {
      label: "States & UTs",
      value: totalStates,
      subText: "28 States + 8 Union Territories",
      icon: MapPin,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
    },
    {
      label: "Active Cities",
      value: activeCitiesCount,
      subText: `${totalCitiesCount} total cities registered`,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    },
    {
      label: "Local Listings",
      value: totalListingsCount.toLocaleString(),
      subText: "Across all active city zones",
      icon: Building2,
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
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
            <div className="mt-2 flex items-baseline gap-2">
              {isLoading ? (
                <div className="h-8 w-16 bg-muted/60 animate-pulse rounded-md" />
              ) : (
                <span className="text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.subText}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default LocationStats
