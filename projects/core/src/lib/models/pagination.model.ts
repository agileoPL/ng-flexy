import { FlexyPaginationData } from './pagination.data';

export class FlexyPagination<T> {
  get total(): number {
    return this.pagination.total;
  }
  get currentPage(): number {
    return this.pagination.currentPage;
  }
  get lastPage(): number {
    return this.pagination.lastPage;
  }
  get perPage(): number {
    return this.pagination.perPage;
  }

  get data(): T[] {
    return this.pagination.data;
  }

  protected pagination: FlexyPaginationData<T>;

  constructor(pagination: FlexyPaginationData<T>) {
    this.pagination = pagination;
  }
}
