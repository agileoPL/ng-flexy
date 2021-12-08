import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FlexyPaginationFilterData } from '../models/pagination-filter.data';
import { FlexyPagination } from '../models/pagination.model';

const MAX_NUMBER_OF_VISIBLE_PAGES = 10;

@Component({
  selector: 'flexy-pagination',
  template: `
    <nav *ngIf="pagination && pagesCount > 1">
      <ul class="pagination">
        <li class="page-item" [ngClass]="{ disabled: !isPrev }">
          <a
            class="page-link t2e-btn-page-prev"
            (click)="goToPage(currentPage - 1); $event.stopPropagation()"
            title="{{ 'PREVIOUS_PAGE' | translate }}"
          >
            <span>&laquo; {{ 'PREVIOUS_PAGE' | translate }}</span>
          </a>
        </li>
        <li *ngIf="firstPage" class="page-item">
          <a class="page-link t2e-btn-page-first" (click)="goToPage(firstPage); $event.stopPropagation()">{{ firstPage }}</a>
        </li>
        <li *ngIf="firstPageDots" class="page-item"><span class="page-link t2e-first-page-dots">...</span></li>
        <li *ngFor="let page of pages" class="page-item" [ngClass]="{ active: currentPage === page }">
          <a class="page-link t2e-btn-page" (click)="goToPage(page); $event.stopPropagation()">{{ page }}</a>
        </li>
        <li *ngIf="lastPageDots" class="page-item"><span class="page-link t2e-last-page-dots">...</span></li>
        <li *ngIf="lastPage" class="page-item">
          <a class="page-link t2e-btn-page-last" (click)="goToPage(lastPage); $event.stopPropagation()">{{ lastPage }}</a>
        </li>
        <li class="page-item" [ngClass]="{ disabled: !isNext }">
          <a
            class="page-link t2e-btn-page-next"
            (click)="goToPage(currentPage + 1); $event.stopPropagation()"
            title="{{ 'NEXT_PAGE' | translate }}"
          >
            <span>{{ 'NEXT_PAGE' | translate }} &raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [
    `
      .page-link {
        cursor: pointer;
      }
    `
  ]
})
export class FlexyPaginationComponent implements OnChanges {
  @Input()
  pagination: FlexyPagination<any>;

  @Input()
  numberOfVisiblePages: number = MAX_NUMBER_OF_VISIBLE_PAGES;

  @Output()
  changePage: EventEmitter<FlexyPaginationFilterData> = new EventEmitter<FlexyPaginationFilterData>();

  currentPage = 0;
  firstPage = 0;
  firstPageDots = false;
  lastPage = 0;
  lastPageDots = false;
  pages: number[];

  isNext = false;
  isPrev = false;

  pagesCount = 0;

  constructor() {}

  ngOnChanges(changes) {
    this._initPages();
    this._setNextPrev();
  }

  goToPage(page) {
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
    this.pagesCount = this.pagination && this.pagination.perPage > 0 ? Math.ceil(this.pagination.total / this.pagination.perPage) : 0;
    this.currentPage = this.pagination && this.pagination.perPage > 0 ? this.pagination.currentPage + 1 : 1;
  }

  private _setNextPrev() {
    this.isPrev = this.pagesCount && this.currentPage > 1;
    this.isNext = this.pagesCount && this.currentPage < this.pagesCount;
    this._setPages();
  }

  private _setPages() {
    const pages = [];

    const maxPages = this.numberOfVisiblePages;
    const maxOneSidePages = Math.floor((this.numberOfVisiblePages - 2) / 2);

    if (this.pagesCount > maxPages) {
      const min = Math.max(1, this.currentPage - maxOneSidePages - Math.max(0, this.currentPage + maxOneSidePages - this.pagesCount));
      const max = Math.min(this.currentPage + maxOneSidePages + Math.max(0, maxOneSidePages - this.currentPage), this.pagesCount);

      this.firstPage = min !== 1 ? 1 : 0;
      this.firstPageDots = !!this.firstPage && min > 2;
      this.lastPage = max !== this.pagesCount ? this.pagesCount : 0;
      this.lastPageDots = !!this.lastPage && max < this.pagesCount - 1;

      for (let i = min; i <= max; i++) {
        pages.push(i);
      }
    } else {
      this.firstPage = 0;
      this.lastPage = 0;
      for (let i = 0; i < this.pagesCount; i++) {
        pages.push(i + 1);
      }
    }

    this.pages = pages;
  }
}
