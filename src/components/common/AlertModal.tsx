import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import * as React from "react"
import { Loader } from "./Loader"

interface AlertModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "success"
  onConfirm: () => void | Promise<void>
  children?: React.ReactNode
  contentClassName?: string
  isLoading?: boolean
}

export function AlertModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  confirmVariant = "default",
  onConfirm,
  children,
  contentClassName,
  isLoading,
}: AlertModalProps) {
  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (isLoading) return
    await onConfirm()
    if (isLoading === undefined) {
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={isLoading ? () => {} : onOpenChange}>
      <AlertDialogContent
        className={cn(
          "bg-card p-6",
          contentClassName
        )}
      >
        <AlertDialogHeader className="gap-2 text-left">
          <AlertDialogTitle className="text-base lg:text-lg">{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {children && <div className="py-2">{children}</div>}

        <AlertDialogFooter className="mt-2 flex-row justify-end gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
            className="h-9 rounded-md px-4 text-sm font-semibold cursor-pointer disabled:pointer-events-none disabled:opacity-50"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              "h-9 rounded-md px-4 text-sm font-semibold cursor-pointer transition-colors inline-flex items-center gap-2 disabled:pointer-events-none disabled:opacity-70",
              confirmVariant === "destructive" &&
                "bg-destructive text-white hover:bg-destructive/90",
              confirmVariant === "success" &&
                "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            )}
          >
            {isLoading && <Loader inline size="sm" />}
            <span>{confirmLabel}</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertModal;
