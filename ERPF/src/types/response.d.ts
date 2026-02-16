interface ErpResponse<T> {
  data: T | null;
  success: boolean;
  message: string;
  severity: string;
}

interface PaginationResponse<T> {
  data: T | [];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  count: number;
}
