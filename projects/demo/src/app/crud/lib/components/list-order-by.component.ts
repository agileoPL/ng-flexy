import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlexyListField } from '../models/list-field.data';
import { FlexyModel } from '@ng-flexy/core';
import { FlexyData } from '@ng-flexy/core';
import { FlexyOrderBy, FlexyOrderDirectionEnum } from '../models/order-by.data';

@Component({
  selector: 'flexy-crud-list-order-by',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span *ngIf="orderByOptions && orderByOptions.length" role="button" [tooltip]="'CHANGE_CRUD_LIST_ORDER_BY' | translate">
      <span class="btn-group filter" dropdown placement="bottom right">
        <button type="button" class="btn btn-white btn-sm t2e-crud-order-by">
          <flexy-order-by-icon
            *ngIf="orderBy"
            (changed)="setOrderBy($event.field, $event.direction)"
            [field]="orderBy.field"
            [order]="orderBy.field"
            [sort]="orderBy.direction"
          >
            {{ orderBy?.field | orderByFieldLabel: fields | translate }}
          </flexy-order-by-icon>
        </button>

        <button
          dropdownToggle
          type="button"
          class="btn btn-white btn-sm dropdown-toggle t2e-dropdown-toggle"
          (click)="$event.stopPropagation()"
        >
          <i class="fa fa-caret-square-o-down" aria-hidden="true"></i>
        </button>

        <ul *dropdownMenu class="dropdown-menu" role="menu">
          <ng-container *ngFor="let opt of orderByOptions">
            <li role="menuitem">
              <a class="dropdown-item" role="button" (click)="setOrderBy(opt.key)">
                {{ opt.label | translate }}
              </a>
            </li>
          </ng-container>
        </ul>
      </span>
    </span>
  `
})
export class CrudListOrderByComponent implements OnInit {
  @Input() fields: FlexyListField<FlexyModel<FlexyData>>[];

  @Input() orderBy: FlexyOrderBy;

  @Output() changed = new EventEmitter<FlexyOrderBy>();

  orderByOptions = [];

  constructor() {}

  ngOnInit() {
    this.orderByOptions = this.fields
      .filter(item => !!item.sortable)
      .map(item => {
        return {
          key: item.key,
          label: item.label
        };
      });
  }

  setOrderBy(field: string, direction = FlexyOrderDirectionEnum.Asc) {
    const orderBy: FlexyOrderBy = {
      field,
      direction
    };

    if (orderBy.field === this.orderBy.field) {
      orderBy.direction =
        this.orderBy.direction === FlexyOrderDirectionEnum.Desc ? FlexyOrderDirectionEnum.Asc : FlexyOrderDirectionEnum.Desc;
    }
    this.changed.emit(orderBy);
  }
}
