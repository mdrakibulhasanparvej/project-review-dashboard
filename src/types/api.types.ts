export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Meta;
}

/**
 * Pagination envelope sent by the backend `sendResponse` helper.
 * The backend emits `dataCount` (not `total`) for the row count.
 */
export interface Meta {
  page?: number;
  limit?: number;
  dataCount?: number;
  totalPages?: number;
}
