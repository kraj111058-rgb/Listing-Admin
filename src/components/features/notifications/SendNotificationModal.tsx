import { useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Send,
  Building2,
  ShieldCheck,
  User,
} from "lucide-react"
import { Modal } from "@/components/common/modal"
import { Button } from "@/components/ui/button"
import { InputWithLabel } from "@/components/common/InputWithLabel"
import { SelectWithLabel } from "@/components/common/SelectWithLabel"
import { TextareaWithLabel } from "@/components/common/TextareaWithLabel"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import {
  sendNotificationSchema,
  type SendNotificationFormValues,
} from "@/schemas/notification.schema"
import { mockUsers, type NotificationItem } from "@/data/dummyData"
import { cn } from "@/lib/utils"

interface SendNotificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSend: (notification: NotificationItem) => void
}

const targetOptions = [
  {
    id: "all",
    label: "All Businesses",
    description: "Broadcast to all registered businesses & owners",
    icon: Building2,
  },
  {
    id: "verified",
    label: "Verified Only",
    description: "Send only to directory verified listing owners",
    icon: ShieldCheck,
  },
  {
    id: "specific",
    label: "Specific User",
    description: "Deliver directly to an individual business",
    icon: User,
  },
] as const

const SendNotificationModal = ({
  open,
  onOpenChange,
  onSend,
}: SendNotificationModalProps) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<SendNotificationFormValues>({
    resolver: zodResolver(sendNotificationSchema),
    defaultValues: {
      target: "all",
      recipientName: "",
      title: "",
      message: "",
    },
  })

  const selectedTarget = watch("target")

  const userOptions = useMemo(
    () =>
      mockUsers.map((user) => ({
        value: user.name,
        label: `${user.name} (${user.email})`,
      })),
    []
  )

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  const onSubmit = async (data: SendNotificationFormValues) => {
    const recipientName =
      data.target === "specific"
        ? data.recipientName
        : data.target === "verified"
        ? "Verified Only"
        : "All Businesses"

    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: "broadcast",
      title: data.title,
      message: data.message,
      target: data.target === "specific" ? "business" : data.target === "verified" ? "business" : "all",
      recipientName,
      createdAt: "Just now",
      read: false,
    }

    onSend(newNotification)
    reset()
    onOpenChange(false)
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      title="Send Broadcast Notification"
      description="Send announcements to businesses & users."
      headerIcon={<Send className="size-4" />}
      maxWidth="sm:max-w-xl"
      asForm
      onSubmit={handleSubmit(onSubmit)}
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
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
            size="sm"
            disabled={isSubmitting}
            className="font-semibold cursor-pointer"
          >
            <Send className="size-3.5" />
            {isSubmitting ? "Sending..." : "Send Notification"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Target Audience with Controller */}
        <Controller
          name="target"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Field data-invalid={!!error} className="gap-2">
              <FieldLabel className="text-xs sm:text-sm font-bold text-slate-700 dark:text-foreground select-none">
                Target Audience <span className="text-red-500 font-bold ml-0.5">*</span>
              </FieldLabel>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {targetOptions.map((opt) => {
                  const Icon = opt.icon
                  const isSelected = field.value === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => field.onChange(opt.id)}
                      className={cn(
                        "relative flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer group",
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs"
                          : "border-border bg-card hover:bg-muted/40 hover:border-slate-300 dark:hover:border-slate-700"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1.5 w-full">
                        <div
                          className={cn(
                            "size-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                            isSelected
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "bg-muted text-muted-foreground group-hover:text-foreground"
                          )}
                        >
                          <Icon className="size-3.5" />
                        </div>
                        <span className="text-xs font-bold text-foreground">
                          {opt.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                        {opt.description}
                      </span>
                    </button>
                  )
                })}
              </div>
              {error && <FieldError>{error.message}</FieldError>}
            </Field>
          )}
        />

        {/* Conditional Recipient User Select with Controller */}
        {selectedTarget === "specific" && (
          <Controller
            name="recipientName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <SelectWithLabel
                id="recipientName"
                label="Recipient Business / User Name"
                placeholder="Select registered user..."
                options={userOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={error?.message}
              />
            )}
          />
        )}

        {/* Notification Title with Controller */}
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputWithLabel
              label="Notification Title"
              placeholder="e.g., Scheduled Platform Maintenance Notice"
              {...field}
              error={error?.message}
            />
          )}
        />

        {/* Notification Message with Controller & TextareaWithLabel */}
        <Controller
          name="message"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextareaWithLabel
              label="Message Content"
              placeholder="Write the full notification message here..."
              {...field}
              error={error?.message}
            />
          )}
        />
      </div>
    </Modal>
  )
}

export default SendNotificationModal
