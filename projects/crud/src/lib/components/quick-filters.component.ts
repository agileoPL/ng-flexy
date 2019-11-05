import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlexyFormsValidators } from '@ng-flexy/form';
import { FlexySessionStorageService } from '@ng-flexy/core';
import { TranslateService } from '@ngx-translate/core';
import { FlexyToastsService } from '@ng-flexy/toasts';
import { FlexyQuickFilterData } from '../models/quick-filters.model';
import { FlexyListFilter } from '../models/list-filter.data';
import { cloneDeep } from 'lodash';

const STORAGE_FILTERS_KEY = 'quickFilters';
const EXCLUDED_PARAMS = ['page', 'perPage', 'order', 'orderBy', 'orderDirection', 'sort', 'limit'];

@Component({
  selector: 'flexy-quick-filters',
  templateUrl: './quick-filters.component.html'
})
export class FlexyQuickFiltersComponent implements OnInit, OnChanges, AfterViewChecked {
  @ViewChild('newFilter', { static: false }) private newFilterInput: ElementRef;

  @Input() listId: string;
  @Input() filter: FlexyListFilter;

  @Output() selectedFilter = new EventEmitter<any>();

  formGroup: FormGroup;
  quickFilters: FlexyQuickFilterData[] = [];
  filterOptions: { key: string; label: string; value: any }[] = [];

  addNewFilterInput = false;
  selectedFilterId: number;

  constructor(
    private formBuilder: FormBuilder,
    private storageService: FlexySessionStorageService,
    private translateService: TranslateService,
    private toastsService: FlexyToastsService
  ) {}

  ngOnChanges(changes) {
    if (changes.filter) {
      this.setSelectedQuickFilter();
    }
  }

  ngOnInit() {
    this.formGroup = this.createFormGroup();
    this.loadQuickFilters();
  }

  ngAfterViewChecked() {
    if (this.newFilterInput) {
      this.newFilterInput.nativeElement.focus();
    }
  }
  insertNewFilter() {
    this.addNewFilterInput = true;
  }

  selectFilter(quickFilter: FlexyQuickFilterData) {
    if (this.selectedFilterId !== quickFilter.id) {
      this.selectedFilterId = quickFilter.id;
      this.selectedFilter.emit(quickFilter.params);
    }
  }

  save() {
    if (this.formGroup.valid) {
      const formData = this.formGroup.getRawValue();
      const newQuickFilter: FlexyQuickFilterData = {
        id: Date.now(),
        name: formData.filterValue,
        params: this.filter,
        hash: this.prepareHash(this.filter)
      };
      const duplicateName = this.quickFilters.find(filter => filter.name === newQuickFilter.name);
      if (duplicateName) {
        this.toastsService.warning(this.translateService.instant('QUICK_FILTER_DUPLICATE_NAME'));
      } else {
        this.quickFilters.push(newQuickFilter);
        this.addNewFilterInput = false;
        this.formGroup = this.createFormGroup();
        this.saveFiltersInStorage();
        this.selectedFilterId = newQuickFilter.id;
      }
    } else {
      console.error('No details ref');
    }
  }

  saveAfterEnterKey(event) {
    if (event.keyCode === 13) {
      this.save();
    }
  }

  delete(quickFilter: FlexyQuickFilterData) {
    const index = this.quickFilters.indexOf(quickFilter);
    this.quickFilters.splice(index, 1);
    this.saveFiltersInStorage();
  }

  cancel() {
    this.addNewFilterInput = false;
    this.formGroup = this.createFormGroup();
  }

  fullClearFilter() {
    const params = cloneDeep(this.filter);
    Object.keys(params).forEach(key => {
      if (key === 'page') {
        params[key] = 0;
      } else if (key === 'perPage' || key === 'limit') {
        // do nothking
      } else if (key === 'searchTerm') {
        params[key] = '';
      } else {
        params[key] = null;
      }
    });
    this.selectedFilter.emit({ ...params, page: 0, perPage: 30 });
  }

  clearFilter(filterKey: string) {
    const params = cloneDeep(this.filter);
    params[filterKey] = null;
    this.selectedFilter.emit(params);
  }

  private loadQuickFilters() {
    const filters = this.storageService.getData(STORAGE_FILTERS_KEY + this.listId);
    if (filters) {
      this.quickFilters = filters;
    }
    this.setSelectedQuickFilter();
  }

  private setSelectedQuickFilter() {
    const filterHash = this.prepareHash(this.filter);
    const filter = this.quickFilters.find(item => item.hash === filterHash);
    this.selectedFilterId = filter ? filter.id : null;
    this.filterOptions = this.prepareFilterOptions();
  }

  private prepareFilterOptions() {
    if (this.filter) {
      const filterOptions = [];
      const exclude = EXCLUDED_PARAMS;
      Object.keys(this.filter).forEach(key => {
        if (exclude.indexOf(key) === -1 && this.filter[key]) {
          filterOptions.push({
            key,
            label: this.translateService.instant('QUICK_FILTER_' + key.toUpperCase()),
            value: this.filter[key]
          });
        }
      });
      return filterOptions;
    }
  }

  private saveFiltersInStorage() {
    if (this.quickFilters.length >= 0) {
      this.storageService.setData(STORAGE_FILTERS_KEY + this.listId, this.quickFilters);
    }
  }

  private createFormGroup() {
    return this.formBuilder.group({
      filterValue: ['', [Validators.required, FlexyFormsValidators.noWhitespaceValidator]]
    });
  }

  private prepareHash(filter: FlexyListFilter): string {
    const prepFilter = cloneDeep(filter);
    EXCLUDED_PARAMS.forEach(param => {
      delete prepFilter[param];
    });
    return filter
      ? Object.keys(prepFilter)
          .filter(key => !!prepFilter[key])
          .map(key => key + ':' + prepFilter[key])
          .join(';')
      : '';
  }
}
