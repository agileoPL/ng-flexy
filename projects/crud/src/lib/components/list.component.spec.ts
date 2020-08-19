import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexyListComponent } from './list.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EnabledActionsFilterPipe } from '../pipes/enabled-actions-filter.pipe';
import { HoverActionsFilterPipe } from '../pipes/hover-actions-filter.pipe';
import { FlexyData, FlexyLoggerService, FlexyModel, FlexySessionStorageService } from '@ng-flexy/core';
import { FieldValuePipe } from '../pipes/list-field-value.pipe';
import { OrderByFieldLabelPipe } from '../pipes/list-order-by-field-label.pipe';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FlexyListField } from '../models/list-field.data';
import { FlexyListFavourites } from '../models/list-favourites.data';
import { FlexyListToggleable } from '../models/list-toggleable.data';
import { FlexyListFilter } from '../models/list-filter.data';
import { FlexyPaginationData } from '../models/pagination.data';

interface ProductData extends FlexyData {
  name: string;
}
class Product extends FlexyModel<ProductData> {
  get id() {
    return this.data.id;
  }
  get name() {
    return this.data.name;
  }
  constructor(data: ProductData) {
    super(data);
  }
}
class Page {
  fixture: ComponentFixture<TestHostComponent>;
  constructor(fixture: ComponentFixture<TestHostComponent>) {
    this.fixture = fixture;
  }
  countRenderedRows() {
    return this.fixture.nativeElement.querySelectorAll('table > tbody > tr').length;
  }
  getTableHeader(index) {
    const ths = this.fixture.nativeElement.querySelectorAll('table > thead > tr > th');
    return ths.length > index ? ths.item(index).textContent.trim() : '';
  }
  getTableFirstRowCol(index) {
    const tds = this.fixture.nativeElement.querySelectorAll('table > tbody > tr > td');
    return tds.length > index ? tds.item(index).textContent.trim() : '';
  }
  getCheckAllButton(): HTMLButtonElement {
    return this.fixture.nativeElement.querySelector('.t2e-btn-check-all') as HTMLButtonElement;
  }
  getCheckedCounter(): string {
    const counter = this.fixture.nativeElement.querySelector('.t2e-counter-check-all');
    if (counter) {
      return counter.textContent.trim();
    } else {
      return '';
    }
  }
  getFirstCheckbox(): HTMLButtonElement {
    return this.fixture.nativeElement.querySelector('.t2e-btn-check') as HTMLButtonElement;
  }
  getCheckbox(index: number): HTMLButtonElement {
    return this.fixture.nativeElement.querySelectorAll('.t2e-btn-check').item(index) as HTMLButtonElement;
  }
  countCheckboxes(): number {
    return this.fixture.nativeElement.querySelectorAll('.t2e-btn-check').length;
  }
  countChecked(): number {
    return this.fixture.nativeElement.querySelectorAll('.t2e-btn-check.fa-check-square-o').length;
  }
  searchTermInput(): HTMLInputElement {
    return this.fixture.nativeElement.querySelector('.t2e-input-searchTerm') as HTMLInputElement;
  }
  countUnchecked(): number {
    return this.fixture.nativeElement.querySelectorAll('.t2e-btn-check.fa-square-o').length;
  }
  getFavouriteButton(index): HTMLButtonElement {
    return this.fixture.nativeElement.querySelectorAll('.t2e-btn-checkFavourite').item(index) as HTMLButtonElement;
  }
  countFavourites(): number {
    return this.fixture.nativeElement.querySelectorAll('.t2e-btn-checkFavourite.fa-star').length;
  }
}
describe('Component: Crud List', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let page: Page;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        BsDropdownModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [FlexySessionStorageService, FlexyLoggerService],
      declarations: [
        TestHostComponent,
        FlexyListComponent,
        EnabledActionsFilterPipe,
        HoverActionsFilterPipe,
        FieldValuePipe,
        OrderByFieldLabelPipe
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        page = new Page(fixture);
      });
  }));
  it('should create the crud list', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should render pagination list', () => {
    component.pagination = preparePagination(1, 10, 100);
    component.fields = prepareFields();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(page.countRenderedRows()).toBe(10);
  });
  it('should render defined columns', () => {
    component.pagination = preparePagination(1, 10, 100);
    component.fields = prepareFields();
    component.areCheckboxesVisible = false;
    component.areFavouritesVisible = false;
    fixture.detectChanges();

    expect(component).toBeTruthy();

    expect(page.getTableHeader(0)).toBe('Id');
    expect(page.getTableHeader(1)).toBe('Name');
    expect(page.getTableFirstRowCol(0)).toBe('1');
    expect(page.getTableFirstRowCol(1)).toBe('Product 1');
  });
  describe('checkboxes option [areCheckboxesVisible]', () => {
    it('should activated checkboxes option', () => {
      component.pagination = preparePagination(1, 1, 1);
      component.fields = prepareFields();
      component.areCheckboxesVisible = true;
      component.areFavouritesVisible = false;
      fixture.detectChanges();
      expect(page.getCheckAllButton()).toBeDefined();
      expect(page.getFirstCheckbox()).toBeDefined();
    });
    it('should select all rows', () => {
      component.pagination = preparePagination(1, 5, 10);
      component.fields = prepareFields();
      component.areCheckboxesVisible = true;
      component.areFavouritesVisible = false;
      fixture.detectChanges();
      expect(page.getCheckAllButton()).toBeDefined();
      page.getCheckAllButton().click();
      fixture.detectChanges();
      expect(page.getCheckedCounter()).toBe('+5');
      expect(page.countChecked()).toBe(5);
      expect(page.countUnchecked()).toBe(0);
      expect(page.countCheckboxes()).toBe(5);
    });
    it('should select all rows and then unselect them', () => {
      component.pagination = preparePagination(1, 30, 90);
      component.fields = prepareFields();
      component.areCheckboxesVisible = true;
      component.areFavouritesVisible = false;
      fixture.detectChanges();
      page.getCheckAllButton().click();
      fixture.detectChanges();
      expect(page.getCheckedCounter()).toBe('+30');
      expect(page.countChecked()).toBe(30);
      expect(page.countUnchecked()).toBe(0);
      expect(page.countCheckboxes()).toBe(30);
      expect(page.getCheckAllButton()).toBeDefined();
      page.getCheckAllButton().click();
      fixture.detectChanges();
      expect(page.getCheckedCounter()).toBeFalsy();
      expect(page.countChecked()).toBe(0);
      expect(page.countUnchecked()).toBe(30);
    });
    it('should select random items and next unselect all', () => {
      component.pagination = preparePagination(1, 5, 10);
      component.fields = prepareFields();
      component.areCheckboxesVisible = true;
      component.areFavouritesVisible = false;
      fixture.detectChanges();
      page.getCheckbox(0).click();
      page.getCheckbox(2).click();
      page.getCheckbox(3).click();
      fixture.detectChanges();
      expect(page.getCheckedCounter()).toBe('+3');
      expect(page.countChecked()).toBe(3);
      expect(page.countUnchecked()).toBe(2);
      expect(page.countCheckboxes()).toBe(5);
      expect(page.getCheckAllButton()).toBeDefined();
      page.getCheckAllButton().click();
      fixture.detectChanges();
      expect(page.getCheckedCounter()).toBeFalsy();
      expect(page.countChecked()).toBe(0);
      expect(page.countUnchecked()).toBe(5);
    });
    it('should trigger checkboxes changes (onChangeChecked)', done => {
      component.areCheckboxesVisible = true;
      component.areFavouritesVisible = false;
      component.pagination = preparePagination(1, 1, 1);
      component.fields = prepareFields();
      fixture.detectChanges();
      const subcs = component.changeChecked.subscribe(sEvent => {
        expect(sEvent).toBeDefined();
        expect(sEvent[1]).toBe(true);
        subcs.unsubscribe();
        done();
      });

      page.getCheckbox(0).click();
      fixture.detectChanges();
    });
  });
  describe('search term input options', () => {
    it('should emit search term filter changes in 500ms intervals', done => {
      component.pagination = preparePagination(1, 30, 90);
      component.fields = prepareFields();
      fixture.detectChanges();
      const searchInput = page.searchTermInput();
      let event;
      let eventCounter = 0;
      const subsc = component.changeFilter.subscribe(fEvent => {
        event = fEvent;
        eventCounter++;

        if (eventCounter === 1) {
          expect(event.searchTerm).toBe('some');
          expect(eventCounter).toBe(1);

          searchInput.value = 'some value';
          searchInput.dispatchEvent(new Event('input'));
        }

        if (eventCounter === 2) {
          expect(event.searchTerm).toBe('some value');
          expect(eventCounter).toBe(2);

          subsc.unsubscribe();
          done();
        }
      });

      searchInput.value = 's';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.value = 'so';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.value = 'some';
      searchInput.dispatchEvent(new Event('input'));
    });
  });
  describe('favourites option [areFavouritesVisible]', () => {
    it('should activated favourites option', () => {
      component.areCheckboxesVisible = false;
      component.areFavouritesVisible = true;
      component.pagination = preparePagination(1, 1, 1);
      component.fields = prepareFields();
      fixture.detectChanges();
      expect(page.getFavouriteButton(0)).toBeDefined();
    });
    it('should trigger favourites changes (onFavouriteChanged)', done => {
      component.areCheckboxesVisible = false;
      component.areFavouritesVisible = true;
      component.pagination = preparePagination(1, 1, 1);
      component.fields = prepareFields();
      fixture.detectChanges();

      const subsc = component.favouriteChanged.subscribe(fEvent => {
        expect(fEvent).toBeDefined();
        expect(fEvent.model.id).toBe(1);
        subsc.unsubscribe();

        done();
      });
      page.getFavouriteButton(0).click();
      fixture.detectChanges();
    });
    it('should checked default favourites [favouritesIds]', () => {
      component.pagination = preparePagination(1, 5, 10);
      component.fields = prepareFields();
      component.areCheckboxesVisible = false;
      component.areFavouritesVisible = true;
      component.favouritesIds = [1, 3, 4];
      fixture.detectChanges();
      expect(page.countFavourites()).toBe(3);
    });
  });
  const preparePagination = (currentPage = 1, perPage = 10, total = 10) => {
    const data = [];
    for (let i = (currentPage - 1) * perPage; i < Math.min(total, currentPage * perPage); i++) {
      data.push({
        id: i + 1,
        name: 'Product ' + (i + 1)
      });
    }
    const pagination: FlexyPaginationData<Product> = {
      total,
      currentPage,
      perPage,
      data: data.map(item => new Product(item))
    };
    return pagination;
  };
  const prepareFields = () => {
    return [
      {
        key: 'id',
        label: 'Id'
      },
      {
        key: 'name',
        label: 'Name'
      }
    ];
  };
});

@Component({
  template: `
    <flexy-crud-list
      [pagination]="pagination"
      [fields]="fields"
      [areCheckboxesVisible]="areCheckboxesVisible"
      [areFavouritesVisible]="areFavouritesVisible"
      [favouritesIds]="favouritesIds"
      (favouriteChanged)="favouriteChanged.emit($event)"
      (changeChecked)="changeChecked.emit($event)"
      (changeFilter)="changeFilter.emit($event)"
    ></flexy-crud-list>
  `
})
class TestHostComponent {
  @Input() pagination: FlexyPaginationData<FlexyModel<FlexyData>>;
  @Input() fields: FlexyListField<FlexyModel<FlexyData>>[];
  @Input() areCheckboxesVisible = false;
  @Input() areFavouritesVisible = false;
  @Input() favouritesIds: number[];

  @Output() favouriteChanged = new EventEmitter<FlexyListFavourites<FlexyModel<FlexyData>>>();
  @Output() changeChecked = new EventEmitter<FlexyListToggleable>();
  @Output() changeFilter = new EventEmitter<FlexyListFilter>();
}
