import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoaderProps {
  text?: string
  size?: "xs" | "sm" | "md" | "lg"
  fullScreen?: boolean
  inline?: boolean
  className?: string
}

const sizeMap = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-8",
  lg: "size-12",
}

export const Loader = ({
  text,
  size = "md",
  fullScreen = true,
  inline = false,
  className,
}: LoaderProps) => {
  if (inline) {
    return (
      <Loader2
        className={cn("animate-spin shrink-0", sizeMap[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-background",
        fullScreen ? "min-h-screen w-full" : "w-full py-12",
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={cn("animate-spin text-primary", sizeMap[size])} />
        {text && (
          <p className="text-xs text-muted-foreground font-medium animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  )
}
