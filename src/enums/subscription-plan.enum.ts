export const SubscriptionPlanStatus = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const;

export type SubscriptionPlanStatus =
  (typeof SubscriptionPlanStatus)[keyof typeof SubscriptionPlanStatus];
