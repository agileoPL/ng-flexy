import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FlexyPaginationComponent } from './pagination.component';
import { FlexyPaginationFilterData } from '../models/pagination-filter.data';
import { FlexyPagination } from '../models/pagination.model';

class TestedPage {
  fixture: ComponentFixture<TestHostComponent>;

  constructor(fixture: ComponentFixture<TestHostComponent>) {
    this.fixture = fixture;
  }

  firstPage(): HTMLButtonElement {
    return this.fixture.debugElement.query(By.css('.t2e-btn-page-first'))
      ? this.fixture.debugElement.query(By.css('.t2e-btn-page-first')).nativeElement
      : null;
  }

  lastPage(): HTMLButtonElement {
    return this.fixture.debugElement.query(By.css('.t2e-btn-page-last'))
      ? this.fixture.debugElement.query(By.css('.t2e-btn-page-last')).nativeElement
      : null;
  }

  firstPageDots(): HTMLElement {
    return this.fixture.debugElement.query(By.css('.t2e-first-page-dots'))
      ? this.fixture.debugElement.query(By.css('.t2e-first-page-dots')).nativeElement
      : null;
  }

  lastPageDots(): HTMLElement {
    return this.fixture.debugElement.query(By.css('.t2e-last-page-dots'))
      ? this.fixture.debugElement.query(By.css('.t2e-last-page-dots')).nativeElement
      : null;
  }

  pagesNumbers(index: number): HTMLButtonElement {
    return this.fixture.debugElement.queryAll(By.css('.t2e-btn-page'))[index]
      ? this.fixture.debugElement.queryAll(By.css('.t2e-btn-page'))[index].nativeElement
      : null;
  }

  pagePrev(): HTMLButtonElement {
    return this.fixture.debugElement.query(By.css('.t2e-btn-page-prev'))
      ? this.fixture.debugElement.query(By.css('.t2e-btn-page-prev')).nativeElement
      : null;
  }

  pageNext(): HTMLButtonElement {
    return this.fixture.debugElement.query(By.css('.t2e-btn-page-next'))
      ? this.fixture.debugElement.query(By.css('.t2e-btn-page-next')).nativeElement
      : null;
  }
}

describe('Component: FlexyPaginationComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let page: TestedPage;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      declarations: [FlexyPaginationComponent, TestHostComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        page = new TestedPage(fixture);
        fixture.detectChanges();
      });
  }));

  it('should create the pagination', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display 1st page button and change page to 1st', done => {
    component.pagination = getLargePagination();
    component.numberOfVisiblePages = 10;
    fixture.detectChanges();
    expect(page.firstPage()).toBeDefined();

    const subscription = component.changePage.subscribe(event => {
      expect(event).toEqual({ page: 0, perPage: 10 });
      subscription.unsubscribe();
      done();
    });
    page.firstPage().click();
    fixture.detectChanges();
  });

  it('should display last page button and change page to last', done => {
    component.pagination = getLargePagination();
    component.numberOfVisiblePages = 10;
    fixture.detectChanges();
    expect(page.lastPage()).toBeDefined();

    const subsc = component.changePage.subscribe((event: FlexyPaginationFilterData) => {
      expect(event).toEqual({ page: 39, perPage: 10 });
      subsc.unsubscribe();
      done();
    });
    page.lastPage().click();
    fixture.detectChanges();
  });

  it('should display first pages dots', () => {
    component.pagination = getLargePagination();
    component.numberOfVisiblePages = 10;
    fixture.detectChanges();
    expect(page.firstPageDots()).toBeDefined();
    expect(page.firstPageDots().textContent).toBe('...');
  });

  it('should not display first pages dots', () => {
    component.pagination = getSmallPagination();
    component.numberOfVisiblePages = 1;
    fixture.detectChanges();
    expect(page.firstPageDots()).toBeNull();
  });

  it('should choose number of page and change page to chosen value', done => {
    component.pagination = getLargePagination();
    component.numberOfVisiblePages = 10;
    fixture.detectChanges();
    expect(page.pagesNumbers(1)).toBeDefined();
    expect(page.pagesNumbers(1).textContent).toBe('8');

    const subsc = component.changePage.subscribe((event: FlexyPaginationFilterData) => {
      expect(event).toEqual({ page: 7, perPage: 10 });
      subsc.unsubscribe();
      done();
    });
    page.pagesNumbers(1).click();
    fixture.detectChanges();
  });

  it('should display previous page button and change page to previous', done => {
    component.pagination = getLargePagination();
    component.numberOfVisiblePages = 10;
    fixture.detectChanges();
    expect(page.pagePrev()).toBeDefined();

    const subsc = component.changePage.subscribe((event: FlexyPaginationFilterData) => {
      expect(event).toEqual({ page: 9, perPage: 10 });
      subsc.unsubscribe();
      done();
    });
    page.pagePrev().click();
    fixture.detectChanges();
  });

  it('should display next page button and change page to next', done => {
    component.pagination = getLargePagination();
    component.numberOfVisiblePages = 10;
    fixture.detectChanges();
    expect(page.pageNext()).toBeDefined();

    const subsc = component.changePage.subscribe((event: FlexyPaginationFilterData) => {
      expect(event).toEqual({ page: 11, perPage: 10 });
      subsc.unsubscribe();
      done();
    });
    page.pageNext().click();
    fixture.detectChanges();
  });

  it('should display last pages dots', () => {
    component.pagination = getLargePagination();
    component.numberOfVisiblePages = 10;
    fixture.detectChanges();
    expect(page.lastPageDots()).toBeDefined();
    expect(page.lastPageDots().textContent).toBe('...');
  });

  it('should not display last pages dots', () => {
    component.pagination = getSmallPagination();
    component.numberOfVisiblePages = 1;
    fixture.detectChanges();
    expect(page.lastPageDots()).toBeNull();
  });

  const getLargePagination = () => new FlexyPagination({
    currentPage: 10,
    perPage: 10,
    total: 400
  });

  const getSmallPagination = () => new FlexyPagination({
    currentPage: 1,
    perPage: 10,
    total: 10
  });
});

@Component({
  template: `
    <flexy-pagination
      [pagination]="pagination"
      [numberOfVisiblePages]="numberOfVisiblePages"
      (changePage)="changePage.emit($event)"
    ></flexy-pagination>
  `
})
class TestHostComponent {
  @Input()
  pagination: FlexyPagination<any>;

  @Input()
  numberOfVisiblePages: number;

  @Output()
  changePage: EventEmitter<FlexyPaginationFilterData> = new EventEmitter<FlexyPaginationFilterData>();
}
