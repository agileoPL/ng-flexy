import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { FlexyData, FlexyLoggerService, FlexyModel, FlexySessionStorageService } from '@ng-flexy/core';
import { FlexyListAction, FlexyListHeaderAction } from '../models/list-action.data';
import { FlexyListFilter } from '../models/list-filter.data';
import { FlexyListField } from '../models/list-field.data';
import { FlexyListToggleable } from '../models/list-toggleable.data';
import { FlexyListFavourites } from '../models/list-favourites.data';
import { FlexyCrudTemplateDirective } from '../directives/template.directive';
import { debounceTime } from 'rxjs/operators';
import { FlexyPaginationFilterData } from '../models/pagination-filter.data';
import { FlexyOrderBy } from '../models/order-by.data';
import { FlexyFormLayoutJsonSchema } from '@ng-flexy/form';
import { cloneDeep } from 'lodash';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FlexyPaginationData } from '../models/pagination.data';

@Component({
  selector: 'flexy-crud-list',
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlexyListComponent implements OnInit, OnChanges, AfterContentInit, OnDestroy {
  @Input() id: string = 'CrudListComponent_UQ_' + Date.now();

  @Input() title: string;
  @Input() pagination: FlexyPaginationData<FlexyModel<FlexyData>>;
  @Input() filter: FlexyListFilter = { searchTerm: '' };
  @Input() filterSchema: FlexyFormLayoutJsonSchema[];
  @Input() actions: FlexyListAction<FlexyModel<FlexyData>>[];
  @Input() headerActions: FlexyListHeaderAction[] = [];

  @Input() cssClass: {
    table?: { [className: string]: boolean };
    thead?: { [className: string]: boolean };
    tbody?: { [className: string]: boolean };
    tr?: (item: FlexyModel<FlexyData>) => { [className: string]: boolean };
  } = {};

  @Input() fields: FlexyListField<FlexyModel<FlexyData>>[];
  @Input() fieldDefaultActionCallback: (model: FlexyModel<FlexyData>) => {};

  @Input() isSearchTermVisible = true;
  @Input() areCheckboxesVisible = false;
  @Input() areFavouritesVisible = false;
  @Input() isBottomPaginationVisible = true;
  @Input() areActionsVisible = true;
  @Input() favouritesIds: number[] = [];
  @Input() checkedIds: (string | number)[] = [];
  @Input() ignoreFieldAction = false;

  // @Input() detailsTemplateRef: TemplateRef<any>;
  // move to templates['item-details']
  @Input() detailsEnabler: FlexyListToggleable = {};

  @Input() maxTableWidth = 1200;
  @Input() searchInputPlaceholder: string;

  @Input() draggable = false;

  @Output() clearFilter = new EventEmitter<FlexyListFilter>();
  @Output() changeFilter = new EventEmitter<FlexyListFilter>();
  @Output() changeChecked = new EventEmitter<FlexyListToggleable>();
  @Output() favouriteChanged = new EventEmitter<FlexyListFavourites<FlexyModel<FlexyData>>>();
  @Output() listReordered = new EventEmitter<boolean>();

  @ContentChildren(FlexyCrudTemplateDirective) templatesRefs: QueryList<FlexyCrudTemplateDirective>;

  templates: {
    [key: string]: TemplateRef<any>;
  };

  checkedAsFavourite: FlexyListToggleable = {};
  checkedItems: FlexyListToggleable = {};
  checkedCounter = 0;
  detailsToggle: FlexyListToggleable = {};

  countVisibleFields = 0;

  private filterSubject: Subject<FlexyListFilter> = new Subject();
  private filterSubscription: Subscription;

  constructor(private storageService: FlexySessionStorageService, private logger: FlexyLoggerService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.favouritesIds) {
      this.initFavourites();
    }
    if (changes.checkedIds) {
      this.initCheckedItems();
    }
  }

  ngOnInit() {
    this.initCheckedItems();
    this.initFavourites();
    this.filterSubscription = this.filterSubject.pipe(debounceTime(300)).subscribe(filter => {
      this.changeFilter.emit(filter);
    });
    this.countVisibleFields = this.fields && this.fields.length ? this.fields.filter(item => !item.hidden).length : 0;
  }

  ngAfterContentInit() {
    const templatesRefs = {};
    if (this.templatesRefs) {
      this.templatesRefs.forEach(item => {
        templatesRefs[item.flexyCrud + item.flexyKey] = item.templateRef;
      });
    }
    this.templates = templatesRefs;
  }

  ngOnDestroy() {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  changePage(pagination: FlexyPaginationFilterData) {
    this.refreshFilter({ page: pagination.page });
  }

  checkFavourite(id: number) {
    const model = this.pagination.data.find(item => item.id === id);
    this.checkedAsFavourite[id] = !this.checkedAsFavourite[id];
    if (!this.checkedAsFavourite[id]) {
      delete this.checkedAsFavourite[id];
    }
    this.favouriteChanged.emit({
      favourite: !!this.checkedAsFavourite[id],
      model
    });
  }

  toggleItem(id: number) {
    this.checkedItems[id] = !this.checkedItems[id];
    if (!this.checkedItems[id]) {
      delete this.checkedItems[id];
    }
    this.refreshCheckedCounter();
    this.rememberCheckedItems();
    this.changeChecked.emit({ ...this.checkedItems });
  }

  toggleAll() {
    if (!this.checkedCounter) {
      this.pagination.data.forEach(item => {
        this.checkedItems[item.id] = true;
      });
    } else {
      this.checkedItems = {};
    }
    this.refreshCheckedCounter();
    this.rememberCheckedItems();
    this.changeChecked.emit({ ...this.checkedItems });
  }

  toggleDetails(id: number, setBool: boolean = null) {
    this.detailsToggle[id] = setBool !== null ? setBool : !this.detailsToggle[id];
  }

  changeListOrderBy(orderBy: FlexyOrderBy) {
    this.refreshFilter({
      page: 0,
      order: orderBy.field,
      sort: orderBy.direction
    });
  }

  callFieldAction(event, model: FlexyModel<FlexyData>, field: FlexyListField<FlexyModel<FlexyData>>) {
    if (!this.ignoreFieldAction) {
      event.stopPropagation();
      if (field.clickAction) {
        field.clickAction(model);
      } else if (this.fieldDefaultActionCallback) {
        this.fieldDefaultActionCallback(model);
      } else {
        // find first active
        const action = this.actions && this.actions.find(item => item.isActive(model));
        if (action && action.callback) {
          action.callback(model);
        }
      }
    }
  }

  resetSearchTerm() {
    this.searchChange('');
  }

  searchChange(term) {
    this.refreshFilter({ page: 0, searchTerm: term ? decodeURIComponent(term.replace(/%(?![0-9][0-9a-fA-F]+)/g, '%25')) : '' });
  }

  onFilterChanged(filter) {
    this.refreshFilter({ page: 0, ...filter });
  }

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.pagination.data, event.previousIndex, event.currentIndex);
    this.listReordered.emit(true);
  }

  listTrackBy(index: number, item: FlexyData) {
    return item.id;
  }

  private initFavourites() {
    if (this.areFavouritesVisible) {
      if (this.favouritesIds && this.favouritesIds.length) {
        const checkedAsFavourite: FlexyListToggleable = {};
        this.favouritesIds.forEach(itemId => {
          checkedAsFavourite[itemId] = true;
        });
        this.checkedAsFavourite = checkedAsFavourite;
      }
    }
  }

  private refreshCheckedCounter() {
    this.checkedCounter = Object.keys(this.checkedItems).length;
  }

  private refreshFilter(filter: FlexyListFilter) {
    const merged = cloneDeep(this.filter);
    Object.assign(merged, filter);
    this.filter = merged;
    this.filterSubject.next(this.filter);
  }

  private initCheckedItems() {
    if (this.checkedIds) {
      const checked: FlexyListToggleable = {};
      this.checkedIds.forEach(el => {
        checked[el] = true;
      });
      this.checkedItems = checked;
    } else {
      const checkedDevices = this.storageService.getData(this.rememberKey());
      this.checkedItems = checkedDevices ? checkedDevices : {};
    }
    this.refreshCheckedCounter();
    if (this.checkedItems && this.checkedItems !== {}) {
      this.changeChecked.emit({ ...this.checkedItems });
    }
  }

  private rememberCheckedItems() {
    this.storageService.setData(this.rememberKey(), this.checkedItems);
  }

  private rememberKey(): string {
    return 'checkedItems' + this.id;
  }
}
