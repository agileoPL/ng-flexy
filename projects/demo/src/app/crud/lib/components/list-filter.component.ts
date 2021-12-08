import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FlexyListFilter } from '../models/list-filter.data';
import { FlexyForm, FlexyFormJsonMapperService, FlexyFormLayoutJsonSchema } from '@ng-flexy/form';
import { Subscription } from 'rxjs';
import { isEqual } from 'lodash';

@Component({
  selector: 'flexy-crud-list-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="t2e-reports-filter-all filter-all" [ngClass]="{ 'not-empty': notEmpty }" (click)="clearFilter(); $event.stopPropagation()">
      <i class="fa fa-th-list"></i> {{ 'FLEXY_CRUD_LIST_FILTER_ALL' | translate }}
    </a>
    <div (click)="$event.stopPropagation()">
      <flexy-layout *ngIf="flexyForm" [schema]="flexyForm.schema"></flexy-layout>
    </div>
  `
})
export class CrudListFilterComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() filter: FlexyListFilter = { searchTerm: '' };
  @Input() filterSchema: FlexyFormLayoutJsonSchema[];

  @Output() changed = new EventEmitter<FlexyListFilter>();

  flexyForm: FlexyForm;
  notEmpty = false;

  private subscription: Subscription;

  constructor(private formJsonMapperService: FlexyFormJsonMapperService, private elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.quickFilterChange(changes);
    this.checkNotEmpty();
    this.subscribeFormChanges();
  }

  ngOnInit() {
    this.flexyForm = this.formJsonMapperService.createForm({ schema: this.filterSchema }, false, this.filter);

    this.subscribeFormChanges();
    this.checkNotEmpty();
  }

  ngAfterViewInit() {
    // bind to label click and clear value for filter
    this.elementRef.nativeElement.querySelectorAll('.flexy-field-label').forEach((el: HTMLElement) => {
      el.onclick = event => {
        const formName = (event.target as HTMLElement).getAttribute('data-rel-name');
        if (formName && this.flexyForm.formGroup.contains(formName)) {
          this.flexyForm.formGroup.get(formName).setValue(null);
        }
      };
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  clearFilter() {
    this.flexyForm.formGroup.reset();
    Object.keys(this.flexyForm.formGroup.value).forEach(key => {
      this.flexyForm.formGroup.get(key).setValue(null);
    });
  }

  private subscribeFormChanges() {
    if (this.flexyForm && this.flexyForm.formGroup) {
      this.subscription = this.flexyForm.formGroup.valueChanges.subscribe(values => {
        if (this.flexyForm.formGroup.valid) {
          this.changed.emit(this.flexyForm.formGroup.getRawValue());
        }
      });
    }
  }

  private checkNotEmpty() {
    this.notEmpty =
      this.flexyForm && this.flexyForm.formGroup && Object.values(this.flexyForm.formGroup.value).some(value => value !== null);
  }

  private quickFilterChange(changes: SimpleChanges) {
    if (changes.filter && this.flexyForm && this.flexyForm.formGroup) {
      if (!isEqual(changes.filter.currentValue, changes.filter.previousValue)) {
        Object.keys(changes.filter.currentValue).forEach(key => {
          if (this.flexyForm.formGroup.get(key) && !isEqual(this.flexyForm.formGroup.get(key).value, changes.filter.currentValue[key])) {
            this.flexyForm.formGroup.get(key).setValue(changes.filter.currentValue[key]);
          }
        });
      }
    }
  }
}
