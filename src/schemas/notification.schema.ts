import { z } from "zod"

export const sendNotificationSchema = z
  .object({
    target: z.enum(["all", "verified", "specific"], {
      message: "Please select a target audience",
    }),
    recipientName: z.string().optional(),
    title: z
      .string()
      .min(1, "Notification title is required")
      .min(3, "Title must be at least 3 characters")
      .max(120, "Title must be under 120 characters"),
    message: z
      .string()
      .min(1, "Message content is required")
      .min(10, "Message must be at least 10 characters")
      .max(1000, "Message must be under 1000 characters"),
  })
  .superRefine((data, ctx) => {
    if (
      data.target === "specific" &&
      (!data.recipientName || data.recipientName.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a registered user or business",
        path: ["recipientName"],
      })
    }
  })

export type SendNotificationFormValues = z.infer<typeof sendNotificationSchema>
