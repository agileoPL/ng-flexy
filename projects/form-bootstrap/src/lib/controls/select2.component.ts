import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SelectOption, SelectOptionData } from '@ng-flexy/form';
import { cloneDeep } from 'lodash';

@Component({
  template: `
    <ng-select
      *ngIf="!readonly && optionsData"
      #select
      [ngClass]="{ 'ng-select-multiple': multiple }"
      [formControl]="selectControl"
      [items]="optionsData"
      [placeholder]="placeholder"
      bindLabel="text"
      bindValue="value"
      [multiple]="multiple"
      [addTag]="addItem"
      [hideSelected]="hideSelected"
      [searchFn]="enableSearchByValue ? customSearchFn : null"
      [virtualScroll]="virtualScroll"
      [loading]="loading"
      [loadingText]="loadingText"
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
export class FlexyControlSelect2Component implements OnInit, OnChanges {
  @Input() control: FormControl;
  @Input() options: SelectOption[];
  @Input() default: string;
  @Input() readonly: boolean;
  @Input() multiple: boolean;
  @Input() addItem: boolean;
  @Input() placeholder: string;
  @Input() hideSelected: boolean;
  @Input() enableSearchByValue: boolean;

  @Input() rawIdKey: string;

  @Input() loading = false; // no	You can set the loading state from the outside (e.g. async items loading)
  @Input() loadingText = 'Loading...'; // Loading...	no	Set custom text when for loading items

  @Output() focused = new EventEmitter<Event>();
  @Output() clicked = new EventEmitter<Event>();
  @Output() changed = new EventEmitter<any>();

  selectControl: FormControl;

  virtualScroll = false; // Enable virtual scroll for better performance when rendering a lot of data
  optionsData: SelectOptionData[];

  ngOnInit() {
    this.selectControl = new FormControl(this._findValue());
  }

  private _findValue() {
    if (this.rawIdKey) {
      if (this.control.value && typeof this.control.value === 'object' && this.control.value[this.rawIdKey]) {
        const el = this.options.find(item => item._raw[this.rawIdKey] === this.control.value[this.rawIdKey]);
        return el.value;
      }
    } else {
      return this.control.value;
    }
    return;
  }

  ngOnChanges(changes) {
    if (changes.options) {
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
      this.virtualScroll = optionsData.length > 100;
      this.optionsData = optionsData;
    }
  }

  onChange(data: SelectOptionData | SelectOptionData[]) {
    const cloned = cloneDeep(data);
    if (this.rawIdKey) {
      if (Array.isArray(cloned)) {
        cloned.forEach(item => {
          item.value = item._raw;
        });
      } else {
        (cloned as SelectOptionData).value = (cloned as SelectOptionData)._raw;
      }
    }
    const value = cloned ? (Array.isArray(cloned) ? cloned.map(el => el.value) : cloned.value) : null;
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
