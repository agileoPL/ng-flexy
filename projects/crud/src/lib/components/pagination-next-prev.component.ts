import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FlexyPaginationFilterData } from '../models/pagination-filter.data';
import { FlexyPagination } from '../models/pagination.model';

@Component({
  selector: 'flexy-pagination-next-prev',
  template: `
    <nav *ngIf="pagination && pagination.lastPage > 1">
      <ul>
        <li *ngIf="total" class="fromTo">
          <b class="t2e-from">{{ from }}</b> - <b class="t2e-to">{{ to }}</b> z <b class="t2e-total">{{ total }}</b>
        </li>
        <li>
          <div class="btn-group">
            <button
              class="btn btn-white btn-sm t2e-btn-prev e2e-btn-prev-users-page"
              [disabled]="!isPrev"
              (click)="onChangePage(currentPage - 1); $event.stopPropagation()"
              [tooltip]="'PREVIOUS_PAGE' | translate"
            >
              <i class="fa fa-arrow-left" aria-hidden="true"></i>
            </button>
            <button
              class="btn btn-white btn-sm t2e-btn-next e2e-btn-next-users-page"
              [disabled]="!isNext"
              (click)="onChangePage(currentPage + 1); $event.stopPropagation()"
              [tooltip]="'NEXT_PAGE' | translate"
            >
              <i class="fa fa-arrow-right" aria-hidden="true"></i>
            </button>
          </div>
        </li>
      </ul>
    </nav>
  `
})
export class FlexyPaginationNextPrevComponent implements OnInit, OnChanges {
  @Input() pagination: FlexyPagination<any>;

  @Output() changePage: EventEmitter<FlexyPaginationFilterData> = new EventEmitter<FlexyPaginationFilterData>();

  currentPage = 0;
  total = 0;
  from = 0;
  to = 0;

  isNext = false;
  isPrev = false;

  private pagesCount = 0;

  constructor() {}

  ngOnInit() {
    this._initPages();
    this._setNextPrev();
  }

  ngOnChanges() {
    this._initPages();
    this._setNextPrev();
  }

  onChangePage(page) {
    if (page !== this.currentPage && page > 0 && page <= this.pagesCount) {
      this.currentPage = page;
      this.changePage.emit({
        page: page - 1,
        perPage: this.pagination.perPage
      });
      this._setNextPrev();
    }
  }

  private _initPages() {
    if (this.pagination) {
      this.pagesCount = this.pagination && this.pagination.perPage > 0 ? Math.ceil(this.pagination.total / this.pagination.perPage) : 0;
      this.currentPage = this.pagination && this.pagination.perPage > 0 ? this.pagination.currentPage + 1 : 1;
      this.total = this.pagination.total;
    }
  }

  private _setNextPrev() {
    if (this.pagination) {
      this.isPrev = this.pagesCount && this.currentPage > 1;
      this.isNext = this.pagesCount && this.currentPage < this.pagesCount;

      this.from = (this.currentPage - 1) * this.pagination.perPage + 1;
      this.to = Math.min(this.currentPage * this.pagination.perPage, this.total);
    }
  }
}
