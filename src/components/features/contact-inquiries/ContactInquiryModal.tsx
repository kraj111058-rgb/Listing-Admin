import { useEffect } from "react"
import { useForm, Controller, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Mail,
  Phone,
  Clock,
  Send,
  CheckCircle2,
  Archive,
  MessageSquare,
} from "lucide-react"
import { Modal } from "@/components/common/modal"
import { UserAvatar } from "@/components/common"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TextareaWithLabel } from "@/components/common/TextareaWithLabel"
import {
  contactReplySchema,
  type ContactReplyFormValues,
} from "@/schemas"
import { type ContactInquiryItem } from "@/data/dummyData"
import { cn } from "@/lib/utils"

interface ContactInquiryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inquiry: ContactInquiryItem | null
  onSendReply: (inquiryId: string, replyText: string) => void
  onToggleStatus: (inquiryId: string, status: ContactInquiryItem["status"]) => void
}

const ContactInquiryModal = ({
  open,
  onOpenChange,
  inquiry,
  onSendReply,
  onToggleStatus,
}: ContactInquiryModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ContactReplyFormValues>({
    resolver: zodResolver(contactReplySchema),
    defaultValues: {
      replyMessage: "",
    },
  })

  // Reset form when modal opens or inquiry changes
  useEffect(() => {
    if (open) {
      reset({
        replyMessage: "",
      })
    }
  }, [open, inquiry, reset])

  if (!inquiry) return null

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  const onSubmit: SubmitHandler<ContactReplyFormValues> = async (data) => {
    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 600))

    onSendReply(inquiry.id, data.replyMessage.trim())
    reset()
    onOpenChange(false)
  }

  const getSubjectBadgeVariant = (subject: ContactInquiryItem["subject"]) => {
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
      description={`Received ${inquiry.createdAt} from website contact form.`}
      headerIcon={<MessageSquare className="size-4" />}
      maxWidth="sm:max-w-2xl"
      asForm
      onSubmit={handleSubmit(onSubmit)}
      footer={
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2.5 w-full">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {inquiry.status !== "Archived" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onToggleStatus(inquiry.id, "Archived")}
                className="w-full sm:w-auto px-3 font-semibold gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground justify-center"
              >
                <Archive className="size-3.5" />
                <span>Archive</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="flex-1 sm:flex-none px-4 font-semibold cursor-pointer justify-center"
            >
              Close
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none gap-1.5 px-4 font-semibold cursor-pointer whitespace-nowrap justify-center"
            >
              <Send className="size-3.5 shrink-0" />
              <span>{isSubmitting ? "Sending..." : "Send Reply"}</span>
            </Button>
          </div>
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
                    href={`mailto:${inquiry.email}`}
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
                  <span>{inquiry.createdAt}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center self-start sm:self-center shrink-0">
            <Badge
              variant="secondary"
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold whitespace-nowrap",
                inquiry.status === "New" &&
                  "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
                inquiry.status === "Replied" &&
                  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                inquiry.status === "Archived" &&
                  "bg-muted text-muted-foreground border border-border"
              )}
            >
              {inquiry.status}
            </Badge>
          </div>
        </div>

        {/* Message Content */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-foreground select-none">
            User Message
          </label>
          <div className="p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-border bg-card text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap select-text break-words">
            {inquiry.message}
          </div>
        </div>

        {/* Previous Reply (if already replied) */}
        {inquiry.replyText && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 select-none">
                <CheckCircle2 className="size-3.5 shrink-0" />
                Previous Response Sent
              </label>
              {inquiry.repliedAt && (
                <span className="text-[10px] sm:text-[11px] text-muted-foreground">
                  Sent {inquiry.repliedAt}
                </span>
              )}
            </div>
            <div className="p-3 sm:p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs text-foreground leading-relaxed whitespace-pre-wrap break-words">
              {inquiry.replyText}
            </div>
          </div>
        )}

        {/* Quick Reply Form with Controller & react-hook-form */}
        <div className="space-y-1.5 pt-1">
          <Controller
            name="replyMessage"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextareaWithLabel
                label="Compose Reply"
                placeholder={`Type your response to ${inquiry.name} (${inquiry.email})...`}
                rows={4}
                {...field}
                error={error?.message}
                disabled={isSubmitting}
                description={`An official email reply will be dispatched directly to ${inquiry.email}.`}
              />
            )}
          />
        </div>
      </div>
    </Modal>
  )
}

export default ContactInquiryModal
