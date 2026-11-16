import { useBlogStats } from "@/hooks/queries"
import {
  CheckCircle2,
  FileEdit,
  FileText,
  type LucideIcon,
} from "lucide-react"

interface StatItem {
  label: string
  value: string | number
  subText: string
  icon: LucideIcon
  color: string
}

const BlogStats = () => {
  const { data: statsData, isLoading } = useBlogStats();

  const stats: StatItem[] = [
    {
      label: "Total Blogs",
      value: statsData?.total ?? 0,
      subText: "All published & drafts",
      icon: FileText,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
    },
    {
      label: "Published",
      value: statsData?.published ?? 0,
      subText: "Live on platform blog",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    },
    {
      label: "Drafts",
      value: statsData?.draft ?? 0,
      subText: "Unpublished / in review",
      icon: FileEdit,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
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
              <div
                className={`size-8 rounded-xl flex items-center justify-center ${stat.color}`}
              >
                <Icon className="size-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              {isLoading ? (
                <div className="h-8 w-12 bg-muted/60 animate-pulse rounded-md" />
              ) : (
                <span className="text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {stat.subText}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default BlogStats

