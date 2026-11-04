import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { XCircle, ShieldAlert } from "lucide-react"
import { Modal } from "@/components/common/modal"
import { Button } from "@/components/ui/button"
import { TextareaWithLabel } from "@/components/common/TextareaWithLabel"
import {
  rejectListingSchema,
  type RejectListingFormValues,
} from "@/schemas/listing.schema"
import type { ListingItem } from "@/data/dummyData"

interface RejectListingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listing: ListingItem | null
  onConfirm: (reason: string) => void
}

export const RejectListingModal = ({
  open,
  onOpenChange,
  listing,
  onConfirm,
}: RejectListingModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<RejectListingFormValues>({
    resolver: zodResolver(rejectListingSchema),
    defaultValues: {
      rejectionReason: "",
    },
  })

  useEffect(() => {
    if (open) {
      reset({ rejectionReason: "" })
    }
  }, [open, reset])

  const onSubmit = (data: RejectListingFormValues) => {
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
      title="Reject Business Listing"
      description={
        listing?.name
          ? `Please provide a reason for rejecting "${listing.name}".`
          : "Please provide a reason for rejecting this listing."
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
              placeholder="Write specific details explaining why this business listing is rejected..."
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

export default RejectListingModal
