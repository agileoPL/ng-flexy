import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SelectOption, SelectOptionData } from '@ng-flexy/form';

@Component({
  template: `
    <ng-select
      *ngIf="!readonly && optionsData"
      #select
      [ngClass]="{ 'ng-select-multiple': multiple }"
      [formControl]="control"
      [items]="optionsData"
      [placeholder]="placeholder"
      bindLabel="text"
      bindValue="value"
      [multiple]="multiple"
      [addTag]="addItem"
      [hideSelected]="hideSelected"
      [searchFn]="enableSearchByValue ? customSearchFn : null"
      (change)="onChange($event)"
    >
      <ng-template ng-label-tmp let-item="item" let-clear="clear">
        <span *ngIf="item['prefixHtml']" [innerHTML]="item['prefixHtml']"></span> <span title="{{ item.text }}">{{ item.text }}</span>
        <span class="ng-value-icon right t2e-unselect-value" (click)="clear(item)">×</span>
      </ng-template>
      <ng-template ng-option-tmp let-item="item" let-index="index">
        <span *ngIf="item['prefixHtml']" [innerHTML]="item['prefixHtml']"></span> <span title="{{ item.text }}">{{ item.text }}</span>
      </ng-template>
    </ng-select>
    <flexy-control-readonly *ngIf="readonly" [value]="getReadonlyInfo(control?.value)" [default]="default"> </flexy-control-readonly>
  `,
  selector: 'flexy-control-select2',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlexyControlSelect2Component implements OnInit {
  @Input() control: FormControl;
  @Input() options: SelectOption[];
  @Input() default: string;
  @Input() readonly: boolean;
  @Input() multiple: boolean;
  @Input() addItem: boolean;
  @Input() placeholder: string;
  @Input() hideSelected: boolean;
  @Input() enableSearchByValue: boolean;

  @Output() focused = new EventEmitter<Event>();
  @Output() clicked = new EventEmitter<Event>();
  @Output() changed = new EventEmitter<any>();

  optionsData: SelectOptionData[];

  ngOnInit() {
    const optionsData = [];
    if (this.options) {
      optionsData.push(
        ...this.options.map(item => {
          let itemData: SelectOptionData;
          if (typeof item === 'object' && item.hasOwnProperty('value')) {
            itemData = item;
          } else {
            itemData = {
              value: item,
              text: '' + item
            };
          }
          return itemData;
        })
      );
    }

    this.optionsData = optionsData;
  }

  onChange(data: SelectOptionData | SelectOptionData[]) {
    const value = data ? (Array.isArray(data) ? data.map(el => el.value) : data.value) : null;
    this.control.setValue(value);
    this.changed.emit(value);
  }

  getReadonlyInfo(value): string {
    if (value && this.addItem) {
      return value;
    }
    if ((value || value === 0) && this.optionsData) {
      const opt: SelectOption = this.optionsData.find((item: SelectOption) => '' + item.value === '' + value);
      return opt ? opt.text : '';
    } else if (value === null || value === '' || value === void 0) {
      return null;
    }
  }

  customSearchFn(term: string, item: SelectOption) {
    return (
      (item.text && item.text.toLowerCase().includes(term.toLowerCase())) ||
      (item.value && item.value.toLowerCase().includes(term.toLowerCase()))
    );
  }
}
