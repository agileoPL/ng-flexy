import { FlexyPaginationData } from './pagination.data';

export class FlexyPagination<T> {
  get total(): number {
    return this.pagination.total;
  }
  get currentPage(): number {
    return this.pagination.currentPage;
  }
  get perPage(): number {
    return this.pagination.perPage;
  }
  get lastPage(): number {
    return Math.floor(this.pagination.total / this.pagination.perPage);
  }
  get data(): T[] {
    return this.pagination.data ? this.pagination.data : [];
  }
  set data(val) {
    this.pagination.data = val;
  }

  protected pagination: FlexyPaginationData<T>;

  constructor(pagination: FlexyPaginationData<T>) {
    this.pagination = pagination;
  }

  toJSON() {
    return JSON.parse(JSON.stringify(this.pagination));
  }
}
