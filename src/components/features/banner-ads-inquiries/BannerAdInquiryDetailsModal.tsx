import { useEffect, useState } from "react"
import { Modal } from "@/components/common/modal"
import { UserAvatar } from "@/components/common"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BannerAdInquiryStatus } from "@/enums"
import { cn, formatDate } from "@/lib/utils"
import type { BannerAdInquiryData } from "@/types"
import {
  CheckCircle2,
  Clock,
  Mail,
  Megaphone,
  MessageSquare,
  Phone,
  Ruler,
  XCircle,
} from "lucide-react"

interface BannerAdInquiryDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inquiry: BannerAdInquiryData | null
  onStatusChange: (id: string, status: BannerAdInquiryStatus) => void
  isUpdating?: boolean
}

const getPlacementBadgeClass = (type: string) => {
  switch (type) {
    case "Header Banner":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
    case "Side Banner":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
    case "Blog Page Banner":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
    case "Footer Banner":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
    case "All in One":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

const BannerAdInquiryDetailsModal = ({
  open,
  onOpenChange,
  inquiry,
  onStatusChange,
  isUpdating = false,
}: BannerAdInquiryDetailsModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<BannerAdInquiryStatus>(
    inquiry?.status || BannerAdInquiryStatus.NEW
  )

  useEffect(() => {
    if (inquiry) {
      setSelectedStatus(inquiry.status)
    }
  }, [inquiry, open])

  if (!inquiry) return null

  const handleClose = () => {
    if (inquiry) {
      setSelectedStatus(inquiry.status)
    }
    onOpenChange(false)
  }

  const handleSave = () => {
    if (!inquiry) return
    if (selectedStatus !== inquiry.status) {
      onStatusChange(inquiry.id, selectedStatus)
    }
    onOpenChange(false)
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      title="Banner Ad Inquiry"
      description={`Submitted on ${formatDate(inquiry.created_at)} via Website Inquiry Form`}
      headerIcon={<Megaphone className="size-4 text-primary" />}
      maxWidth="sm:max-w-2xl"
      footer={
        <div className="flex items-center justify-end w-full gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            className="flex-1 sm:flex-none cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={selectedStatus === inquiry.status || isUpdating}
            className="flex-1 sm:flex-none cursor-pointer font-semibold shadow-xs"
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </div>
      }
    >
      <div className="space-y-3.5 sm:space-y-4 py-1">
        {/* Contact Info Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl border border-border bg-card/60 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <UserAvatar
                name={inquiry.name}
                className="size-10 sm:size-11 text-sm sm:text-base"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm sm:text-base font-bold text-foreground leading-tight truncate">
                  {inquiry.name}
                </h4>
              </div>
            </div>

            {/* Status Badge */}
            <Badge
              variant="secondary"
              className={cn(
                "gap-1 font-semibold text-[11px] sm:text-xs px-2.5 py-0.5 sm:py-1 shrink-0 rounded-full whitespace-nowrap self-start sm:self-center",
                inquiry.status === BannerAdInquiryStatus.NEW &&
                  "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
                inquiry.status === BannerAdInquiryStatus.CONFIRMED &&
                  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                inquiry.status === BannerAdInquiryStatus.REJECTED &&
                  "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
              )}
            >
              {inquiry.status === BannerAdInquiryStatus.CONFIRMED && <CheckCircle2 className="size-3" />}
              {inquiry.status === BannerAdInquiryStatus.REJECTED && <XCircle className="size-3" />}
              {inquiry.status === BannerAdInquiryStatus.NEW && <Clock className="size-3" />}
              <span>{inquiry.status}</span>
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2.5 border-t border-border/70 text-xs">
            <a
              href={`mailto:${inquiry.email}`}
              className="flex items-center gap-2 p-2 rounded-xl bg-muted/30 hover:bg-muted/70 transition-colors text-foreground group min-w-0"
            >
              <div className="size-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Mail className="size-3.5" />
              </div>
              <span className="truncate group-hover:underline text-xs">
                {inquiry.email}
              </span>
            </a>

            <a
              href={`tel:${inquiry.mobile}`}
              className="flex items-center gap-2 p-2 rounded-xl bg-muted/30 hover:bg-muted/70 transition-colors text-foreground group min-w-0"
            >
              <div className="size-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Phone className="size-3.5" />
              </div>
              <span className="font-semibold truncate group-hover:underline text-xs">
                {inquiry.mobile}
              </span>
            </a>
          </div>
        </div>

        {/* Ad Placement & Dimensions Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl border border-border bg-card/60 space-y-2.5">
          <span className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider block">
            Requested Ad Placement & Size
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/70 space-y-1 min-w-0">
              <span className="text-[11px] text-muted-foreground block font-medium">
                Placement Slot
              </span>
              <Badge
                className={cn(
                  "font-bold text-xs px-2.5 py-0.5 border shadow-2xs whitespace-normal sm:whitespace-nowrap inline-block",
                  getPlacementBadgeClass(inquiry.banner_type)
                )}
              >
                {inquiry.banner_type}
              </Badge>
            </div>

            <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/70 space-y-1 min-w-0">
              <span className="text-[11px] text-muted-foreground block font-medium flex items-center gap-1">
                <Ruler className="size-3" />
                Dimensions
              </span>
              <span className="text-xs font-extrabold text-foreground font-mono block truncate">
                {inquiry.width} × {inquiry.height}
              </span>
            </div>
          </div>
        </div>

        {/* Campaign Notes / Message */}
        {inquiry.notes && (
          <div className="p-3.5 sm:p-4 rounded-2xl border border-border bg-card/60 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <MessageSquare className="size-3.5 text-primary shrink-0" />
              <span>Campaign Requirements / Notes</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground bg-muted/30 p-2.5 sm:p-3 rounded-xl border border-border/60 whitespace-pre-wrap break-words">
              {inquiry.notes}
            </p>
          </div>
        )}

        {/* Quick Status Action Controls */}
        <div className="p-3 sm:p-3.5 rounded-2xl border border-border bg-muted/20 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <span className="text-xs font-bold text-foreground block">
              Update Inquiry Status:
            </span>
            {selectedStatus !== inquiry.status && (
              <span className="text-[11px] font-semibold text-primary">
                Click "Update Status" below to apply
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <Button
              type="button"
              size="sm"
              variant={selectedStatus === BannerAdInquiryStatus.NEW ? "default" : "outline"}
              onClick={() => setSelectedStatus(BannerAdInquiryStatus.NEW)}
              className={cn(
                "h-8 text-[11px] sm:text-xs font-semibold cursor-pointer gap-1 sm:gap-1.5 px-1.5 sm:px-3 transition-all min-w-0",
                selectedStatus === BannerAdInquiryStatus.NEW
                  ? "bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                  : "hover:bg-amber-500/10 hover:text-amber-600"
              )}
            >
              <Clock className="size-3 sm:size-3.5 shrink-0" />
              <span className="truncate">New</span>
            </Button>

            <Button
              type="button"
              size="sm"
              variant={selectedStatus === BannerAdInquiryStatus.CONFIRMED ? "default" : "outline"}
              onClick={() => setSelectedStatus(BannerAdInquiryStatus.CONFIRMED)}
              className={cn(
                "h-8 text-[11px] sm:text-xs font-semibold cursor-pointer gap-1 sm:gap-1.5 px-1.5 sm:px-3 transition-all min-w-0",
                selectedStatus === BannerAdInquiryStatus.CONFIRMED
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                  : "hover:bg-emerald-500/10 hover:text-emerald-600"
              )}
            >
              <CheckCircle2 className="size-3 sm:size-3.5 shrink-0" />
              <span className="truncate">Confirmed</span>
            </Button>

            <Button
              type="button"
              size="sm"
              variant={selectedStatus === BannerAdInquiryStatus.REJECTED ? "default" : "outline"}
              onClick={() => setSelectedStatus(BannerAdInquiryStatus.REJECTED)}
              className={cn(
                "h-8 text-[11px] sm:text-xs font-semibold cursor-pointer gap-1 sm:gap-1.5 px-1.5 sm:px-3 transition-all min-w-0",
                selectedStatus === BannerAdInquiryStatus.REJECTED
                  ? "bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                  : "hover:bg-rose-500/10 hover:text-rose-600"
              )}
            >
              <XCircle className="size-3 sm:size-3.5 shrink-0" />
              <span className="truncate">Rejected</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default BannerAdInquiryDetailsModal
