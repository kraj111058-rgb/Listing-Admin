import { Modal } from "@/components/common/modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type ListingFaqAdminItem } from "@/data/dummyData"
import {
  CheckCircle2,
  Clock,
  HelpCircle,
  MapPin,
  MessageSquare,
  Store,
  User,
  XCircle
} from "lucide-react"

interface FaqDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  faq: ListingFaqAdminItem | null
}

export const FaqDetailsModal = ({
  open,
  onOpenChange,
  faq,
}: FaqDetailsModalProps) => {
  if (!faq) return null

  const getStatusBadge = () => {
    switch (faq.status) {
      case "Approved":
        return (
          <Badge variant="success" className="gap-1 rounded-full px-2.5 py-0.5">
            <CheckCircle2 className="size-3" />
            Approved
          </Badge>
        )
      case "Pending":
        return (
          <Badge variant="warning" className="gap-1 rounded-full px-2.5 py-0.5">
            <Clock className="size-3" />
            Pending
          </Badge>
        )
      case "Rejected":
        return (
          <Badge variant="danger" className="gap-1 rounded-full px-2.5 py-0.5">
            <XCircle className="size-3" />
            Rejected
          </Badge>
        )
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      onClose={() => onOpenChange(false)}
      title="Custom FAQ Details"
      description={`Added on ${faq.createdAt} under ${faq.listingName}`}
      headerIcon={<HelpCircle className="size-4.5 text-primary" />}
      maxWidth="sm:max-w-2xl"
      footer={
        <div className="flex items-center justify-end w-full">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto px-6 cursor-pointer font-semibold"
          >
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-4 py-1">
        {/* 1. FAQ Question & Answer Card */}
        <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <MessageSquare className="size-3.5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Question & Answer
              </span>
            </div>
            {getStatusBadge()}
          </div>

          {/* Question */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Question
            </span>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs sm:text-sm font-semibold text-foreground leading-snug">
              {faq.question}
            </div>
          </div>

          {/* Answer */}
          <div className="space-y-1 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Answer
            </span>
            <div className="p-3.5 rounded-xl bg-background border border-border text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-normal">
              {faq.answer}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. ASSOCIATED BUSINESS LISTING CARD                       */}
        {/* ========================================================= */}
        <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-border/60 pb-2.5">
            <div className="size-6 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Store className="size-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Associated Business Listing
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                  Listing Name
                </span>
                <Badge variant="outline" className="text-[10px] font-medium px-1.5 py-0 bg-background/50">
                  {faq.listingCategory}
                </Badge>
              </div>
              <span className="text-xs sm:text-sm font-bold text-foreground block truncate">
                {faq.listingName}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">{faq.city || "Mumbai, MH"}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1 min-w-0">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                Business Owner
              </span>
              <span className="text-xs sm:text-sm font-bold text-foreground block truncate">
                {faq.ownerName}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <User className="size-3 shrink-0" />
                <span>Verified Business Owner</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default FaqDetailsModal

