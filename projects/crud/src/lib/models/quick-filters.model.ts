import { FlexyListFilter } from './list-filter.data';

export interface FlexyQuickFilterData {
  id: number;
  name: string;
  params: FlexyListFilter;
  hash: string;
}
