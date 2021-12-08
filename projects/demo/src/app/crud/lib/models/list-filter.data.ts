import { FlexyPaginationFilterData } from './pagination-filter.data';

export interface FlexyListFilter extends FlexyPaginationFilterData {
  searchTerm?: string;
  order?: string;
  sort?: string;
}
