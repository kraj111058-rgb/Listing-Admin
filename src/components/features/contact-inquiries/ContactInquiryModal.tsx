import {
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  Archive,
  MessageSquare,
  ExternalLink,
  MessageCircle,
} from "lucide-react"
import { Modal } from "@/components/common/modal"
import { UserAvatar } from "@/components/common"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ContactInquiryStatus } from "@/enums"
import { cn, formatDate } from "@/lib/utils"
import type { ContactInquiryData } from "@/types"

interface ContactInquiryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inquiry: ContactInquiryData | null
  onToggleStatus: (inquiryId: string, status: ContactInquiryStatus) => void
}

const ContactInquiryModal = ({
  open,
  onOpenChange,
  inquiry,
  onToggleStatus,
}: ContactInquiryModalProps) => {
  if (!inquiry) return null

  const handleClose = () => {
    onOpenChange(false)
  }

  const cleanPhone = inquiry.phone ? inquiry.phone.replace(/[^0-9]/g, "") : ""
  const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : ""
  const mailtoUrl = `mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}`

  const getSubjectBadgeVariant = (subject: string) => {
    switch (subject) {
      case "Business Partnership":
        return "border-violet-200 bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:border-violet-900/60 dark:text-violet-300"
      case "Advertising & Sponsorship":
        return "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-300"
      case "Technical Issue":
        return "border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-300"
      case "Listing Support":
        return "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:border-blue-900/60 dark:text-blue-300"
      default:
        return "border-slate-200 bg-slate-50 text-slate-700 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-300"
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      title="Contact Inquiry Details"
      description={`Received ${formatDate(inquiry.created_at)} from website contact form.`}
      headerIcon={<MessageSquare className="size-4" />}
      maxWidth="sm:max-w-2xl"
      footerClassName="shrink-0"
      footer={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 w-full">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {inquiry.status !== ContactInquiryStatus.REPLIED ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onToggleStatus(inquiry.id, ContactInquiryStatus.REPLIED)}
                className="flex-1 sm:flex-initial sm:w-auto px-3 font-semibold gap-1.5 cursor-pointer text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 justify-center shrink"
              >
                <CheckCircle2 className="size-3.5 shrink-0" />
                <span className="truncate">Mark as Replied</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onToggleStatus(inquiry.id, ContactInquiryStatus.NEW)}
                className="flex-1 sm:flex-initial sm:w-auto px-3 font-semibold gap-1.5 cursor-pointer text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 justify-center shrink"
              >
                <Clock className="size-3.5 shrink-0" />
                <span className="truncate">Mark as New</span>
              </Button>
            )}

            {inquiry.status !== ContactInquiryStatus.ARCHIVED ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onToggleStatus(inquiry.id, ContactInquiryStatus.ARCHIVED)}
                className="flex-1 sm:flex-initial sm:w-auto px-3 font-semibold gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground justify-center shrink"
              >
                <Archive className="size-3.5 shrink-0" />
                <span className="truncate">Archive</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onToggleStatus(inquiry.id, ContactInquiryStatus.NEW)}
                className="flex-1 sm:flex-initial sm:w-auto px-3 font-semibold gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground justify-center shrink"
              >
                <Archive className="size-3.5 shrink-0" />
                <span className="truncate">Unarchive</span>
              </Button>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            className="w-full sm:w-auto px-4 font-semibold cursor-pointer justify-center"
          >
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Sender Info Bar */}
        <div className="p-3 sm:p-4 rounded-xl border border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3 min-w-0 w-full">
            <UserAvatar
              name={inquiry.name}
              className="size-9 sm:size-10 text-xs sm:text-sm"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm font-bold text-foreground truncate">
                  {inquiry.name}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-semibold rounded-md px-2 py-0.5 shrink-0",
                    getSubjectBadgeVariant(inquiry.subject)
                  )}
                >
                  {inquiry.subject}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] sm:text-xs text-muted-foreground">
                <span className="flex items-center gap-1 min-w-0 max-w-full">
                  <Mail className="size-3 text-muted-foreground shrink-0" />
                  <a
                    href={mailtoUrl}
                    className="hover:text-primary transition-colors hover:underline truncate"
                  >
                    {inquiry.email}
                  </a>
                </span>
                {inquiry.phone && (
                  <span className="flex items-center gap-1 shrink-0">
                    <Phone className="size-3 text-muted-foreground shrink-0" />
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="hover:text-primary transition-colors hover:underline"
                      title={`Call ${inquiry.phone}`}
                    >
                      {inquiry.phone}
                    </a>
                  </span>
                )}
                <span className="flex items-center gap-1 shrink-0">
                  <Clock className="size-3 text-muted-foreground shrink-0" />
                  <span>{formatDate(inquiry.created_at)}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center self-start sm:self-center shrink-0">
            <Badge
              variant="secondary"
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold whitespace-nowrap",
                inquiry.status === ContactInquiryStatus.NEW &&
                  "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
                inquiry.status === ContactInquiryStatus.REPLIED &&
                  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                inquiry.status === ContactInquiryStatus.ARCHIVED &&
                  "bg-muted text-muted-foreground border border-border"
              )}
            >
              {inquiry.status}
            </Badge>
          </div>
        </div>

        {/* Message Content */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700 dark:text-foreground select-none">
            User Message
          </label>
          <div className="p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-border bg-card text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap select-text break-words">
            {inquiry.message}
          </div>
        </div>

        {/* Quick Contact Actions Bar */}
        <div className="p-3 rounded-xl border border-dashed border-border bg-muted/20 flex flex-wrap items-center justify-between gap-2.5">
          <div className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Reach Out:</span>{" "}
            Contact user directly via their provided details.
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {inquiry.phone && (
              <>
                <a
                  href={`tel:${inquiry.phone}`}
                  className="inline-flex"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-semibold gap-1.5 cursor-pointer"
                  >
                    <Phone className="size-3.5 text-primary" />
                    <span>Call</span>
                  </Button>
                </a>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-semibold gap-1.5 cursor-pointer text-emerald-600 hover:text-emerald-700"
                    >
                      <MessageCircle className="size-3.5" />
                      <span>WhatsApp</span>
                    </Button>
                  </a>
                )}
              </>
            )}

            <a
              href={mailtoUrl}
              className="inline-flex"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold gap-1.5 cursor-pointer text-indigo-600 hover:text-indigo-700"
              >
                <Mail className="size-3.5" />
                <span>Open in Gmail</span>
                <ExternalLink className="size-3 ml-0.5 opacity-60" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ContactInquiryModal
