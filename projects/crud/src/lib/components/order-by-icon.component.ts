import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FlexyOrderBy, FlexyOrderDirectionEnum } from '../models/order-by.data';

@Component({
  selector: 'flexy-order-by-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span role="button" class="t2e-btn-orderBy-{{ field }}" (click)="onClick($event); $event.stopPropagation()">
      <ng-content></ng-content>
      <i
        class="fa"
        [ngClass]="{
          'fa-sort': field !== order,
          'fa-sort-asc': sort === SYMBOL_ASC && field === order,
          'fa-sort-desc': sort === SYMBOL_DESC && field === order
        }"
      ></i>
    </span>
  `
})
export class OrderByIconComponent {
  @Input() field: string;
  @Input() order: string;
  @Input() sort = FlexyOrderDirectionEnum.Desc;

  @Output() changed = new EventEmitter<FlexyOrderBy>();

  SYMBOL_ASC = FlexyOrderDirectionEnum.Asc;
  SYMBOL_DESC = FlexyOrderDirectionEnum.Desc;

  constructor() {}

  onClick(event) {
    event.stopPropagation();
    let direction = FlexyOrderDirectionEnum.Desc;
    if (this.field === this.order) {
      direction = this.sort === FlexyOrderDirectionEnum.Asc ? FlexyOrderDirectionEnum.Desc : FlexyOrderDirectionEnum.Asc;
    }
    this.changed.emit({ field: this.field, direction });
  }
}
