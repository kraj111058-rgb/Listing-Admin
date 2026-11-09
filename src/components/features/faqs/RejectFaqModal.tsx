import { Modal } from "@/components/common/modal"
import { TextareaWithLabel } from "@/components/common/TextareaWithLabel"
import { Button } from "@/components/ui/button"
import type { ListingFaqAdminItem } from "@/data/dummyData"
import {
  rejectFaqSchema,
  type RejectFaqFormValues,
} from "@/schemas/faq.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { ShieldAlert, XCircle } from "lucide-react"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"

interface RejectFaqModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  faq: ListingFaqAdminItem | null
  onConfirm: (reason: string) => void
}

export const RejectFaqModal = ({
  open,
  onOpenChange,
  faq,
  onConfirm,
}: RejectFaqModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<RejectFaqFormValues>({
    resolver: zodResolver(rejectFaqSchema),
    defaultValues: {
      rejectionReason: "",
    },
  })

  useEffect(() => {
    if (open) {
      reset({ rejectionReason: "" })
    }
  }, [open, reset])

  const onSubmit = (data: RejectFaqFormValues) => {
    onConfirm(data.rejectionReason)
    reset()
    onOpenChange(false)
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      title="Reject Listing FAQ"
      description={
        faq?.listingName
          ? `Please provide a reason for rejecting this FAQ for "${faq.listingName}".`
          : "Please provide a reason for rejecting this FAQ."
      }
      headerIcon={<XCircle className="size-4.5 text-destructive" />}
      maxWidth="sm:max-w-xl"
      asForm
      onSubmit={handleSubmit(onSubmit)}
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            size="sm"
            disabled={isSubmitting}
            className="font-semibold cursor-pointer gap-1.5 shadow-xs"
          >
            <ShieldAlert className="size-4.25" />
            {isSubmitting ? "Rejecting..." : "Confirm Rejection"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Controller
          name="rejectionReason"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextareaWithLabel
              id="rejectionReason"
              label="Rejection Reason"
              placeholder="Explain clearly why this FAQ cannot be approved."
              rows={4}
              {...field}
              error={error?.message}
            />
          )}
        />
      </div>
    </Modal>
  )
}

export default RejectFaqModal

