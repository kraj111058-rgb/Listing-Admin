export const CityStatus = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const

export type CityStatus = (typeof CityStatus)[keyof typeof CityStatus]

export const StateType = {
  STATE: "State",
  UNION_TERRITORY: "Union Territory",
} as const

export type StateType = (typeof StateType)[keyof typeof StateType]
