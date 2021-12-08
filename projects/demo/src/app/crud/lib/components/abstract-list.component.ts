import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { FlexyData, FlexyModel } from '@ng-flexy/core';
import { FlexyFormFieldLayoutJsonSchema } from '@ng-flexy/form';
import { cloneDeep, isEmpty } from 'lodash';
import { FlexyListField } from '../models/list-field.data';
import { FlexyListAction } from '../models/list-action.data';
import { FlexyListFilter } from '../models/list-filter.data';
import { FlexyPagination } from '../models/pagination.model';

export abstract class FlexyAbstractListComponent {
  pagination: FlexyPagination<FlexyModel<FlexyData>>;
  fields: FlexyListField<FlexyModel<FlexyData>>[];
  filter: FlexyListFilter = { page: 0, perPage: 30 };
  filterSchema: FlexyFormFieldLayoutJsonSchema[];
  actions: FlexyListAction<FlexyModel<FlexyData>>[];

  constructor(protected location: Location, protected activatedRoute: ActivatedRoute) {}

  protected abstract loadPagination(filter: FlexyListFilter): Promise<FlexyPagination<FlexyModel<FlexyData>>>;

  onChangeFilter(filter: FlexyListFilter) {
    Object.assign(this.filter, filter);
    this.loadData();
  }

  protected init() {
    this.initListFilter();
    this.loadData();
  }

  private loadData() {
    this.loadPagination(this.filter).then(pagination => {
      this.pagination = pagination;
      this.refreshUrlParams();
    });
  }

  private refreshUrlParams() {
    const params = [];
    Object.keys(this.filter).forEach(key => {
      if (this.filter[key] || this.filter[key] === 0) {
        params.push(key + '=' + this.filter[key]);
      }
    });
    this.location.go(this.location.path(false).split(';')[0] + ';' + params.join(';'));
  }

  protected initListFilter() {
    this.activatedRoute.params
      .subscribe((params: Params) => {
        const filter: FlexyListFilter = cloneDeep(this.filter);
        Object.keys(params).forEach(key => {
          if (!isEmpty(params[key]) || params[key] === 0) {
            filter[key] = params[key];
          }
        });
        filter.page = filter.page ? filter.page : 0;
        filter.perPage = filter.perPage ? filter.perPage : 30;
        this.filter = filter;
      })
      .unsubscribe();
  }
}
