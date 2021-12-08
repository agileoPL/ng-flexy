import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SelectOption, SelectOptionData } from '@ng-flexy/form';

@Component({
  template: `
    <select
      *ngIf="!readonly"
      class="form-control"
      [formControl]="control"
      [attr.placeholder]="getOptionText(default)"
      (focus)="focused.emit($event)"
      (click)="clicked.emit($event)"
      (change)="onChanged($event)"
    >
      <option *ngFor="let option of optionsData" [ngValue]="option.value">
        {{ option.text }}
      </option>
    </select>
    <flexy-control-readonly *ngIf="readonly" [value]="getOptionText(control.value)" [default]="getOptionText(default)">
    </flexy-control-readonly>
  `,
  selector: 'flexy-control-select'
})
export class FlexyControlSelectComponent implements OnInit {
  @Input() control: FormControl;
  @Input() options: SelectOption[];
  @Input() default: string;
  @Input() readonly: boolean;

  @Output() focused = new EventEmitter<Event>();
  @Output() clicked = new EventEmitter<Event>();
  @Output() changed = new EventEmitter<Event>();

  optionsData: SelectOptionData[];

  ngOnInit() {
    const optionsData = [{ value: null, text: '--' }];

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

  onChanged(data: SelectOptionData) {
    this.changed.emit(data.value);
  }

  getOptionText(value): string {
    if (value || value === 0) {
      const opt: SelectOption = this.options.find((item: SelectOption) => '' + item.value === '' + value);
      return opt ? opt.text : '';
    } else if (value === null || value === '' || value === void 0) {
      return null;
    }
  }
}
