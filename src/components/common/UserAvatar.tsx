import type * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getInitials } from "@/lib/utils"

interface UserAvatarProps extends React.ComponentProps<"span"> {
  name: string
  src?: string | null
  className?: string
  fallbackClassName?: string
}

export function UserAvatar({
  name,
  src,
  className,
  fallbackClassName,
  ...props
}: UserAvatarProps) {
  return (
    <Avatar
      className={cn(
        "size-9 shrink-0 select-none border border-border",
        className
      )}
      {...props}
    >
      {src && (
        <AvatarImage
          src={src}
          alt={name}
          className="aspect-square size-full object-cover"
        />
      )}
      <AvatarFallback
        className={cn(
          "bg-muted font-semibold text-xs text-primary flex items-center justify-center size-full",
          fallbackClassName
        )}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}