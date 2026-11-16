export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageLimit: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  pageLimit?: number
}