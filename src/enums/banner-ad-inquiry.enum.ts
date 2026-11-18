export const BannerAdInquiryStatus = {
  NEW: "New",
  CONFIRMED: "Confirmed",
  REJECTED: "Rejected",
} as const;

export type BannerAdInquiryStatus =
  (typeof BannerAdInquiryStatus)[keyof typeof BannerAdInquiryStatus];
