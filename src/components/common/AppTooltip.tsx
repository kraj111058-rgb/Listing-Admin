import * as React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipPositioner,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AppTooltipProps {
  label: string;
  children: React.ReactNode;
}

export function AppTooltip({ label, children }: AppTooltipProps) {
  if (!label) {
    return <>{children}</>
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={(triggerProps) => (
          <div {...triggerProps} className="inline-flex">
            {children}
          </div>
        )}
      />
      <TooltipPositioner>
        <TooltipContent>
          <span>{label}</span>
        </TooltipContent>
      </TooltipPositioner>
    </Tooltip>
  )
}

export default AppTooltip

