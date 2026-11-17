export const ContactInquiryStatus = {
  NEW: "New",
  REPLIED: "Replied",
  ARCHIVED: "Archived",
} as const

export type ContactInquiryStatus =
  (typeof ContactInquiryStatus)[keyof typeof ContactInquiryStatus]
