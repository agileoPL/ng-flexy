export interface FlexyPaginationData<T> {
  data?: T[];
  currentPage: number;
  perPage: number;
  total: number;
}
