export interface FlexyPaginationData<T> {
  total: number;
  currentPage: number;
  lastPage: number;
  perPage?: number;
  data: T[];
}
