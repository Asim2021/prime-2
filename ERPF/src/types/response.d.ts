interface ErpResponseI<T> {
  data: T | null;
  success: boolean;
  message: string;
  severity: string;
}

interface PaginationResponseI<T> {
  data: T | [];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  count: number;
}
